<template>
  <div id='myWork_index'>
    <div class='select_box'>
      <div class='tit' @click='show_type'>
        <i v-if='type_val==""'>类型</i>
        <i v-if='type_val=="object"'>项目</i>
        <i v-if='type_val=="plan"'>计划</i>
        <i v-if='type_val=="task"'>任务</i>
        <span></span>
      </div>
      <div class='tit' @click='show_date'>
        <i v-if='dateYear==""'>月份</i>
        <i v-else>{{dateYear}}/{{dateMonth}}</i>
        <span></span>
      </div>
      <div class='tit' @click='show_state'>
        <i v-if='state_val=="1"'>状态</i>
        <i v-if='state_val=="2"'>未开始</i>
        <i v-if='state_val=="3"'>进行中</i>
        <i v-if='state_val=="4"'>已完成</i>
        <i v-if='state_val=="5"'>已延迟</i>
        <span></span>
      </div>
    </div>
    <div class='content_box' id='orderFullScreen'>
      <div class='main_con' v-for='(v,i) in list' @click='jumpDetail(v)' :key='i'>
        <p class='title'>{{v.name}}
          <span class='delay' v-if='v.status==-1'>已延迟</span>
          <span class='notstart' v-if='v.status==0'>未开始</span>
          <span class='doing' v-if='v.status==1'>进行中</span>
          <span class='done' v-if='v.status==2'>已完成</span>
        </p>
        <div class='info_box'>
          <span class='time'>{{v.end_time}}截止</span>
          <span class='state level' v-if='v.level== 2'><i>重要</i></span>
          <span class='state urgency' v-if='v.urgency == 2'><i>紧急</i></span>
        </div>
        <div class='name'><span>{{v.user_name|omitName}}</span></div>
      </div>
      <div class="empty" v-if="empty">暂无数据</div>
    </div>

    <van-overlay :show="showOverlayState" @click="click_overlay"/>
    <van-area v-if='showTypeState' :value='type_val' :area-list="typelist_data" :columns-num='1' @cancel='type_cancel' @confirm='type_confirm'/>
    <van-area v-if='showStateState' :value='state_val' :area-list="statelist_data" :columns-num='1' @cancel='state_cancel' @confirm='state_confirm'/>

    <van-datetime-picker v-if='showDateState' v-model="currentDate" type="year-month" @cancel='date_cancel' @confirm='date_confirm'/>

    <loading v-if="isLoading"></loading>
    <foot :foot_active='foot_active'></foot>
  </div>
