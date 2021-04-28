<template>
  <div id='planDetail_index'>
    <div class='info_container'>
      <div class='main_title'>{{detail.name}}<div class='like' v-show='detail.like_count>=0'><van-icon @click='mineLike' :class='detail.mineLike==1?"active":""' name="good-job" /><span>{{detail.like_count}}</span></div></div>
      <div class='info_box'>
        <div class='plan_tit'>上级事项</div>
        <div class='plan_time' v-show='detail.source' @click='jumpSource'>{{detail.source?detail.source:'无'}}<van-icon v-show='detail.source_id>0' name="arrow" /></div>
      </div>
      <div class='info_box'>
        <div class='plan_tit'>事项周期</div>
        <div class='plan_time'><span v-show='detail.start_time'>{{detail.start_time}} 到 <i :class='detail.status==-1?"delay_cnt":""'>{{detail.end_time}}</i></span></div>
      </div>
      <div class='info_box'>
        <div class='plan_tit'>事项描述</div>
        <div class='plan_time' v-show='detail.name'>{{detail.desc?detail.desc:'无'}}</div>
      </div>
      <div class='info_box'>
        <div class='plan_tit'>重要程度</div>
        <div class='plan_time' v-if='detail.level==1'>正常</div>
        <div class='plan_time red' v-if='detail.level==2'>重要</div>
      </div>
      <div class='info_box'>
        <div class='plan_tit'>紧急程度</div>
        <div class='plan_time' v-if='detail.urgency==1'>正常</div>
        <div class='plan_time red' v-if='detail.urgency==2'>紧急</div>
      </div>
      <div class='info_box'>
        <div class='plan_tit'>状态</div>
        <div class='plan_time'>
          <span class="vt notstart_cnt" v-if='detail.status==0'>未开始</span>
          <span class="vt doing_cnt" v-if='detail.status==1'>进行中</span>
          <span class="vt done_cnt" v-if='detail.status==2'>已完成</span>
          <span class="vt delay_cnt" v-if='detail.status==-1'>已延迟</span>
        </div>
      </div>
      <div class='info_box' v-if='detail.status==0||detail.status==1||detail.status==-1'>
        <div class='plan_tit'><span class='vt' v-if='detail.status==0||detail.status==1'>剩余天数</span><span class='vt' v-if='detail.status==-1'>延迟天数</span></div>
        <div class='plan_time' v-if='detail.days_remain'>{{detail.days_remain}} 天</div>
      </div>
      <div class='info_box'>
        <div class='plan_tit'>成果要求</div>
        <div class='plan_time' v-show='detail.name'>{{detail.result_desc?detail.result_desc:'无'}}</div>
      </div>
      <div class='info_box'>
        <div class='plan_tit'>负责人</div>
        <div class='plan_time'>{{detail.owner?detail.owner.user_info.name:''}}</div>
      </div>
      <div class='info_box'>
        <div class='plan_tit'>创建人</div>
        <div class='plan_time'>{{detail.user?detail.user.name:''}}</div>
      </div>
      <div class='info_box'>
        <div class='plan_tit'>创建时间</div>
        <div class='plan_time'>{{detail.created_time}}</div>
      </div>
    </div>
    <div class='info_container'>
      <div class='info_box underline'>
        <div class='plan_tit'>所占比重</div>
        <div class='plan_time' v-if='detail.weight'>{{detail.weight}}%</div>
      </div>
      <div class='info_box underline'>
        <div class='plan_tit'>审核节点</div>
        <div class='plan_time'>{{detail.audit_node}}</div>
      </div>
      <div class='info_box special' @click='jumpUpdate'>
        <div class='plan_tit'>完成进度</div>
        <div class='plan_time' v-show='detail.progress'>
          <div class='progress_box'><span class='all'></span><span class='unfinish' :style='"width:"+detail.un_progress+"%"'></span><span :style='"width:"+detail.progress+"%"' class='finish'></span></div>
          <span class='plan_num'>{{detail.total_progress}}%</span>
          <van-icon name="arrow" />
        </div>
      </div>
    </div>
    <div class='info_container workState' v-if="detail.children && detail.children.length>0">
      <div class='title underline'><div>事项名</div><div>状态</div><div>负责人</div></div>

      <div class='list underline' v-for='v in detail.children' :key='v.id' @click='jumpDetail(v.id, v.type_code)'>
        <div>{{v.name}}</div>
        <div class='state delay' v-if='v.status==-1'>已延迟</div>
        <div class='state notstart' v-if='v.status==0'>未开始</div>
        <div class='state doing' v-if='v.status==1'>进行中</div>
        <div class='state done' v-if='v.status==2'>已完成</div>

        <div><span>{{v.owner.user_info?v.owner.user_info.name:''}}</span><van-icon name="arrow" /></div>
      </div>
    </div>
    <div class='info_container detail_container' v-if='logList && logList.length>0'>
      <div class='detail_box clear' v-for="(v,i) in logList" :key='i'>
        <div class='img'>{{v.name|omitName}}</div>
        <div class='tit'>
          <div class='name'>{{v.name}}</div>
          <div class='time'>{{v.created_at|timeDiff}}</div>
          <div class='main_con his-green' v-if="v.properties && v.properties.attributes.logType==0">[<span>常规</span>]</div>
          <div class='main_con his-blue' v-if="v.properties && v.properties.attributes.logType==1">[<span>进度</span>]</div>
          <div class='main_con his-red' v-if="v.properties && v.properties.attributes.logType==2">[<span>延迟</span>]</div>
          <div class='main_con his-yellow' v-if="v.properties && v.properties.attributes.logType==3">[<span>协同</span>]</div>
          <div class='main_con his-plur' v-if="v.properties && v.properties.attributes.logType==4">[<span>评价</span>]</div>
          <div class='main_con his-blue' v-if="v.properties && v.properties.attributes.logType==5">[<span>进度</span>]</div>
          <div class='main_con his-plur' v-if="v.properties && v.properties.attributes.logType==7">[<span>沟通</span>]</div>
        </div>
        
        <div class='con' v-if='v.properties.attributes.logType==0'>
          <p>{{v.description}}</p>
        </div>
        <div class='con' v-if='v.properties.attributes.logType==1'>
          <p>{{v.description}}</p>
          <p v-if="v.properties.attributes.desc">更新说明：{{v.properties.attributes.desc}}</p>
          <p v-if="v.properties.attributes.documents.length>0">相关附件：</p>
          <div v-for='(vv,ii) in v.properties.attributes.documents' :key='ii'>
            <div class='doc_box' v-if='vv.doc_type == "jpg" || vv.doc_type == "png" || vv.doc_type == "gif" || vv.doc_type == "jpeg"|| vv.doc_type == "txt"|| vv.doc_type == "pdf" '>
              <a :href='vv.doc_path' target="_blank">
                <img :src="require('../../assets/images/plan/'+vv.doc_type+'.png')" >
                <span class='ellipsis'>{{ vv.doc_org_name }}</span>
              </a>
            </div>
            
            <div class='doc_box' v-if='vv.doc_type == "xls" || vv.doc_type == "docx" || vv.doc_type == "doc" || vv.doc_type == "ppt" || vv.doc_type == "xlsx"'>
              <a :href='"https://view.officeapps.live.com/op/view.aspx?src="+vv.doc_path' target="_blank">
                <img :src="require('~/assets/images/plan/'+vv.doc_type+'.png')" >
                <span class='ellipsis'>{{ vv.doc_org_name }}</span>
              </a>
            </div>
          </div>
          <p v-if='v.properties.attributes.auditor'>进度核实人：{{v.properties.attributes.auditor}}</p>
        </div>
        <div class='con' v-if='v.properties.attributes.logType==2'>
          <p v-if='v.properties.attributes.cause'>延迟原因：{{v.properties.attributes.cause}}</p>
          <p v-if='v.properties.attributes.delay_desc'>延迟说明：{{v.properties.attributes.delay_desc}}</p>
        </div>
        <div class='con' v-if='v.properties.attributes.logType==4'>
          <p v-if='v.properties.attributes.grade'>评分：{{v.properties.attributes.grade}}</p>
          <p v-if='v.properties.attributes.desc'>评分说明：{{v.properties.attributes.desc}}</p>
        </div>
        <div class='con' v-if='v.properties.attributes.logType==5'>
          <p v-if='v.properties.attributes.grade'>审核结果：{{v.properties.attributes.grade}}</p>
          <p v-if='v.properties.attributes.grade_desc'>审核说明：{{v.properties.attributes.grade_desc}}</p>
        </div>
        <div class='con' v-if='v.properties.attributes.logType==7'>
          <p v-if='v.properties.attributes.comment.content'>沟通：{{v.properties.attributes.comment.content}}</p>
        </div>
      </div>
    </div>
    
    <div class='issue_box'>
      <textarea placeholder="沟通一下" v-model="comment_con" @focus="scroll_bottom"></textarea>
      <div class='issue_btn' @click='comment'>沟通</div>
    </div>

    <loading v-if="isLoading"></loading>
  </div>
