<template>
  <div id='created_index'>
    
    <div class='tit'>招商调研</div>
    <div class='line'><van-cell title="调研信息录入" icon="../../assets/images/plan/rank2.png" is-link /></div>
    <div class='line'><van-cell title="调研信息录入" icon="../../assets/images/plan/rank1.png" is-link /></div>
    <div class='line'><van-cell title="调研信息录入" icon="../../assets/images/plan/rank1.png" is-link /></div>
    
    <div class='tit'>IT信息调研</div>
    <div class='line'><van-cell title="调研信息录入" icon="../../assets/images/plan/rank1.png" is-link /></div>
    <div class='line'><van-cell title="调研信息录入" icon="../../assets/images/plan/rank1.png" is-link /></div>
    <div class='line'><van-cell title="调研信息录入" icon="../../assets/images/plan/1.png" is-link /></div>
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
  #created_index{
    position: absolute;
    left:0;
    right:0;
    top:0;
    bottom:0;
    padding:0 .08rem;
    background:#f4f3f6;
    .tit{
      padding:.1rem 0 .06rem 0;
      color:#656565;
      font-size:.12rem;
      letter-spacing:.01rem;
    }
    .line{
      margin-bottom:.05rem;
      border-radius: .03rem;
      overflow: hidden;
      .van-image{
        vertical-align: middle;
      }
      .van-cell__left-icon{
        height:auto;
        line-height:normal;
        margin-right:.06rem;
      }
      .van-cell__title{
        span{
          font-size:.14rem;
          font-weight: 400;
          color:#010101;
          letter-spacing:.005rem;
        }
      }
      .van-cell__right-icon{
        color:#000;
      }
    }
  }
</style>