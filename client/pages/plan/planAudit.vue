<template>
  <div id='planAudit_index'>
    <div class='info_container'>
      <van-cell class='cell_box' :title="detail.table.name?detail.table.name:''" is-link :to="'/plan/planDetail/?id='+detail.tableId+'&type_code='+detail.type_code" />
      <div class='info_box'>
        <div class='plan_tit'>事项周期</div>
        <div class='plan_time' v-show='detail.table.start_time'>{{detail.table.start_time?detail.table.start_time:''}} 到 <i :class='detail.table.status==-1?"delay_cnt":""'>{{detail.table.end_time?detail.table.end_time:''}}</i></div>
      </div>
      <div class='info_box'>
        <div class='plan_tit'>事项描述</div>
        <div class='plan_time' v-show='detail.table.start_time'>{{detail.table.desc?detail.table.desc:'无'}}</div>
      </div>
      <div class='info_box'>
        <div class='plan_tit'>状态</div>
        <div class='plan_time'>
          <span class="vt notstart_cnt" v-show='detail.table.status==0'>未开始</span>
          <span class="vt doing_cnt" v-show='detail.table.status==1'>进行中</span>
          <span class="vt done_cnt" v-show='detail.table.status==2'>已完成</span>
          <span class="vt delay_cnt" v-show='detail.table.status==-1'>已延迟</span>
        </div>
      </div>
      <div class='info_box'>
        <div class='plan_tit'>成果要求</div>
        <div class='plan_time' v-show='detail.table.start_time'>{{detail.table.result_desc?detail.table.result_desc:'无'}}</div>
      </div>
      <div class='info_box'>
        <div class='plan_tit'>更新人</div>
        <div class='plan_time'>{{detail.user?detail.user.name:''}}</div>
      </div>
      <div class='info_box'>
        <div class='plan_tit'>更新时间</div>
        <div class='plan_time'>{{detail.created_time?detail.created_time:''}}</div>
      </div>
      <div class='info_box'>
        <div class='plan_tit'>更新说明</div>
        <div class='plan_time' v-show='detail.table.name'>{{detail.desc?detail.desc:'无'}}</div>
      </div>
      <div class='info_box' v-if='detail.cause'>
        <div class='plan_tit'>延迟原因</div>
        <div class='plan_time'>{{detail.cause}}</div>
      </div>
      <div class='info_box' v-if='detail.delay_desc'>
        <div class='plan_tit'>延迟说明</div>
        <div class='plan_time'>{{detail.delay_desc}}</div>
      </div>
      <div class='info_box'>
        <div class='plan_tit'>完成进度</div>
        <div class='plan_time' v-if='detail.table.name'><div class='progress_box'><span class='all'></span><span :style='"width:"+own_progress+"%"' class='finish'></span></div><span class='progress_val'>{{own_progress}}%</span></div>
      </div>
    </div>
    <div class='info_container'>
      <div class='info_box'>
        <div class='plan_tit progress_tit'>有效进度</div>
        <div class='plan_time progress_tit_num'><input id='set_progress' @focus="input_focus" @blur="input_blur" v-model='detail.progress' type='number' pattern="[0-9]*"><span class='ps'>%</span></div>
      </div>
      <div class='info_box'>
        <div class='plan_tit'>审核说明</div>
        <div class='plan_con'>
          <van-radio-group v-model="state" id='radio_box' :disabled='checked'>
            <van-radio name="有效">有效</van-radio>
            <van-radio name="无效">无效</van-radio>
          </van-radio-group>
          <div class='cause_list' v-for='(v,i) in cause' :key='i' @click='useCause(v,i)'>{{v}}<span class='symbol' v-if='i!=2'>|</span></div>
          <div class='plan_time' ><textarea id='set_grade_desc' v-model='grade_desc' cols="30" rows="10" @focus="input_focus" @blur="input_blur"></textarea></div>
        </div>
      </div>
      <div class='submit_btn' v-show='detail.table.name && !checked' @click='auditProgress'>提交</div>
    </div>
    

    <loading v-if="isLoading"></loading>
  </div>