</template>
<script>
import loading from '../../components/common/loading.vue'
import foot from '../../components/plan/footer.vue'
import dateFormat from '~/plugins/dateFormat'
import ddShare from '~/plugins/ddShare'
export default {
  components: {
    foot,
    loading,
    ddShare
  },
  data() {
    return {
      foot_active: 'myWork',
      workData:{},
      list:[],
      currentDate: new Date(),
      showOverlayState:false,
      wait:false,

      showTypeState: false,
      type:'',
      type_val:'',
      typelist_data:{
        province_list: {
          '': '全部',
          'object': '项目',
          'plan': '计划',
          'task': '任务',
        }
      },

      showStateState: false,
      state:'',
      state_val:'1',
      state_val_str:'',
      statelist_data:{
        province_list: {
          '1': '全部',
          '2': '未开始',
          '3': '进行中',
          '4': '已完成',
          '5': '已延迟',
        }
      },

      showDateState:false,
      dateYear:'',
      dateMonth:'',

      empty:false,
      page:1,
      isLoading:false,
    };
  },
  mounted(){
    var d = new Date()
    this.dateYear = d.getFullYear();
    this.dateMonth = d.getMonth()+1;
    if(this.dateMonth<=9) this.dateMonth='0'+this.dateMonth
    
    this.getWorkList()
    window.addEventListener('scroll', this.handleScroll, true)
    ddShare()
  },
  beforeRouteLeave(to, from, next) {
    window.removeEventListener('scroll', this.handleScroll, true)
    next();
  },
  methods: {
    handleScroll() {
        let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        let clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
        let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
        if(scrollHeight > clientHeight && scrollTop + clientHeight >= scrollHeight && this.wait == false  && (this.workData.data.current_page < this.workData.data.last_page)) {
          this.wait = true
          this.getWorkList();
        }
    },
    
    //点击遮罩层
    click_overlay(){
      this.showOverlayState = false
      this.showTypeState = false
      this.showStateState = false
      this.showDateState = false
    },
    //点击选择时间
    show_date(){
      this.showOverlayState = true
      this.showDateState = true
    },
    //时间点击取消
    date_cancel(){
      this.showOverlayState = false
      this.showDateState = false
    },
    //时间点击确认
    date_confirm(value){
      this.showOverlayState = false
      this.showDateState = false
      this.page = 1
      scroll(0,0)
      if(value){
        var d = new Date(value)
        this.dateYear = d.getFullYear();
        this.dateMonth = d.getMonth()+1;
        if(this.dateMonth<=9) this.dateMonth='0'+this.dateMonth
      }
      this.getWorkList()
    },
    //点击选择状态
    show_state(){
      this.showOverlayState = true
      this.showStateState = true
    },
    //状态点击取消
    state_cancel(){
      this.showOverlayState = false
      this.showStateState = false
    },
    //状态点击确认
    state_confirm(value){
      this.showOverlayState = false
      this.showStateState = false
      this.page = 1
      scroll(0,0)
      if(value){
        this.state_val = value[value.length-1]['code']
      }
      if(this.state_val=='1') this.state_val_str = ''     //全部
      if(this.state_val=='2') this.state_val_str = '0'     //未开始
      if(this.state_val=='3') this.state_val_str = '1'     //进行中
      if(this.state_val=='4') this.state_val_str = '2'     //已完成
      if(this.state_val=='5') this.state_val_str = '-1'     //已延迟
      this.getWorkList()
    },
    //点击选择类型
    show_type(){
      this.showOverlayState = true    //遮罩层
      this.showTypeState = true
    },
    //类型点击取消
    type_cancel(){
      this.showOverlayState = false
      this.showTypeState = false
    },
    //类型点击确认
    type_confirm(value){
      this.showOverlayState = false
      this.showTypeState = false
      this.page = 1
      scroll(0,0)
      if(value){
        this.type_val = value[value.length-1]['code']
      }
      this.getWorkList()
    },
    //获取列表
    getWorkList(){
      this.isLoading = true
      this.empty = false
      this.$axios({
        method: "GET",
        url: "/planManage/workList?page="+this.page+"&type="+this.type_val+"&year="+this.dateYear+"&month="+this.dateMonth+"&status="+this.state_val_str+"&dept_id=''&query_type=0",
      }).then(data => {
       this.workData = data
        if(data.data.data && data.data.data.length>0 ){
          for(let i=0; i<data.data.data.length; i++){
            data.data.data[i].end_time = dateFormat(data.data.data[i].end_at * 1000,'yyyy-MM-dd')
          }
          if(this.page!=1){
            this.list = this.list.concat(data.data.data)
          }else{
            this.list = data.data.data
          }
          this.empty = false
          this.page++
        }else{
          if(this.page == 1){
            this.list = []
            this.empty = true
          }else{
            this.empty = false
          }
        }
        this.isLoading = false
        this.wait = false
      }).catch(data => {
        this.$toast.fail(data);
        this.isLoading = false
        this.wait = false
      });
    },
    jumpDetail(v){
      this.$router.push({ path:"/plan/planDetail/?id="+v.id+"&type_code="+v.type_code })
    },
  },
  filters: {
		omitName(val) {
      if(val && val.length>=2) return val.substr(-2, 2);
      else return val;
    },
  },
}
</script>
<style lang="less" scoped>
  #myWork_index{
    .select_box{
      position:fixed;
      left:0;
      right:0;
      top:0;
      z-index:1;
      height: .38rem;
      line-height: .38rem;
      font-size: 0;
      text-align: center;
      background-color: #fff;
      border-bottom: 1px solid #f2f2f2;
      .tit{
        display: inline-block;
        width: 33.3%;
        font-size: 0;
        i{
          font-style: normal;
          font-size: .14rem;
          vertical-align: middle;
        }
        span{
          margin-left:.05rem;
          display:inline-block;
          border-top:.04rem solid #000;
          border-left:.04rem solid transparent;
          border-right:.04rem solid transparent;
          border-bottom:0;
          vertical-align: middle;
        }
      }
    }
    .content_box{
      margin-top:.39rem;
      padding-bottom:.7rem;
      overflow-y: auto;
      .empty{
        position:absolute;
        left:50%;
        top:50%;
        transform: translate(-50%,-50%)
      }
      .main_con{
        position: relative;
        width:95%;
        margin:.1rem 0 0 2.5%;
        padding:.1rem .12rem .12rem .12rem;
        background-color: #fff;
        border-radius: .1rem;
        box-sizing: border-box;
        .title{
          width:80%;
          margin-bottom:.1rem;
          font-size: .16rem;
          font-weight: bold;
          letter-spacing: .01rem;
          span{
            display:inline-block;
            font-size: .12rem;
          }
        }
        .info_box{
          font-size: 0;
          .time{
            display:inline-block;
            margin-right:.1rem;
            color:#656565;
            font-size: .12rem;
            vertical-align: middle;
          }
          .state{
            height:.12rem;
            display:inline-block;
            margin-right:.1rem;
            padding:0 .12rem 0 .12rem;
            color:#fff;
            border-radius: .15rem;
            font-size: .1rem;
            overflow: hidden;
            vertical-align: middle;
            i{
              position: relative;
              top: -.015rem;
              font-style: normal;
            }
          }
          .state.level{
            background-color:#ffa800;
          }
          .state.urgency{
            background-color:#ff4231;
          }
        }
        .delay,.level,.urgency{
          color:#ff4231;
        }
        .notstart{
          color:#5398ff;
        }
        .doing{
          color:#ffa800;
        }
        .done{
          color:#2cd079;
        }
        .name{
          position: absolute;
          right:.18rem;
          top:.16rem;
          width:.34rem;
          height:.34rem;
          line-height:.34rem;
          text-align: center;
          color:#5398ff;
          font-size: .12rem;
          background-color:#d0e3ff; 
          border-radius: 50%;
          font-weight: bold;
          span{
            position: relative;
            top:-.02rem;
            display:inline-block;
            line-height:normal;
            vertical-align: middle;
          }
        }
      }
    }
    .van-are,.van-datetime-picker,.van-picker{
      position: fixed;
      left:0;
      bottom:0;
      width:100%;
      z-index:2;
    }
  }
</style>