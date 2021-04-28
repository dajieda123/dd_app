<template>
  <div id='workRank_index'>
    <div class='container'>
      <div class='select_box'>
        <div class='tit' @click='show_dept'>
          <i>{{dept_name}}</i>
          <span></span>
        </div>
        <div class='tit' @click='show_date'>
          <i v-if='dateYear==""'>月份</i>
          <i v-else>{{dateYear}}/{{dateMonth}}</i>
          <span></span>
        </div>
      </div>
      <van-tabs v-model="tab_active" @change='changeTab'>
        <van-tab title="工作量">
          <div class='like_lise self' v-if="work_data.mine && work_data.mine.dept_name">
            <div class='line bottomLine'>
              <div class='order'>{{work_data.mine.ranking}}</div>
              <div class='name'><img :src='work_data.mine.img'>{{work_data.mine.name}}</div>
              <div class='department'>{{work_data.mine.dept_name}}</div>
              <div class='count'>{{work_data.mine.value}}</div>
            </div>
          </div>
          <div class='mian_con' :class='!work_data.mine?"top":""' v-if="work_list && work_list.length>0">
            <div class='like_lise'>
              <div class='line bottomLine' v-for='(v,i) in work_list' :key='i'>
                <div class='order'>{{v.ranking}}</div>
                <div class='name'><img :src='v.img'>{{v.name}}</div>
                <div class='department'>{{v.dept_name}}</div>
                <div class='count'>{{v.value}}</div>
              </div>
            </div>
          </div>
          <div class="empty" v-if="work_empty">暂无数据</div>
        </van-tab>

        <van-tab title="获赞数">
          <div class='like_lise self' v-if="like_data.mine && like_data.mine.dept_name">
            <div class='line bottomLine'>
              <div class='order'>{{like_data.mine.ranking}}</div>
              <div class='name'><img :src='like_data.mine.img'>{{like_data.mine.name}}</div>
              <div class='department'>{{like_data.mine.dept_name}}</div>
              <div class='count'>{{like_data.mine.value}}</div>
            </div>
          </div>
          <div class='mian_con' :class='!like_data.mine?"top":""' v-if="like_list && like_list.length>0">
            <div class='like_lise'>
              <div class='line bottomLine' v-for='(v,i) in like_list' :key='i'>
                <div class='order'>{{v.ranking}}</div>
                <div class='name'><img :src='v.img'>{{v.name}}</div>
                <div class='department'>{{v.dept_name}}</div>
                <div class='count'>{{v.value}}</div>
              </div>
            </div>
          </div>
          <div class="empty" v-if="like_empty">暂无数据</div>
        </van-tab>
      </van-tabs>
    </div>
    
    <van-overlay :show="showOverlayState" @click="click_overlay"/>
    <van-area v-if='showDeptState' :value='dept_val' :area-list="deptlist_data" :columns-num='2' @cancel='dept_cancel' @confirm='dept_confirm'/>
    <van-datetime-picker v-show='showDateState' v-model="currentDate" type="year-month" @cancel='date_cancel' @confirm='date_confirm'/>

    <loading v-if="isLoading"></loading>
    <foot :foot_active='foot_active'></foot>
  </div>
