<template>
  <div id='planUpdate_index'>
    <div class='container' v-show='detail.id'>
      <div class='main_title'>{{detail.name}}</div>
      <div class='sub_title'>完成进度</div>
      <div class='progress_box'>
        <div class='slider_con' v-show='detail.id'>
          <div class='pass' :style='"width:"+detail.progress+"%"'><span class='pass_title'>已审{{detail.progress}}%</span></div>
          <van-slider v-model="now_progress" :min="0" :max="100" bar-height=".18rem" @input='changeSlider' @drag-start='showUnProgress = true' @drag-end='showUnProgress = false' active-color="#ffa800">
            <div slot="button" class="custom-button">
              <span class='btn_value' v-show="showUnProgress" :style='"left:"+left_pos+"rem"'>待审{{ parseInt(now_progress-detail.progress) }}%</span>
            </div>
          </van-slider>
        </div>
        <div class='total'>{{now_progress}}%</div>
      </div>
      <div class='sub_title update_con'>更新说明</div>
      <textarea v-model='desc'></textarea>
      <div class='sub_title' v-if='detail.status==-1'>延迟原因</div>
      <div class='sel_box' v-if='detail.status==-1' @click='show_type'>{{cause_str}}<span></span></div>
      <div class='sub_title' v-if='detail.status==-1'>延迟说明</div>
      <textarea v-model='delay_desc' v-if='detail.status==-1'></textarea>

      <div class='submit_btn' v-show='detail.id' @click='upPlan'>提交</div>
    </div>
    

    <van-area v-if='showTypeState' :value='cause' :area-list="delay_Data" :columns-num='1' @cancel='type_cancel' @confirm='type_confirm'/>
    <van-overlay :show="showOverlayState" @click="click_overlay"/>

    <loading v-if="isLoading"></loading>
  </div>
