<template>
  <div id='teamWork_index'>
    <div class='statistics underline'>
      <ul>
        <li>
          <p class='number notstart_cnt'>{{workData.notstart_cnt}}</p>
          <p class='li_str'>未开始</p>
        </li>
        <li>
          <p class='number doing_cnt'>{{workData.doing_cnt}}</p>
          <p class='li_str'>进行中</p>
        </li>
        <li>
          <p class='number delay_cnt'>{{workData.delay_cnt}}</p>
          <p class='li_str'>已延迟</p>
        </li>
        <li>
          <p class='number done_cnt'>{{workData.done_cnt}}</p>
          <p class='li_str'>已完成</p>
        </li>
      </ul>
    </div>
    <div class='select_box'>
      <div class='tit' @click='show_type'>
        <i v-if='type_val==""'>类型</i>
        <i v-if='type_val=="object"'>项目</i>
        <i v-if='type_val=="plan"'>计划</i>
        <i v-if='type_val=="task"'>任务</i>
        <span></span>
      </div>
      <div class='tit big' @click='show_dept'>
        <i>{{dept_name}}</i>
        <span></span>
      </div>
      <div class='tit' @click='show_date'>
        <i v-if='dateYear==""'>月份</i>
        <i v-else>{{dateYear}}/{{dateMonth}}</i>
        <span></span>
      </div>
      <div class='tit' @click='show_state'>
        <i v-if='state_val==""'>已完成</i>
        <i v-if='state_val=="0"'>状态</i>
        <i v-if='state_val=="1"'>未开始</i>
        <i v-if='state_val=="2"'>进行中</i>
        <i v-if='state_val=="-1"'>已延迟</i>
        <span></span>
      </div>
    </div>
    <div class='content_box' id='orderFullScreen'>
      <div class='main_con' v-for='(v,i) in list' @click='jumpDetail(v)' :key='i'>
        <p class='title'>{{v.name}}
          <span class='notstart' v-if='v.status==0'>未开始</span>
          <span class='doing' v-if='v.status==1'>进行中</span>
          <span class='done' v-if='v.status==2'>已完成</span>
          <span class='delay' v-if='v.status==-1'>已延迟</span>
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
    <van-area v-if='showDeptState' :value='dept_val' :area-list="deptlist_data" :columns-num='2' @cancel='dept_cancel' @confirm='dept_confirm'/>
    <van-area v-if='showTypeState' :value='type_val' :area-list="typelist_data" :columns-num='1' @cancel='type_cancel' @confirm='type_confirm'/>
    <van-area v-if='showStateState' :value='state_val' :area-list="statelist_data" :columns-num='1' @cancel='state_cancel' @confirm='state_confirm'/>

    <van-datetime-picker v-show='showDateState' v-model="currentDate" type="year-month" @cancel='date_cancel' @confirm='date_confirm'/>

    <loading v-if="isLoading"></loading>
    <foot :foot_active='foot_active'></foot>
  </div>
