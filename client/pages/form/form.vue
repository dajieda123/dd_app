<template>
  <div>
    <fm-generate-form 
      :data="jsonData" 
      :remote="remoteFuncs" 
      :value="editData" 
      ref="generateForm"
    >
    </fm-generate-form>
    <el-button type="primary" @click="handleSubmit">提交</el-button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      jsonData: {"list":[{"type":"input","icon":"icon-input","options":{"width":"100%","defaultValue":"","required":false,"dataType":"string","pattern":"","placeholder":"","customClass":"","disabled":false,"labelWidth":100,"isLabelWidth":false,"hidden":false,"dataBind":true,"showPassword":false,"remoteFunc":"func_1572509397092"},"name":"单行文本","key":"1572509397092","model":"input_1572509397092","rules":[{"type":"string","message":"单行文本格式不正确"}]}],"config":{"labelWidth":100,"labelPosition":"right","size":"small","customClass":""}},
      editData: {},
      remoteFuncs: {
        
      }
    }
  },
  methods: {
    handleSubmit () {
      this.$refs.generateForm.getData().then(data => {
        // 数据校验成功
        // data 为获取的表单数据
        alert(JSON.stringify(data))
      }).catch(e => {
        // 数据校验失败
      })
    }
  }
}
</script>