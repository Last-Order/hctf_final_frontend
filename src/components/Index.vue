<template>
  <div class="main-container">
    <md-toolbar class="md-primary">
      <h3 class="md-title">HCTF 2017</h3>
      <div class="md-toolbar-section-end">
        <div style="margin-right: 2rem">
          <img src="static/logo.png" class="logo" @click="$router.push('/log')">
        </div>
      </div>
    </md-toolbar>
    <div class="md-layout md-gutter main-panel">
      <div class="md-layout md-gutter">
        <div class="md-layout-item">
          <md-table md-card>
            <md-table-toolbar>
              <div class="md-title">Ranking</div>
            </md-table-toolbar>

            <md-table-row>
              <md-table-head md-numeric>#</md-table-head>
              <md-table-head>队伍名</md-table-head>
              <md-table-head>分数</md-table-head>
            </md-table-row>

            <template v-for="(team, index) in ranking">
              <md-table-row :key="team.teamName">
                <md-table-cell md-numeric>{{index + 1}}</md-table-cell>
                <md-table-cell>{{team.teamName}}</md-table-cell>
                <md-table-cell>
                  <span :class="team.effect">{{team.score}}</span>
                </md-table-cell>
              </md-table-row>
            </template>
          </md-table>
          <md-card style="margin-top: 2rem;">
            <md-card-content>
              <count-down></count-down>
            </md-card-content>
          </md-card>
        </div>
        <div class="md-layout-item">
          <md-card>
            <md-card-header>
              <div class="md-title">Scores</div>
            </md-card-header>
            <md-card-content>
              <template v-if="ranking.length === 0">
                <span class="md-display-1">暂不可用</span>
              </template>
              <template v-else>

                <chart :options="data"></chart>
              </template>
            </md-card-content>
          </md-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import System from "@/model/System";
  import io from "socket.io-client";
  import ECharts from 'vue-echarts/components/ECharts.vue'
  import CountDown from "@/components/Common/Countdown";
  import 'echarts/lib/chart/line'
  import 'echarts/lib/component/tooltip'
  import 'echarts/lib/component/legendScroll'

  export default {
    name: 'Index',
    data() {
      return {
        ranking: [],
        allScoreLogs: [],
        startTime: new Date(),
        scores: {},
        data: {
          title: {
            text: "Scores"
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            type: "scroll",
            data: []
          },
          xAxis: {
            type: "time",
            boundaryGap: false,
          },
          yAxis: {
            type: "value"
          },
          series: []
        },
        loading: false,
      }
    },
    async mounted() {
      let systemInfo = await System.getSystemInfo();
      this.startTime = new Date(systemInfo.startTime);
      this.loadRanking();
      this.watchChanges();
    },
    watch: {
    },
    methods: {
      watchChanges() {
        let socket = io("http://192.168.1.110:4000");
        socket.on("message", message => {
          message = JSON.parse(message);
          if (message.type === "team:score") {
            this.allScoreLogs.push(message);
            // 分数变动
            let logTime = new Date(message.data.time);
            // 更新分数映射表
            this.scores = {
              ...this.scores,
              [message.data.teamName]: (this.scores[message.data.teamName] || 0) + parseInt(message.data.inc)
            };

            let line = this.data.series.find(line => line.name === message.data.teamName);
            // 更新折线图
            if (line){
              line.data.push({
                name: `${logTime.getFullYear()}-${logTime.getMonth() + 1}-${logTime.getDate()} ${logTime.getHours()}:${logTime.getMinutes()}:${logTime.getSeconds()}`,
                value: [
                  logTime,
                  this.scores[message.data.teamName]
                ]
              })
            }
            else{
              this.data.series.push({
                name: message.data.teamName,
                type: "line",
                data: [{
                  name: `${this.startTime.getFullYear()}-${this.startTime.getMonth() + 1}-${this.startTime.getDate()} ${this.startTime.getHours()}:${this.startTime.getMinutes()}:${this.startTime.getSeconds()}`,
                  value: [
                    this.startTime,
                    0
                  ]
                },{
                  name: `${logTime.getFullYear()}-${logTime.getMonth() + 1}-${logTime.getDate()} ${logTime.getHours()}:${logTime.getMinutes()}:${logTime.getSeconds()}`,
                  value: [
                    logTime,
                    this.scores[message.data.teamName]
                  ]
                }]
              })
            }
            // 更新排行表
            let ranking = Array.from(Object.keys(this.scores), c => {
              return {
                teamName: c,
                score: this.scores[c]
              }
            });
            ranking = ranking.sort((a, b) => {
              return b.score - a.score;
            });

            // 分数变化效果
            let changedTeam = ranking.find(t => t.teamName === message.data.teamName);
            changedTeam.effect = "";
            this.$nextTick(() => {
              changedTeam.effect = parseInt(message.data.inc) < 0 ? "score-desc" : "score-inc";
            });
            this.ranking = ranking;
          }
        });
      },
      async loadRanking() {
        let result = await System.getAllLogs();

        if (result.length === 0){
          return;
        }

        let scoreLogs = result.filter(log => {
          return log.type === "team:score";
        });
        this.allScoreLogs = scoreLogs;
        // 生成排行
        let scores = {};
        for (let log of scoreLogs) {
          if (scores[log.data.teamName]) {
            scores[log.data.teamName] += parseInt(log.data.inc);
          }
          else {
            scores[log.data.teamName] = parseInt(log.data.inc);
          }
        }
        this.scores = scores;
        let ranking = Array.from(Object.keys(scores), c => {
          return {
            teamName: c,
            score: scores[c]
          }
        });
        ranking = ranking.sort((a, b) => {
          return b.score - a.score;
        });
        this.ranking = ranking;
        this.startTime = new Date(scoreLogs.reduce((a, b) => {
          let timeA = a.data && new Date(a.data.time) || a;
          let timeB = b.data && new Date(b.data.time) || b;
          return Math.min(timeA.valueOf(), timeB.valueOf());
        }));
        this.data.series = this.generateChartSeries(scoreLogs);
        this.data.legend.data = Object.keys(scores);
      },
      generateChartSeries(scoreLogs = []) {
        if (scoreLogs.length === 0) {
          return [];
        }
        let series = [];
        let teamScores = [];
        let data = [];
        let teamNames = Array.from(this.ranking, r => r.teamName);
        for (let teamName of teamNames){
          let scoreLogs = this.allScoreLogs.filter(log => log.data.teamName === teamName).sort((a, b) => {
            return new Date(a.data.time) - new Date(b.data.time);
          });
          for (let log of scoreLogs) {
            if (!teamScores[log.data.teamName]) {
              // init
              teamScores[log.data.teamName] = 0;
              data[log.data.teamName] = [];
              // 起始点
              data[log.data.teamName].push({
                name: `${this.startTime.getFullYear()}-${this.startTime.getMonth() + 1}-${this.startTime.getDate()} ${this.startTime.getHours()}:${this.startTime.getMinutes()}:${this.startTime.getSeconds()}`,
                value: [
                  this.startTime,
                  0
                ]
              })
            }
            let nowScore = teamScores[log.data.teamName] + parseInt(log.data.inc);
            teamScores[log.data.teamName] += parseInt(log.data.inc);
            let logTime = new Date(log.data.time);
            data[log.data.teamName].push({
              name: `${logTime.getFullYear()}-${logTime.getMonth() + 1}-${logTime.getDate()} ${logTime.getHours()}:${logTime.getMinutes()}:${logTime.getSeconds()}`,
              value: [
                logTime,
                nowScore
              ]
            });
          }
        }

        series = Array.from(Object.keys(teamScores), teamName => {
          return {
            name: teamName,
            type: 'line',
            data: data[teamName]
          }
        });

        return series;
      }
    },
    components: {
      'chart': ECharts,
      CountDown
    }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .main-container {
    margin: 0;
    padding: 0;
  }

  .main-panel {
    padding: 0 2rem;
    margin: 1rem 0;
  }

  .logo {
    max-height: 80px;
    cursor: pointer;
  }

  .echarts {
    width: 100%;
  }

  .score-desc {
    animation-duration: 4s;
    animation-name: desc;
  }
  .score-inc {
    animation-duration: 4s;
    animation-name: inc;
  }
  @keyframes desc {
    from {
      color: #ff6d6d;
    }
    to {
      color: black;
    }
  }
  @keyframes inc {
    from {
      color: #11b95c;
    }
    to {
      color: black;
    }
  }
</style>
