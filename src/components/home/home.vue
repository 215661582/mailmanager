<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header class="home-header">
      <el-row>
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <img height="60" src="../../assets/logo.png" alt="无法显示图片" />
          </div>
        </el-col>
        <el-col :span="18">
          <div class="grid-content bg-purple-light">
            <h1 class="title">电商后台管理系统</h1>
          </div>
        </el-col>
        <el-col :span="2">
          <div class="grid-content bg-purple">
            <a class="loginout" @click.prevent="loginOut" href="#">退出</a>
          </div>
        </el-col>
      </el-row>
    </el-header>

    <el-container>
      <!-- 侧边导航栏 -->
      <el-aside class="home-aside" width="200px">
        <el-menu 
        :default-active="defaultActive"
        :router="true" 
        :unique-opened="true">
          
          <el-submenu :index="''+item.order" v-for="item in menusList" :key="item.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item-group v-for="item2 in item.children" :key="item2.id">
              <el-menu-item :index="item2.path">
                <i class="el-icon-menu"></i>{{ item2.authName }}
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          
        </el-menu>
      </el-aside>

      <!-- 主体内容 -->
      <el-main class="home-main">
          <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      defaultActive: "1",
      menusList: []
    }
  },
  beforeCreate() {
    // 判断有没有 token 如果没有跳转回登录页面
    const token = localStorage.getItem("token");
    if (!token) {
      this.$router.push({ name: "login" });
    }
  },
  created() {
    // 获取当前url 参数
    this.defaultActive = this.$route.path.replace('/','')
    this.getmenus()
  },
  methods: {
    loginOut() {
      if (confirm("确认退出吗")) {
        // 1. 清除token
        localStorage.clear();
        // 2. 提示
        this.$message.success("退出成功");
        // 3. 跳到login组件
        this.$router.push({ name: "login" });
      }
    },
    // 动态获取侧边导航数据
    async getmenus(){
      const res = await this.$http.get('menus')
      // console.log(res)
      this.menusList = res.data.data
    }
  }
};
</script>

<style >
.home-container {
  height: 100%;
}
.home-header {
  background-color: #b3c0d1;
}
.home-aside {
  background-color: #d3dce6;
}
.home-main {
  background-color: #e9eef3;
}
.title {
  text-align: center;
  line-height: 60px;
}
.loginout {
  line-height: 60px;
  text-decoration: none;
}
</style>