</template>
<script>
import loading from '../../components/common/loading.vue'
import dateFormat from '~/plugins/dateFormat'
import ddShare from '~/plugins/ddShare'
export default {
  head: {
    title: '',
  },
  components: {
    loading,
    ddShare
  },
  data() {
    return {
      id:this.$route.query.id,
      taskid:this.$route.query.taskid,
      detail:{
        table:{}
      },
      grade_desc:'',
      own_progress:0,
      new_progress:'',
      isLoading:false,
      state: '有效',
      cause:[
        '审核成功',
        '审核失败',
        '失败,说明不清晰',
      ],
      checked:false,
      changScroll:1,
    }
  },
  beforeRouteLeave(to, from, next) {
    if (navigator.userAgent.toLowerCase().indexOf("dingtalk") >= 0) {     //判断是不是钉钉
      dd.biz.navigation.setTitle({
        title : process.env.title,
      });
    } 
    next();
  },
  mounted() {
    this.getAuditDetails()
    ddShare()
  },
  methods: {
    //点击某个原因
    useCause(v,i){
      if(this.checked){
        return
      }
      this.grade_desc = v
      if(i==0){
        this.state = '有效'
      }else{
        this.state = '无效'
      }
    },
    //获取核实进度详情
    getAuditDetails(){
      this.isLoading = true
      this.$axios({
        method: "GET",
        url: "/planManage/getAuditDetails/"+this.id+"/"+this.taskid
      }).then(res => {
        res.data.table.start_time = dateFormat(res.data.table.start_at * 1000,'yyyy-M-d')
        res.data.table.end_time = dateFormat(res.data.table.end_at * 1000,'yyyy-M-d')
        res.data.created_time = dateFormat(res.data.created_at * 1000,'yyyy-M-d')
        res.data.table.own_progress = parseInt(res.data.table.own_progress)
        res.data.tableId = res.data.table.id
        res.data.progress = parseInt(res.data.progress)
        this.detail = res.data

        let title = ''
        if(this.detail.table){
          title = this.detail.table.name
        }
        if (navigator.userAgent.toLowerCase().indexOf("dingtalk") >= 0) {     //判断是不是钉钉
          dd.biz.navigation.setTitle({
            title : title,
          });
        } 

        if(this.detail.work_task.examine && this.detail.work_task.examine.id>0){
          this.checked = true
          document.getElementById("set_progress").setAttribute('readOnly','true')
          document.getElementById("set_grade_desc").setAttribute('readOnly','true')
          this.grade_desc = this.detail.work_task.examine.content
          if(this.detail.work_task.examine.status==1){
            this.state = '有效'
          }else{
            this.state = '无效'
          }
          if(this.detail.work_task.examine.custom){
            this.detail.progress = this.detail.work_task.examine.custom.effe_progress
          }
        }
        this.own_progress = this.detail.table.own_progress
        this.new_progress = this.detail.table.own_progress
        this.isLoading = false
      }).catch(data => {
        this.$toast.fail(data);
        this.isLoading = false
      });
    },
    //提交审核
    auditProgress(){
      if(this.checked){
        return
      }
      if(this.detail.progress>100){
        this.$toast('审核进度不能大于100%');
        return
      }else if(this.detail.progress<-100){
        this.$toast('审核进度不能小于100%');
        return
      }else if(this.grade_desc==''){
        this.$toast('审核说明不能为空');
        return
      }
      this.$axios({
        method: "POST",
        url: "/planManage/auditProgress",
        data: {
          taskid: this.taskid,
          grade_desc: this.grade_desc,
          grade: this.state,
          effe_progress: this.detail.progress,
        }
      }).then(data => {
        this.$toast(data.data);
        this.getAuditDetails()
      }).catch(data => {
        this.$toast.fail(data);
      });
    },
    input_blur(){   //离开焦点
      this.changScroll = 0
      setTimeout(()=>{
        this.changScroll = 1
      },100)
    },
    input_focus(){  //获取焦点
      setTimeout(()=>{
        if(this.changScroll == 1){
          scroll(0, document.documentElement.scrollHeight || document.body.scrollHeight)
        }
      },50)
    },
  },
}
</script>
<style lang="less" scoped>
  #planAudit_index{
    position: relative;
    .info_container{
      width:95%;
      margin:2.5%;
      padding:.06rem 0 .2rem 0;
      background-color: #fff;
      overflow: hidden;
      border-radius: .1rem;
      .cell_box{
        padding:.1rem .14rem;
        .van-cell__title{
          font-size: .18rem;
          letter-spacing: .02rem;
          font-weight: bold;
          span{
            color:#000;
          }
        }
        .van-icon{
          color:#000;
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
        .progress_tit,.progress_tit_num{
          vertical-align: middle;
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
          .progress_box{
            position: relative;
            top:-.01rem;
            display:inline-block;
            height:.16rem;
            width:82%;
            vertical-align: middle;
            span{
              position: absolute;
              left:0;
              top:0;
              height:100%;
              border-radius: .1rem;
            }
            .finish{
              background-color:#4ace56;
            }
            .all{
              width:100%;
              background-color:#f3f3f3;
            }
          }
          input{
            width:75%;
            padding:.03rem 0 .03rem .06rem;
            font-size:.14rem;
          }
          .ps{
            display:inline-block;
            margin-left:2%;
            font-size: .16rem;
            color:#2cd079;
            vertical-align: middle;
          }
          .progress_val{
            display:inline-block;
            width:18%;
            text-align: center;
          }
        }
        .plan_con{
          display:inline-block;
          width:75%;
          .van-radio-group{
            margin-bottom:.02rem;
            .van-radio{
              display:inline-block;
              width:.9rem;
              /deep/ .van-radio__icon{
                height:.18rem;
                line-height:.18rem;
                font-size: .18rem;
                display:inline-block;
                vertical-align: middle;
                /deep/ .van-icon-success{
                  line-height:.18rem;
                }
              }
              /deep/ .van-radio__label{
                font-size:.14rem;
                vertical-align: middle;
                line-height:.2rem;
                margin-left:.06rem;
              }
            }
          }
          .cause_list{
            display:inline-block;
            padding:.03rem .04rem .03rem 0;
            color:#23aee7;
            .symbol{
              position: relative;
              top: -.02rem;
              margin-left:.04rem;
              color:#333;
            }
          }
          .cause_list:last-child{
            padding-right:0;
          }
          .plan_time{
            margin-top:.03rem;
            width:100%;
            textarea{
              width:91%;
              height: .64rem;
              margin-top:.02rem;
              font-size:.14rem;
            }
          }
        }
      }
    }
    .submit_btn{
      width:80%;
      margin-top:.15rem;
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
