<template>
  <div>首页</div>
</template>

<script>
export default {
  layout: 'blank',
  mounted(){
    // this.$router.replace('/'+process.env.homePage);
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

</style>
