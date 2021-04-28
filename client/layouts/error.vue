<template>
<!-- <div class="loadBox">
  <van-loading color='#58daa8' size='10%'/>
</div> -->
  <div class="container">
    <h1 v-if="error.statusCode === 404">页面不存在</h1>
    <h1 v-else>应用发生错误异常</h1>
  </div>
</template>

<script>
export default {
  props: ['error'],
  layout: 'blank', // 你可以为错误页面指定自定义的布局,
  created(){
    setTimeout(()=>{
      this.$router.replace(process.env.homePage);
    },500)
  }
}
</script>

<style lang="less" scoped>
  .loadBox{
    display: flex;
    width:100%;
    height:100vh;
    overflow: hidden;
    align-items: center;
    justify-content: center;
  }
  .loadBox /deep/ .van-loading__spinner{
      left:50%;
      transform: translateX(-50%);
    }
</style>
