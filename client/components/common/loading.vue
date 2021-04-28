<template>
  <div class="loadBox">
    <img src="../../assets/images/loading.gif">
  </div>
</template>

<script>
export default {
  layout: 'blank'
}
</script>

<style lang="less" scoped>
  .loadBox{
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    display: flex;
    width:100%;
    height:100vh;
    background-color: rgba(0,0,0,0.3);
    overflow: hidden;
    align-items: center;
    justify-content: center;
    img{
      position: relative;
      top:-10%;
      width:1.2rem;
      vertical-align: top;
    }
  }
  
</style>
