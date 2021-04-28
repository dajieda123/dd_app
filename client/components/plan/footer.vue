<template>
  <div>
    <van-tabbar v-model="currentIndex" active-color="#38d381" inactive-color="#656565">
      
      <van-tabbar-item to="/plan/" name="myWork">
        <span>我的</span>
        <img slot="icon" :src="currentIndex=='myWork' ? myWork_act : myWork">
      </van-tabbar-item>
      <van-tabbar-item to="/plan/teamWork/" name="teamWork">
        <span>大厅</span>
        <img slot="icon" :src="currentIndex=='teamWork' ? teamWork_act : teamWork">
      </van-tabbar-item>
      <van-tabbar-item to="/plan/workRank/" name="workRank">
        <span>排行</span>
        <img slot="icon" :src="currentIndex=='workRank' ? workRank_act : workRank">
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  props:{
    foot_active:{
      type: String,
      required: true,
    },
  },
  data() {
    return {
      currentIndex:this.foot_active,
      myWork:require('~/assets/images/plan/myWork.png'),
      myWork_act:require('~/assets/images/plan/myWork_act.png'),
      teamWork:require('~/assets/images/plan/teamWork.png'),
      teamWork_act:require('~/assets/images/plan/teamWork_act.png'),
      workRank:require('~/assets/images/plan/workRank.png'),
      workRank_act:require('~/assets/images/plan/workRank_act.png'),
    };
  },
}
</script>

<style lang="less" scoped>
  .van-tabbar{
    height: .42rem;
    border-top:1px solid #f2f2f2;
    /deep/ .van-tabbar-item__icon{
      margin-bottom: .03rem;
      font-size: .18rem !important;
      img{
        margin-bottom:.02rem;
        //height:auto;
      }
    }
    /deep/ .van-tabbar-item__text{
      font-size:.1rem;
    }
  }
  
</style>
