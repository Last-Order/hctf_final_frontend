<template>
  <div class="main-container">
    <md-toolbar class="md-primary">
      <h3 class="md-title">HCTF 2017</h3>
    </md-toolbar>
    <div class="md-layout main-panel">
      <div class="md-layout-item md-gutter">
        <md-card>
          <md-card-header>
            <div class="md-title">日志</div>
            <md-field style="width: 200px">
              <label for="logFilter">日志筛选器</label>
              <md-select v-model="logFilter" name="logFilter" id="logFilter">
                <md-option value="3">DEBUG 及以上</md-option>
                <md-option value="2">INFO 及以上</md-option>
                <md-option value="1">WARNING 及以上</md-option>
                <md-option value="0">ERROR 及以上</md-option>
              </md-select>
            </md-field>
          </md-card-header>

          <md-card-content>
            <template v-for="log in logs.filter(l => l.level <= logFilter)">
              <div v-if="log.type === 'team:score'">
                [<span :class="getLevelClassName(log.level)">{{log.level | levelToText}}</span>]
                [<span class="log-time"> {{log.data.time}} </span>] 队伍
                <span class="log-teamName"> {{log.data.teamName | parseTeamName }} </span> 分数
                <span class="log-score" :class="parseInt(log.data.inc) < 0 ? 'log-score-neg' : 'log-score-pos'">
                      {{parseInt(log.data.inc) < 0 ? '-' : '+'}}{{Math.abs(log.data.inc)}}
                    </span>
              </div>
              <div v-if="log.type === 'flag:submit'">
                [<span :class="getLevelClassName(log.level)">{{log.level | levelToText}}</span>]
                [<span class="log-time"> {{ log.time }} </span>] 队伍 <span class="log-teamName"> {{log.data.teamName | parseTeamName}} </span>
                提交
                <span v-if="log.data.challengeName">问题</span> <span class="log-challenge-name">{{ log.data.challengeName }}</span>
                Flag
                <span class="log-flag">{{ log.data.flag}} </span>
                <span class="log-flag-status"> ({{log.data.status}}) </span>
              </div>
              <div v-if="log.type === 'status'">
                [<span :class="getLevelClassName(log.level)">{{log.level | levelToText}}</span>]
                [<span class="log-time"> {{ log.time }} </span>] 队伍 <span class="log-teamName"> {{log.data.teamName | parseTeamName }} </span>
                的
                问题 <span class="log-challenge-name">{{ log.data.challengeName }}</span>
                服务状态现在为 <span style="color: red;">down</span>
              </div>
            </template>

          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>
<script>
  import io from "socket.io-client";

  export default {
    data() {
      return {
        showAdmin: true,
        token: '',
        loading: false,
        logs: [],
        levelMap: ["ERROR", "WARNING", "INFO", "DEBUG"],
        logFilter: 3
      }
    },
    mounted() {
      this.login();
    },
    methods: {
      login() {
        let token = this.token;
        this.showAdmin = true;
        let socket = io("http://192.168.1.110:4000");
        socket.on("message", message => {
          if (this.logs.length >= 1500) {
            // 日志数量上限
            this.logs.pop();
          }
          this.logs.unshift(JSON.parse(message));
        })
      },
      getLevelClassName(level) {
        return "log-level-" + this.levelMap[level].toLowerCase();
      }
    },
    filters: {
      levelToText(level) {
        const levelMap = ["ERROR", "WARNING", "INFO", "DEBUG"];
        return levelMap[level];
      },
      parseTeamName(teamName) {
        return {
          Team01: "A8",
          Team02: "AAA",
          Team03: "Blue-Whale",
          Team04: "kn0ck",
          Team05: "Redbud",
          Team06: "Eur3kA",
          Team07: "Nu1L",
          Team08: "ROIS",
          Team09: "FlappyPig",
          Team10: "******",
        }[teamName];
      }
    }
  }
</script>
<style scoped>
  .main-container {
    margin: 0;
    padding: 0;
  }

  .main-panel {
    padding: 0 2rem;
    margin: 1rem 0;
  }

  .log-time {
    color: #aaa;
  }

  .log-teamName {
    font-weight: bold;
  }

  .log-score, .log-flag {
    font-family: Consolas, monospace;
  }

  .log-challenge-name {
    font-weight: bold;
  }

  .log-score-neg {
    color: red;
  }

  .log-score-pos {
    color: #448833;
  }

  .log-level-error {
    color: red;
  }

  .log-level-warning {
    color: orange;
  }

  .log-level-info {
    color: #38a5ff;
  }

  .log-level-debug {
    color: #aaa;
  }
</style>