</template>
<script>
import loading from '../../components/common/loading.vue'
import foot from '../../components/plan/footer.vue'
import dateFormat from '~/plugins/dateFormat'
export default {
  components: {
    foot,
    loading
  },
  data() {
    return {
      workData:{},
      list:[],
      currentDate: new Date(),
      foot_active: 'teamWork',
      showDeptState: false,
      showOverlayState: false,
      dept:'',            //获取详情时做参数
      dept_name:'部门',       //页面显示名字
      dept_val:'120100',
      dept_data:[],       //部门的原始数据
      deptlist_data:{},
      isLoading:false,
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
      state_val:'0',
      state_val_str:'',
      statelist_data:{
        province_list: {
          '': '已完成',
          '0': '全部',
          '1': '未开始',
          '2': '进行中',
          '-1': '已延迟',
        }
      },

      showDateState:false,
      dateYear:'',
      dateMonth:'',

      empty:false,
      page:1,
    }
  },
  mounted(){
    var d = new Date()
    this.dateYear = d.getFullYear();
    this.dateMonth = d.getMonth()+1;
    if(this.dateMonth<=9) this.dateMonth='0'+this.dateMonth

    this.getDeptByUser()
    window.addEventListener('scroll', this.handleScroll, true)
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
        if(scrollHeight > clientHeight && scrollTop + clientHeight >= scrollHeight && this.wait == false && (this.workData.data.current_page < this.workData.data.last_page)) {
          this.wait = true
          this.getWorkList();
        }
    },
    
    //点击遮罩层
    click_overlay(){
      this.showOverlayState = false
      this.showDeptState = false
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
      if(this.state_val==''){
        this.state_val_str = '2'    //已完成
      }else if(this.state_val=='0'){
        this.state_val_str = ''     //全部
      }else if(this.state_val=='1'){
        this.state_val_str = '0'    //未开始
      }else if(this.state_val=='2'){
        this.state_val_str = '1'    //进行中
      }else if(this.state_val=='-1'){
        this.state_val_str = '-1'    //已延迟
      }
      this.getWorkList()
    },
    //点击选择类型
    show_type(){
      this.showOverlayState = true
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
    //点击选择部门
    show_dept(){
      this.showOverlayState = true
      this.showDeptState = true
    },
    //部门点击取消
    dept_cancel(){
      this.showOverlayState = false
      this.showDeptState = false
    },
    //部门点击确认
    dept_confirm(value){
      this.showOverlayState = false
      this.showDeptState = false
      this.page = 1
      scroll(0,0)
      if(value){
        if(value[value.length-1]) this.dept_val = value[value.length-1]['code']
        else this.dept_val = value[value.length-2]['code']
        let one = this.dept_val.substring(0,this.dept_val.length-2) - 12
        let sub = this.dept_val.substring(this.dept_val.length-2)
        if(one!='-1'){    //第一级非全部
          if(!sub || sub === '00' || sub == '01'){     //拿第一级
            this.dept = this.dept_data[one]['id']
            this.dept_name = this.dept_data[one]['name']
          }else{                        //拿第二级
            this.dept = this.dept_data[one]['child'][sub-2]['id']   //0107
            this.dept_name = this.dept_data[one]['child'][sub-2]['name']
          }
        }else{      //第一级是全部
          this.dept = ''
          this.dept_name = '部门'
        }
      }
      this.getWorkList()
    },
    //获取列表
    getWorkList(){
      this.isLoading = true
      this.empty = false
      this.$axios({
        method: "GET",
        url: "/planManage/workList?page="+this.page+"&type="+this.type_val+"&year="+this.dateYear+"&month="+this.dateMonth+"&status="+this.state_val_str+"&dept_id="+this.dept+"&query_type=1",
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
    //获取中心/部门
    getDeptByUser(){
      this.isLoading = true
      this.$axios({
        method: "GET",
        url: process.env.baseUrl+"dt/dept/getDeptByUser"
      }).then(data => {
        this.dept = data.mine_deptid?data.mine_deptid:''
        this.getWorkList()
        this.dept_data = data.data
        let province_list = []
        let city_list = []
        this.deptlist_data = {}
        let OneAndTwo,threeAndfour
        province_list['1100'] = '全部'

        this.dept = ''
        this.dept_name = '部门'
        this.dept_val = '1100'
        for (let i = 0; i < data.data.length; i++) {
          //合成列表
          OneAndTwo = i + 2
          if(OneAndTwo<=9){
            OneAndTwo = parseInt('0'+ OneAndTwo) + 10
          }else{
            OneAndTwo = OneAndTwo + 10
          }
          province_list[OneAndTwo + '00'] = data.data[i]['name']
          if(data.mine_deptid && data.mine_deptid == data.data[i]['id']){
            this.dept_name = data.data[i]['name']
            this.dept_val = OneAndTwo + '00'
          }

          //合成第二列和控制行数
          if(data.data[i]['child'] && data.data[i]['child'].length>0){
            city_list[ OneAndTwo +'01'] = '全部'
            for(let u=0; u < data.data[i]['child'].length; u++){
              threeAndfour = u + 2
              if(threeAndfour<=9){
                threeAndfour = '0' + threeAndfour
              }
              city_list[OneAndTwo + threeAndfour] = data.data[i]['child'][u]['name']
              if(data.mine_deptid && data.mine_deptid == data.data[i]['child'][u]['id']){
                this.dept_name = data.data[i]['child'][u]['name']
                this.dept_val = OneAndTwo + threeAndfour
              }
            }
          }
        }
        
        this.deptlist_data['province_list'] = province_list
        this.deptlist_data['city_list'] = city_list
      }).catch(data => {
        this.$toast.fail(data);
      });
    }
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
  #teamWork_index{
    .statistics{
      position: fixed;
      left:0;
      top:0;
      right:0;
      z-index:1;
      background-color:#fff;
      font-size:0;
      li{
        display:inline-block;
        padding:.10rem 0;
        width:25%;
        font-size:.14rem;
        text-align: center;
        .number{
          height:.29rem;
          padding-bottom:.05rem;
          font-size:.22rem;
          font-weight: bold;
        }
        .li_str{
          color:#656565;
        }
        .notstart_cnt{
          color:#5398ff;
        }
        .doing_cnt{
          color:#ffa800;
        }
        .delay_cnt{
          color:#ff4231;
        }
        .done_cnt{
          color:#2cd079;
        }
      }
    }
    .select_box{
      position:fixed;
      left:0;
      right:0;
      top:.73rem;
      z-index:1;
      height: .38rem;
      line-height: .38rem;
      font-size: 0;
      text-align: center;
      background-color: #fff;
      color:#656565;
      border-top: 1px solid #f2f2f2;
      border-bottom: 1px solid #f2f2f2;
      .tit.big{
        width:28%;
      }
      .tit{
        display: inline-block;
        width: 24%;
        font-size: 0;
        i{
          display: inline-block;
          max-width:78%;
          font-style: normal;
          font-size: .14rem;
          vertical-align: middle;
          white-space:nowrap;
          overflow:hidden;
          text-overflow:ellipsis;
        }
        span{
          margin-left:.03rem;
          display:inline-block;
          border-top:.04rem solid #656565;
          border-left:.04rem solid transparent;
          border-right:.04rem solid transparent;
          border-bottom:0;
          vertical-align: middle;
        }
      }
    }
    .content_box{
      margin-top:1.13rem;
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
