<template>
  <div id='wait_index'>
    <div class='container clear'>
      <div class='name'><span>林育加</span></div>
      <div class='info_box'>
        <div class='info'>调研信息录入</div>
        <div class='ps'><span class='state'>未审核</span><span class='time'>2019-10-30 15:38:16</span></div>
      </div>
    </div>
    <div class='container clear'>
      <div class='name'><span>林育加</span></div>
      <div class='info_box'>
        <div class='info'>调研信息录入</div>
        <div class='ps'><span class='state'>未审核</span><span class='time'>2019-10-30 15:38:16</span></div>
      </div>
    </div>
    <div class='container clear'>
      <div class='name'><span>林育加</span></div>
      <div class='info_box'>
        <div class='info'>调研信息录入</div>
        <div class='ps'><span class='state'>未审核</span><span class='time'>2019-10-30 15:38:16</span></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {
  },
  data() {
    return {
      
    };
  },
  mounted(){

  },
  beforeRouteLeave(to, from, next) {

  },
  methods: {
    
  },
  
}
</script>
<style lang="less" scoped>
  #wait_index{
    position: absolute;
    left:0;
    right:0;
    top:0;
    bottom:0;
    padding:0 .08rem;
    background:#f4f3f6;
    .container{
      margin-top:.05rem;
      padding:.08rem;
      background:#fff;
      border-radius: .05rem;
      .name{
        span{
          float:left;
          width:.38rem;
          height:.38rem;
          line-height:.38rem;
          font-size: .1rem;
          color:#5398ff;
          text-align: center;
          background-color:#d0e3ff;
          border-radius: 50%;
        }
      }
      .info_box{
        margin-left:.44rem;
        .info{
          color:#010101;
          margin-bottom:.03rem;
          font-size: .16rem;
          font-weight: 500;
        }
        .ps{
          font-size: 0;
          .state{
            font-size: .12rem;
            color:#ff4231;
            font-weight: 500;
          }
          .time{
            float:right;
            font-size: .12rem;
            color:#c2c2c2;
          }
        }
      }
    }
  }
</style>