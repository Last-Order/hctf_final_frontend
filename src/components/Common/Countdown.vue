<template>
  <div class="countdown">
    <template v-if="disable">
      <span>读取中</span>
    </template>
    <template v-else>
      <span>
      {{ countdown.days | formatTime }} 天
      {{ countdown.hours | formatTime}} 小时
      {{ countdown.minutes | formatTime}} 分钟
      {{ countdown.seconds | formatTime}} 秒   </span>
      <div class="countdown-title">{{ countdownTitle }}</div>
    </template>
  </div>
</template>
<style>
  .countdown {
    text-align: center;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    padding: 0.5rem 0 0;
  }
  .countdown span {
    font-size: xx-large;
  }
  .countdown-title {
    color: #aaa;
  }
</style>
<script>
  import System from "@/model/System";
  export default {
    data() {
      return {
        countdown: {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        },
        start: undefined,
        end: undefined,
        disable: true,
      }
    },
    computed: {
      countdownTitle() {
        if (new Date() < this.startTime) {
          return "距离开始";
        }
        else {
          if (new Date() > this.endTime) {
            return "已结束";
          }
          return "距离结束";
        }
      },
      startTime() {
        return this.start === undefined ? new Date() : this.start;
      },
      endTime() {
        return this.end === undefined ? new Date() : this.end;
      }
    },
    async mounted() {
      let systemInfo = await System.getSystemInfo();
      this.start = new Date(systemInfo.startTime);
      this.end = new Date(systemInfo.endTime);
      this.disable = false;
      while (true) {
        if (this.$route.name !== "Index") {
          break;
        }
        this.flush();
        await (() =>
          new Promise(resolve => setTimeout(resolve, 1000)))();
      }
    },
    methods: {
      flush() {
        if (this.startTime && this.endTime) {
          let nowTime = new Date();
          let diff;
          if (nowTime < this.startTime) {
            diff = Math.round(Math.abs(this.startTime.valueOf() - new Date().valueOf()) / 1000);
          }
          else {
            diff = Math.round(Math.abs(this.endTime.valueOf() - new Date().valueOf()) / 1000);
          }
          let days = Math.floor(diff / 86400);
          diff = diff % 86400;
          let hours = Math.floor(diff / 3600);
          diff = diff % 3600;
          let minutes = Math.floor(diff / 60);
          diff = diff - minutes * 60;
          let seconds = diff;
          this.countdown.days = days;
          this.countdown.hours = hours;
          this.countdown.minutes = minutes;
          this.countdown.seconds = seconds;
        }
      }
    },
    filters: {
      formatTime(str){
        return isNaN(str) ? "--" : str;
      }
    }
  }
</script>
