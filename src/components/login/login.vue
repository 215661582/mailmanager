<template>
  <div class="login-wrap">
    <el-form class="login-form" :model="formdata" label-position="top" label-width="80px">
      <h1>用户登录</h1>
      <el-form-item label="用户名">
        <el-input v-model="formdata.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formdata.password"></el-input>
      </el-form-item>
      <el-button class="login-btn" type="primary" @click="postLogin">登录</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formdata: {
        username: "",
        password: ""
      }
    };
  },
  methods: {
      postLogin(){
          this.$http.post('login', this.formdata).then(res => {
            //   console.log(res)
                const {meta:{msg,status}, data} = res.data
                if(status === 200){
                    // 成功 提示框 给本地存储传token值  跳转
                    localStorage.setItem('token', data.token)
                    this.$message.success(msg);
                    this.$router.push({name: 'home'})
                } else {
                    // 提示框
                    this.$message.error(msg);
                }
          })
      }
  }
};
</script>

<style>
.login-wrap{
    height: 100%;
    background-color: #324152;
    display: flex;
    justify-content: center;
    align-items: center;
}
.login-form{
    width: 400px;
    background-color: #fff;
    border-radius: 5px;
    padding: 30px;
}
.login-btn{
    width: 100%;
}
</style>