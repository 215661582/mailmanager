<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索 -->
    <el-row>
      <el-col>
        <el-input placeholder="请输入内容" clearable v-model="query" @change="keywordSerach" class="inputSearch">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="primary" @click="open">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <template>
      <el-table :data="userlist" style="width: 100%">
        <el-table-column type="index" label="#" width="80"></el-table-column>
        <el-table-column prop="username" label="姓名" width="80"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话" width="180"></el-table-column>
        <el-table-column label="创建日期" width="180">
          <template slot-scope="scope">{{ scope.row.create_time | dateFormat }}</template>
        </el-table-column>
        <el-table-column label="用户状态" width="180">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <el-button size="mini" plain type="primary" icon="el-icon-edit" circle></el-button>
          <el-button size="mini" plain type="danger" icon="el-icon-delete" circle></el-button>
          <el-button size="mini" plain type="success" icon="el-icon-check" circle></el-button>
        </el-table-column>
      </el-table>
    </template>

    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[2, 4]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      // 查询参数
      query: "",
      // 当前页码
      pagenum: 1,
      // 每页显示条数
      pagesize: 2,
      // 当前页数
      currentPage: 1,

      // 用户列表
      // create_time: 1486720211
      // email: "adsfad@qq.com"
      // id: 500
      // mg_state: true
      // mobile: "12345678"
      // role_name: "超级管理员"
      // username: "admin"
      userlist: [],

      // 分页相关数据
      total: -1
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    // 点击添加用户
    open(){
      
    },

    // 当搜索框内容改变了
    keywordSerach(){
      this.getUserList()
      this.query = ''
    },

    // 用户选择页数大小的时候触发
    handleSizeChange(val) {
      this.pagesize = val
      this.getUserList()
    },

    // 用户选择第几页的时候触发
    handleCurrentChange(val) {
      this.pagenum = val
      this.getUserList()
    },

    // 获取用户列表
    async getUserList() {
      const AUTH_TOKEN = localStorage.getItem("token");
      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      );
      // console.log(res)
      const {
        meta: { msg, status },
        data: { total, users }
      } = res.data;
      if (status == 200) {
        // 1. 给表格数据赋值
        this.userlist = users;
        // 2. 给total赋值
        this.total = total;
      } else {
        // 提示
        this.$message.warning(msg);
      }
    }
  }
};
</script>

<style>
.el-breadcrumb {
  font-size: 12px;
  margin-bottom: 15px;
}
.box-card {
  height: 100%;
}
.inputSearch {
  width: 300px;
}
</style>
