<template>
    <el-container class="home-container">
      <el-header class="home-header">Header</el-header>
      <el-container>
        <el-aside class="home-aside" width="200px">Aside</el-aside>
        <el-main class="home-main">Main</el-main>
      </el-container>
    </el-container>
</template>

<script>
export default {
    beforeCreate(){
        // 判断有没有 token 如果没有跳转回登录页面
        const token = localStorage.getItem('token')
        if(!token){
            this.$router.push({name: 'login'})
        }
    }
};
</script>

<style >
.home-container {
    height: 100%;
}
.home-header {
    background-color: #B3C0D1;
}
.home-aside {
    background-color: #D3DCE6;
}
.home-main {
    background-color: #E9EEF3;
}
</style>