</template>
<script>
import loading from '../../components/common/loading.vue'
export default {
  head: {
    title: '',
  },
  components: {
    loading
  },
  data() {
    return {
      now_progress:0,     //未审
      desc:'',
      detail:{},
      cause: '1',
      cause_str:'时间评估不足导致',
      delay_desc:'',
      showUnProgress:false,
      showOverlayState:false,
      showTypeState:false,
      delay_Data:{
        province_list:{
          '1':'时间评估不足导致',
          '2':'人员变动导致',
          '3':'其他原因',
        }
      },
      left_pos:0,
      isLoading:false,
    };
  },
  mounted(){
    this.id = this.$route.query.id
    this.type_code = this.$route.query.type_code
    this.getDetails()
    
  },
  methods: {
    //点击选择类型
    show_type(){
      this.showOverlayState = true    //遮罩层
      this.showTypeState = true
    },
    //点击遮罩层
    click_overlay(){
      this.showOverlayState = false
      this.showTypeState = false
    },
    //点击取消
    type_cancel(){
      this.showOverlayState = false
      this.showTypeState = false
    },
    //点击确认
    type_confirm(value){
      this.showOverlayState = false
      this.showTypeState = false
      if(value){
        this.cause = value[value.length-1]['code']
        this.cause_str = value[value.length-1]['name']
      }
    },
    changeSlider(value){
      if(value<parseInt(this.detail.un_progress) + parseInt(this.detail.progress)){
        this.now_progress = parseInt(this.detail.un_progress) + parseInt(this.detail.progress)
        value = parseInt(this.detail.un_progress) + parseInt(this.detail.progress)
      }
      this.move(value)
    },
    //调整已审的位置
    move(val){
      if(val>12){
        this.left_pos = -0.17
      }else if(val == 1){
        this.left_pos = 0
      }else if(val == 2){
        this.left_pos = 0
      }else if(val == 3){
        this.left_pos = -0.01
      }else if(val == 4){
        this.left_pos = -0.02
      }else if(val == 5){
        this.left_pos = -0.04
      }else if(val == 6){
        this.left_pos = -0.055
      }else if(val == 7){
        this.left_pos = -0.07
      }else if(val == 8){
        this.left_pos = -0.09
      }else if(val == 9){
        this.left_pos = -0.1
      }else if(val == 10){
        this.left_pos = -0.12
      }else if(val == 11){
        this.left_pos = -0.14
      }else if(val == 12){
        this.left_pos = -0.16
      }
    },
    getDetails(){
      this.isLoading = true
      this.$axios({
        method: "GET",
        url: "/planManage/getDetails?type_code="+this.type_code+"&id="+this.id,
      }).then(data => {
        data.data.progress = parseFloat(data.data.progress)
        this.detail = data.data
        if (navigator.userAgent.toLowerCase().indexOf("dingtalk") >= 0) {     //判断是不是钉钉
          dd.biz.navigation.setTitle({
            title : this.detail.name?this.detail.name:'',
          });
        } 
        this.now_progress = parseInt(this.detail.un_progress)+parseInt(this.detail.progress)
        this.move(this.now_progress)
        this.isLoading = false
      }).catch(data => {
        this.$toast.fail(data);
        this.isLoading = false
      });
    },
    upPlan(){
      if(this.desc.length<10){
        this.$toast('更新说明不能少于10个字');
        return
      }
      this.isLoading = true
      this.$axios({
        method: "POST",
        url: "/planManage/updateProgress",
        data: {
          id: this.id,
          type_code: this.type_code,
          desc: this.desc,
          cause: this.cause_str,
          delay_desc: this.delay_desc,
          own_progress: this.now_progress,
        }
      }).then(data => {
        this.$toast(data.data);
        this.isLoading = false
        if( window.history.length>1)
          window.history.go(-1)
        else
          this.$router.push({path: '/'});
      }).catch(data => {
        this.$toast.fail(data.info);
        this.isLoading = false
      });
    },
  }
}
</script>
<style lang="less" scoped>
  #planUpdate_index{
    .van-area{
      position: fixed;
      left:0;
      bottom:0;
      width:100%;
      z-index:2;
    }
    .container{
      width:95%;
      margin:2.5%;
      padding: .06rem 0 .2rem 0;
      background-color: #fff;
      overflow: hidden;
      border-radius: .1rem;
      box-sizing: border-box;
      .main_title{
        padding:.06rem .1rem;
        font-size: .18rem;
        box-sizing: border-box;
        letter-spacing: .02rem;
        font-weight: bold;
      }
      .sub_title{
        padding:.06rem .1rem .06rem .22rem;
        font-size: .14rem;
        box-sizing: border-box;
        font-weight: bold;
      }
      .sel_box{
        position: relative;
        width: 81%;
        padding: 0 .06rem;
        height: .3rem;
        line-height: .3rem;
        margin-left: 10%;
        border:1px solid #f2f2f2;
        color:#656565;
        border-radius: .04rem;
        box-sizing: border-box;
        span{
          position: absolute;
          right:.1rem;
          top:50%;
          border-top: 0.04rem solid #000;
          border-left: 0.04rem solid transparent;
          border-right: 0.04rem solid transparent;
          border-bottom: 0;
          transform: translateY(-50%);
        }
      }
      .progress_box{
        position: relative;
        width:70%;
        padding-top:.3rem;
        height:.9rem;
        margin-left:10%;
        box-sizing: border-box;
        .slider_con{
          position: relative;
          width:100%;
          z-index:0;
          .pass{
            position: absolute;
            left:0;
            top:0;
            width:10%;
            height:.18rem;
            background-color: #4ace56;
            border-radius: .2rem;
            z-index:1;
            .pass_title{
              position: absolute;
              top:.2rem;
              width: 1rem;
              color:#4ace56;
              font-size: .14rem;
            }
          }
          .custom-button{
            width:.10rem;
            height:.24rem;
            border:.02rem solid #ffa800;
            background-color: #fff;
            border-radius: .3rem;
            z-index:2;
          }
          .btn_value{
            position: absolute;
            top:-.2rem;
            left:0;
            width:.8rem !important;
            color:#ffa800;
            font-size: .14rem;
          }
          .van-slider{
            border-radius:9.99rem;
          }
          /deep/ .van-slider__button-wrapper{
            //height:.24rem;
            z-index:2;
          }
        }
        .total{
          position: absolute;
          left:105%;
          top:.28rem;
          color:#c2c2c2;
          font-size: .16rem;
        }
      }
      textarea{
        width:81%;
        height:.7rem;
        margin-left:10%;
        color:#656565;
        border-color:#f2f2f2;
      }
    }
    .submit_btn{
      width:80%;
      margin-top:.2rem;
      margin-left:10%;
      line-height:.4rem;
      color:#fff;
      font-size: .16rem;
      letter-spacing: .02rem;
      text-align: center;
      background-color:#2cd079;
      border-radius: .3rem;
    }
  }
</style>
