<template>
  <div class="main-container">
    <md-toolbar class="md-primary">
      <h3 class="md-title">HCTF</h3>
    </md-toolbar>
    <div class="md-layout md-gutter main-panel">
      <div class="md-layout-item">
        <md-table md-card>
          <md-table-toolbar>
            <h1 class="md-title">Users</h1>
          </md-table-toolbar>

          <md-table-row>
            <md-table-head md-numeric>ID</md-table-head>
            <md-table-head>Name</md-table-head>
            <md-table-head>Email</md-table-head>
            <md-table-head>Gender</md-table-head>
            <md-table-head>Job Title</md-table-head>
          </md-table-row>

          <md-table-row>
            <md-table-cell md-numeric>1</md-table-cell>
            <md-table-cell>Shawna Dubbin</md-table-cell>
            <md-table-cell>sdubbin0@geocities.com</md-table-cell>
            <md-table-cell>Male</md-table-cell>
            <md-table-cell>Assistant Media Planner</md-table-cell>
          </md-table-row>

          <md-table-row>
            <md-table-cell md-numeric>2</md-table-cell>
            <md-table-cell>Odette Demageard</md-table-cell>
            <md-table-cell>odemageard1@spotify.com</md-table-cell>
            <md-table-cell>Female</md-table-cell>
            <md-table-cell>Account Coordinator</md-table-cell>
          </md-table-row>

          <md-table-row>
            <md-table-cell md-numeric>3</md-table-cell>
            <md-table-cell>Vera Taleworth</md-table-cell>
            <md-table-cell>vtaleworth2@google.ca</md-table-cell>
            <md-table-cell>Male</md-table-cell>
            <md-table-cell>Community Outreach Specialist</md-table-cell>
          </md-table-row>
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
  export default {
    name: 'HelloWorld',
    data() {
      return {
        msg: 'Welcome to Your Vue.js App'
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
