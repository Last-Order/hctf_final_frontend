<template>
  <div class="main-container">
    <md-toolbar class="md-primary">
      <h3 class="md-title">HCTF</h3>
    </md-toolbar>
    <div class="md-layout md-gutter main-panel">
      <div class="md-layout-item">
        <md-table md-card>
          <md-table-toolbar>
            <h1 class="md-title">Ranking</h1>
          </md-table-toolbar>

          <md-table-row>
            <md-table-head md-numeric>#</md-table-head>
            <md-table-head>队伍名</md-table-head>
            <md-table-head>分数</md-table-head>
          </md-table-row>

          <template v-for="(team, index) in ranking">
            <md-table-row>
              <md-table-cell md-numeric>{{index + 1}}</md-table-cell>
              <md-table-cell>{{team.teamName}}</md-table-cell>
              <md-table-cell>{{team.score}}</md-table-cell>
            </md-table-row>
          </template>
        </md-table>
      </div>
      <div class="md-layout-item">
        <md-card>
          <md-card-header>
            <div class="md-title">Card without hover effect</div>
          </md-card-header>

          <md-card-content>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Optio itaque ea, nostrum odio. Dolores, sed
            accusantium quasi non.
          </md-card-content>

          <md-card-actions>
            <md-button>Action</md-button>
            <md-button>Action</md-button>
          </md-card-actions>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
  import System from "@/model/System";
  export default {
    name: 'HelloWorld',
    data() {
      return {
        ranking: [],
      }
    },
    mounted(){
      this.loadRanking();
    },
    methods: {
      async loadRanking(){
        let result = await System.getAllLogs();
        let scoreLogs = result.filter(log => {
          return log.type === "team:score";
        });
        // 生成排行
        let scores = {};
        for (let log of scoreLogs){
          if (scores[log.data.teamName]){
            scores[log.data.teamName] += parseInt(log.data.inc);
          }
          else{
            scores[log.data.teamName] = parseInt(log.data.inc);
          }
        }
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
      }
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
</style>