</template>
<script>
import loading from '../../components/common/loading.vue'
import dateFormat from '~/plugins/dateFormat'
export default {
  components: {
    loading,
  },
  data() {
    return {
      id:'',
      type_code:'',
      detail:{},
      log_data:{},
      logList:[],
      comment_con:'',
      isLoading:false,
      wait:false,
      page:1,
    };
  },
  mounted(){
    window.addEventListener('scroll', this.handleScroll, true)
    this.id = this.$route.query.id
    this.type_code = this.$route.query.type_code
    
    //this.getDetails()     //用watch监听路由时执行了,所以这里不执行
    //this.getLogs()
  },
  beforeRouteLeave(to, from, next) {
    if (navigator.userAgent.toLowerCase().indexOf("dingtalk") >= 0) {     //判断是不是钉钉
      dd.biz.navigation.setTitle({
        title : process.env.title,
      });
    } 
    window.removeEventListener('scroll', this.handleScroll, true)
    next();
  },
  methods: {
    scroll_bottom(){
      setTimeout(()=>{
        scroll(0, document.documentElement.scrollHeight || document.body.scrollHeight)
      },50)
    },
    //监听滚动条
    handleScroll() {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      let clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
      let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      if(scrollHeight > clientHeight && scrollTop + clientHeight >= scrollHeight && this.wait == false && (this.log_data.current_page < this.log_data.last_page)) {
        this.wait = true
        this.getLogs();
      }
    },
    //点赞
    mineLike(){
      this.isLoading = true
      this.$axios({
        method: "POST",
        url: "/planManage/mineLike/"+this.id+"/"+this.type_code,
      }).then(data => {
        this.$toast(data.data);
        this.detail.mineLike = data.mineLike
        if(data.mineLike == 1){
          this.detail.like_count++
        }else{
          this.detail.like_count--
        }
        this.isLoading = false
      }).catch(data => {
        this.$toast.fail(data);
        this.isLoading = false
      });
    },
    //获取详情
    getDetails(){
      this.isLoading = true
      this.$axios({
        method: "GET",
        url: "/planManage/getDetails?type_code="+this.type_code+"&id="+this.id,
      }).then(data => {
        data.data.created_time = (dateFormat(data.data.created_at * 1000,'yyyy-M-d hh:mm'))
        data.data.start_time = (dateFormat(data.data.start_at * 1000,'yyyy-M-d'))
        data.data.end_time = (dateFormat(data.data.end_at * 1000,'yyyy-M-d'))
        this.detail = data.data
        if (navigator.userAgent.toLowerCase().indexOf("dingtalk") >= 0) {     //判断是不是钉钉
          dd.biz.navigation.setTitle({
            title : this.detail.name?this.detail.name:'',
          });
        } 
        this.isLoading = false
      }).catch(data => {
        this.$toast.fail(data);
        this.isLoading = false
      }); 
    },
    //获取日志
    getLogs(){
      this.isLoading = true
      this.$axios({
        method: "GET",
        url: "/planManage/getLogs?type_code="+this.type_code+"&id="+this.id+"&page="+this.page,
      }).then(data => {
        this.log_data = data.data
        if(data.data.data && data.data.data.length>0 ){
          if(this.page!=1){
            this.logList = this.logList.concat(data.data.data)
          }else{
            this.logList = data.data.data
          }
          this.page++
        }else{
          if(this.page == 1){
            this.logList = []
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
    //发布评论
    comment(){
      this.isLoading = true
      this.$axios({
        method: "POST",
        url: "/planManage/comment?model_type="+this.type_code+"&source_id="+this.id+"&content="+this.comment_con,
      }).then(data => {
        this.comment_con = ''
        this.$toast(data.data);
        this.page = 1
        this.getLogs()
        this.isLoading = false
      }).catch(data => {
        this.$toast.fail(data);
        this.isLoading = false
      });
    },
    //跳到上级详情
    jumpSource(){
      if(this.detail.source_id>0){
        this.$router.push({ path:"/plan/planDetail/?id="+this.detail.source_id+"&type_code="+this.detail.source_type_code })
      }
    },
    jumpDetail(id, type_code){
      this.logList = []
      this.$router.push({ path:"/plan/planDetail/?id="+id+"&type_code="+type_code })
    },
    jumpUpdate(){
      var openId =  localStorage.getItem("openId");
      if(this.detail.owner.user_id === openId){
        this.$router.push({ path:"/plan/planUpdate/?id="+this.id+"&type_code="+this.type_code })
      }else{
        this.$toast.fail('权限不足');
      }
    }
  },
  watch: {
    $route(){
      this.id = this.$route.query.id
      this.type_code = this.$route.query.type_code
    },
    id() {
      this.getDetails()
      this.page = 1
      this.getLogs()
    },
  },
  filters: {
		omitName(val) {
      if(val && val.length>=2) return val.substr(-2, 2);
      else return val;
    },
    timeDiff(time){
      var d_minutes, d_hours, d_days;
      var timeNow = parseInt(new Date().getTime() / 1000);
      var d;
      d = timeNow - time;
      d_days = parseInt(d / 86400);
      d_hours = parseInt(d / 3600);
      d_minutes = parseInt(d / 60);
      if (d_days > 0 && d_days < 4) {
          return d_days + "天前";
      } else if (d_days <= 0 && d_hours > 0) {
          return d_hours + "小时前";
      } else if (d_hours <= 0 && d_minutes > 0) {
          return d_minutes + "分钟前";
      } else {
          var s = new Date(time * 1000);
          return (s.getMonth() + 1) + "月" + s.getDate() + "日";
      }
    }
	},
}
</script>
<style lang="less" scoped>
  #planDetail_index{
    button{
      width:30px;
      height:30px;
    }
    .info_container{
      width:95%;
      margin:2.5%;
      padding:.06rem 0;
      background-color: #fff;
      overflow: hidden;
      border-radius: .1rem;
      .main_title{
        min-height:.36rem;
        padding:.06rem .1rem;
        font-size: .18rem;
        box-sizing: border-box;
        letter-spacing: .02rem;
        font-weight: bold;
        .like{
          font-weight: normal;
          float: right;
          color:#c2c2c2;
          .van-icon{
            margin-right:.06rem;
            font-size: .18rem;
            vertical-align: middle;
          }
          .van-icon.active{
            color:#ff4231;
          }
          span{
            position: relative;
            top:.01rem;
            vertical-align: middle;
          }
        }
      }
      
      .van-cell:not(:last-child)::after{
        border-bottom:0;
      }
      .info_box{
        position: relative;
        padding: .04rem .1rem;
        font-size: 0;
        .vt{
          vertical-align: top;
        }
        .plan_tit{
          display:inline-block;
          width:25%;
          font-size: .14rem;
          color:#000;
          vertical-align: top;
        }
        .plan_time.red{
          color:#ff4231;
        }
        .plan_time{
          display:inline-block;
          width:75%;
          font-size: .14rem;
          color:#656565;
          vertical-align: top;
          i{
            font-style: normal;
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
          input{
            width:75%;
          }
          .ps{
            display:inline-block;
            margin-left:3.5%;
            font-size: .16rem;
            color:#2cd079;
          }
          textarea{
            width:91%;
            height: .64rem;
          }
          .progress_box{
            position: relative;
            //top:.015rem;
            height:.14rem;
            display:inline-block;
            width:70%;
            vertical-align: middle;
            span{
              position: absolute;
              left:0;
              top:0;
              height:.14rem;
              border-radius: .1rem;
            }
            .finish{
              height:.14rem;
              background-color:#4ace56;
            }
            .unfinish{
              height:.14rem;
              background-color:#ffa800;
            }
            .all{
              position: static;
              display:inline-block;
              width:100%;
              height:.14rem;
              background-color:#f3f3f3;
            }
          }
          .plan_num{
            position: relative;
            display: inline-block;
            vertical-align: middle;
          }
          .van-icon-arrow{
            position: absolute;
            right:.08rem;
            top:53%;
            vertical-align: middle;
            font-size: .14rem;
            transform: translateY(-50%)
          }
        }
      }
      .special{
        padding-right:0;
      }
      .detail_box{
        padding:.1rem;
        .img{
          float: left;
          width:.26rem;
          line-height: .26rem;
          font-size: .1rem;
          text-align: center;
          background-color: #d0e3ff;
          color:#5398ff;
          border-radius: 100%;
        }
        .tit{
          margin-left:.36rem;
          .name{
            display:inline-block;
            font-weight: bold;
            letter-spacing: .01rem;
            font-size: .14rem;
          }
          .main_con,.time{
            display:inline-block;
            margin-left:.1rem;
            font-size: .12rem;
            span{
              position: relative;
              top:.01rem;
            }
          }
          .main_con{
            position: relative;
            bottom:.01rem;
          }
          .his-green{
            color:#2cd079;
          }
          .his-blue{
            color:#1EADE7;
          }
          .his-red{
            color: #ef5447;
          }
          .his-plur{
            color: #5398ff;
          }
          .his-yellow{
            color:#ffa800;
          }
          .time{
            color:#b9bbbc;
          }
        }
        .con{
          margin:.06rem 0 0 .36rem;
          line-height: .18rem;
          color:#7a7d81;
          .doc_box{
            display:inline-block;
            width:90%;
            padding: .04rem 0;
            margin-left:10%;
            font-size: 0;
            img{
              width:.2rem;
              height:.2rem;
              vertical-align: middle;
            }
            span{
              width:1.85rem;
              padding-left:.04rem;
              display:inline-block;
              font-size: .12rem;
              vertical-align: middle;
            }
          }
          >p{
            font-size: .14rem;
            overflow: hidden;
          }
        }
      }
    }
    .detail_container{
      margin-bottom:.65rem;
    }
    .workState{
      font-size:0; 
      text-align: center;
      .title{
        padding:.12rem 0 .08rem 0;
        >div{
          display:inline-block;
          width:33.3%;
          font-size:.14rem;
        }
      }
      .list{
        position: relative;
        padding:.1rem 0;
        color: #656565;
        font-size:0;
        >div{
          display:inline-block;
          width:33.3%;
          line-height:.21rem;
          font-size:.14rem;
          vertical-align: middle;
          span{
            display:inline-block;
            width:65%;
            vertical-align: top; 
            font-size:.14rem;
          }
          .van-icon{
            position: absolute;
            top:53%;
            right:.07rem;
            vertical-align: middle; 
            transform: translateY(-50%);
          }
        }
        .notstart{
          color:#5398ff;
        }
        .doing{
          color:#ffa800;
        }
        .delay{
          color:#ff4231;
        }
        .done{
          color:#2cd079;
        }
      }
    }
    .issue_box{
      position: fixed;
      left:0;
      bottom:0;
      width:100%;
      padding:.04rem 0;
      background-color:#fff;
      font-size: 0;
      box-sizing: border-box;
      textarea{
        width:75%;
        height:.33rem;
        margin-left:3%;
        padding:.07rem .08rem .08rem .08rem;
        border:1px solid #f7f7f7;
        color:#656565;
        font-size: .12rem;
        border-radius: .2rem;
        box-sizing: border-box;
      }
      input::placeholder{
        color:#c2c2c2;
      }
      .issue_btn{
        display: inline-block;
        width:16%;
        margin:0 3%;
        line-height:.33rem;
        text-align: center;
        background-color: #2cd079;
        color:#fff;
        font-size: .16rem;
        vertical-align: top;
        border-radius: .3rem;
      }
    }
  }
</style>
