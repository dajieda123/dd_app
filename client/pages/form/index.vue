<template>
  <div id='form_index'>
    <div class="main_btn">
      <div class='wait'>待办任务</div>
      <div class='created'>快速发布</div>
    </div>
    <p class='title'>我的应用</p>
    <div class='use_box'>
      <div>招商调研</div>
      <div>招商调研</div>
      <div>招商调研</div>
      <div>招商调研</div>
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
  #form_index{
    .main_btn{
      font-size:0; 
      text-align: center;
      div{
        display:inline-block;
        width:46.25%;
        padding:50px 0 20px 0;
        font-size:.14rem;
        border-radius:12px; 
      }
      .wait{
        margin:0 2.5%;
        background-image: linear-gradient(to right bottom, #55d5ff, #5398fe);
      }
      .created{
        margin-right:2.5%;
        background-image: linear-gradient(to right bottom, #4ace56, #2cd079);
      }
    }
    .title{
      padding:20px 0 10px 15px;
    }
    .use_box{
      padding:0 3%;
      font-size: 0;
      div{
        display:inline-block;
        width:31.3%;
        margin:0 3% 3% 0;
        padding:40px 0 10px 0;
        background-color: #fff;
        font-size: 14px;
        text-align: center;
        border-radius: 8px;
      }
      div:nth-of-type(3n){
        margin-right:0;
      }
    }
  }
</style>