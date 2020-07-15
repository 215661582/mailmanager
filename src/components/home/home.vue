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
          <!-- 1 -->
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/users">
                <i class="el-icon-menu"></i>用户列表
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <!-- 2 -->
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/roles">
                <i class="el-icon-menu"></i>角色列表
              </el-menu-item>
              <el-menu-item index="/rights">
                <i class="el-icon-menu"></i>权限列表
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <!-- 3 -->
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>商品管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="3-1">
                <i class="el-icon-menu"></i>商品列表
              </el-menu-item>
              <el-menu-item index="3-2">
                <i class="el-icon-menu"></i>分类参数
              </el-menu-item>
              <el-menu-item index="3-3">
                <i class="el-icon-menu"></i>商品分类
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <!-- 4 -->
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>订单管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="4-1">
                <i class="el-icon-menu"></i>订单列表
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <!-- 5 -->
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>数据统计</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="5-1">
                <i class="el-icon-menu"></i>选项1
              </el-menu-item>
              <el-menu-item index="5-2">
                <i class="el-icon-menu"></i>选项2
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
    }
  },
  beforeCreate() {
    // 判断有没有 token 如果没有跳转回登录页面
    const token = localStorage.getItem("token");
    if (!token) {
      this.$router.push({ name: "login" });
    }
  },
  mounted() {
    // 获取当前url 参数
    this.defaultActive = this.$route.path
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