</template>
<script>
import loading from '../../components/common/loading.vue'
import foot from '../../components/plan/footer.vue'
export default {
  components: {
    foot,
    loading
  },
  data() {
    return {
      tab_active: '0',
      foot_active: 'workRank',
      isLoading:false,
      wait:false,
      dateYear:'',
      dateMonth:'',
      date:'',
      currentDate: new Date(),

      //中心
      showDeptState: false,
      dept:'',            //获取详情时做参数
      dept_name:'部门',       //页面显示名字
      dept_val:'1101',
      dept_data:[],       //部门的原始数据
      deptlist_data:{},
      //中心

      like_data:{
        mine:{}
      },
      like_list:[],
      like_loading:false,
      like_empty:false,
      like_page:1,
      like_scroll:0,

      work_data:{
        mine:{}
      },
      work_list:[],
      work_empty:false,
      work_page:1,
      work_scroll:0,

      showOverlayState:false,   //控制遮罩层
      showDateState:false,      //控制时间框的显示与隐藏
    };
  },
  mounted(){
    window.addEventListener('scroll', this.handleScroll, true)
    this.ranking()
    this.getDeptByUser()
  },
  beforeRouteLeave(to, from, next) {
    window.removeEventListener('scroll', this.handleScroll, true)
    next();
  },
  methods: {
    //点击遮罩层
    click_overlay(){
      this.showOverlayState = false
      this.showDateState = false
      this.showDeptState = false
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
      this.work_page = 1
      this.like_page = 1
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
      this.ranking()
    },
    //获取中心/部门
    getDeptByUser(){
      this.$axios({
        method: "GET",
        url: process.env.baseUrl+"dt/dept/getDeptByUser?type=0"
      }).then(data => {
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
          
          //合成第二列和控制行数
          if(data.data[i]['child'] && data.data[i]['child'].length>0){
            this.dept_val = '1101'
            city_list[ OneAndTwo +'01'] = '全部'
            for(let u=0; u < data.data[i]['child'].length; u++){
              threeAndfour = u + 2
              if(threeAndfour<=9){
                threeAndfour = '0' + threeAndfour
              }
              city_list[OneAndTwo + threeAndfour] = data.data[i]['child'][u]['name']
            }
          }
        }
        this.deptlist_data['province_list'] = province_list
        this.deptlist_data['city_list'] = city_list
      }).catch(data => {
        this.$toast.fail(data);
      });
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
      this.work_page = 1
      this.like_page = 1
      scroll(0,0)
      if(value){
        var d = new Date(value)
        this.dateYear = d.getFullYear();
        this.dateMonth = d.getMonth()+1;
        if(this.dateMonth<=9) this.dateMonth='0'+this.dateMonth
      }
      this.date = this.dateYear+'-'+this.dateMonth
      this.ranking()
    },
    handleScroll() {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      let clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
      let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      if(this.tab_active == '0'){
        if(scrollHeight > clientHeight && scrollTop + clientHeight >= scrollHeight && this.wait == false && (this.work_data.data.current_page < this.work_data.data.last_page)) {
          this.wait = true
          this.ranking();
        }
      }else{
        if(scrollHeight > clientHeight && scrollTop + clientHeight >= scrollHeight && this.wait == false && (this.like_data.data.current_page < this.like_data.data.last_page)) {
          this.wait = true
          this.ranking();
        }
      }
    },
    //切换
    changeTab(){
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      this.dept = ''
      this.dept_val = '1100'
      this.dept_name = '部门'
      this.date = ''
      this.dateYear = ''
      this.like_page = 1
      this.work_page = 1
      if(this.tab_active==0){   //切换之前是工作
        this.like_scroll = scrollTop
        setTimeout(()=>{
          scroll(0,this.work_scroll)
        },10)
      }else{    //切换之前是点赞量
        this.work_scroll = scrollTop
        setTimeout(()=>{
          scroll(0,this.like_scroll)
        },10)
      }
      //if((this.tab_active == '0' && this.work_list.length==0) || (this.tab_active == '1' && this.like_list.length==0)){
        this.ranking()
      //}
    },
    //排行榜
    ranking(){
      this.isLoading = true
      this.like_empty = false
      this.work_empty = false
      if(this.tab_active == '0'){
        this.type = 2
        this.page = this.work_page
      }else{
        this.type = 1
        this.page = this.like_page
      }
      this.$axios({
        method: "GET",
        url: "/planManage/ranking?type="+this.type+"&page="+this.page+"&dept_id="+this.dept+"&date="+this.date
      }).then(data => {
        
        if(this.tab_active == '0'){   //工总量
          this.work_data = data
          if(data.data.data && data.data.data.length>0 ){
            if(this.work_page!=1){
              this.work_list = this.work_list.concat(data.data.data)
            }else{
              this.work_list = data.data.data
            }
            this.work_empty = false
            this.work_page++
          }else{
            if(this.work_page == 1){
              this.work_list = []
              this.work_empty = true
            }else{
              this.work_empty = false
            }
          }
          
        }else{                        //点赞量
          this.like_data = data
          if(data.data.data && data.data.data.length>0 ){
            if(this.like_page!=1){
              this.like_list = this.like_list.concat(data.data.data)
            }else{
              this.like_list = data.data.data
            }
            this.like_empty = false
            this.like_page++
          }else{
            if(this.like_page == 1){
              this.like_list = []
              this.like_empty = true
            }else{
              this.like_empty = false
            }
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
  }
}
</script>
<style lang="less" scoped>
  #workRank_index{
    background-color: #fff;
    .container{
      .select_box{
        position:fixed;
        left:0;
        right:0;
        top:.4rem;
        z-index:2;
        height: .38rem;
        line-height: .38rem;
        font-size: 0;
        text-align: center;
        background-color: #fff;
        color:#656565;
        border-top: 1px solid #f2f2f2;
        border-bottom: 1px solid #f2f2f2;
        .tit{
          display: inline-block;
          width: 50%;
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
            margin-left:.05rem;
            display:inline-block;
            border-top:.04rem solid #656565;
            border-left:.04rem solid transparent;
            border-right:.04rem solid transparent;
            border-bottom:0;
            vertical-align: middle;
          }
        }
      }
      /deep/ .van-tabs__wrap{
        position:fixed;
        top:0;
        left:0;
        width:100%;
        height:.4rem;
        z-index:2;
        .van-tabs__nav{
          padding-bottom:0;
        }
        .van-tab{
          padding:0 .05rem;
          font-size:.14rem;
          line-height:.4rem;
        }
        .van-ellipsis{
          font-size: .16rem;
        }
        .van-tab--active{
          .van-ellipsis{
            color:#42d587;
          }
        }
        .van-tabs__line{
          width:50% !important;
          height:.02rem;
          bottom:0;
          transform: translateX(-50%);
          background-color:#42d587;
          border-radius:.03rem;
        }
      }
      /deep/ .van-tabs__content{
        position: relative;
        z-index:1;
      }
      .mian_con{
        margin-bottom:.7rem;
        padding-top:1.18rem;
        .line:nth-child(1){
          .order{
            background:url('../../assets/images/plan/rank1.png') no-repeat center center;
            background-size:.3rem;
            color:#fff;
          }
        }
        .line:nth-child(2){
          .order{
            background:url('../../assets/images/plan/rank2.png') no-repeat center center;
            background-size:.3rem;
            color:#fff;
          }
        }
        .line:nth-child(3){
          .order{
            background:url('../../assets/images/plan/rank3.png') no-repeat center center;
            background-size:.3rem;
            color:#fff;
          }
        }
      }
      .mian_con.top{
        padding-top:.8rem;
      }
      .like_lise.self{
        position: fixed;
        top:.8rem;
        left:0;
        width:100%;
        background-color:#fff;
        z-index:2;
        .line{
          div{
            color:#5398ff;
          }
        }
      }
      .like_lise{
        .line{
          padding: .06rem 0;
          font-size: 0;
          text-align: center;
          div{
            display: inline-block;
            color:#333;
          }
          .order{
            width:15%;
            height:.26rem;
            line-height:.26rem;
            vertical-align: middle;
          }
          .name{
            width:34%;
            vertical-align: middle;
            text-align: left;
            img{
              width:.26rem;
              height:.26rem;
              margin-right:.18rem;
              vertical-align: middle;
              border-radius: 100%;
            }
          }
          .department{
            width:33%;
            vertical-align: middle;
          }
          .count{
            width:18%;
            color:#ff9c00;
            font-weight: bold;
            vertical-align: middle;
          }
        }
        
      }
      .empty{
        position: fixed;
        left:50%;
        top:50%;
        transform: translate(-50%,-50%)
      }
    }
    .van-overlay{
      z-index:3 !important;
    }
    .van-are,.van-datetime-picker,.van-picker{
      position: fixed;
      left:0;
      bottom:0;
      width:100%;
      z-index:3;
    }
    .bottomLine{ position:relative; }
    .bottomLine:after {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 1px;
      content: '';
      -webkit-transform: scaleY(.5);
      transform: scaleY(.5);
      background-color: #f3f3f3;
    }
  }
</style>