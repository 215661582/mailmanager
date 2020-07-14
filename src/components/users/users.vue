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
        <el-input
          placeholder="请输入内容"
          clearable
          v-model="query"
          @change="keywordSerach"
          class="inputSearch"
        >
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="primary" @click="showAddUserDia">添加用户</el-button>
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
            <el-switch v-model="scope.row.mg_state" @change="switchChange(scope.row.id)" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" plain type="primary" @click="showEditUserBox" icon="el-icon-edit" circle></el-button>
            <el-button size="mini" plain type="danger" @click="showMessageBox(scope.row.id)"  icon="el-icon-delete" circle></el-button>
            <el-button size="mini" plain type="success" icon="el-icon-check" circle></el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>

    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[2, 4, 6, 8, 10]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 添加用户表单对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="用户名" label-width="100px">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密 码" label-width="100px">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮 箱" label-width="100px">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电 话" label-width="100px">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加用户表单对话框 -->
    <el-dialog title="修改用户信息" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form">
        <el-form-item label="用户名" label-width="100px">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮 箱" label-width="100px">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电 话" label-width="100px">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisibleEdit = false">确 定</el-button>
      </div>
    </el-dialog>
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
      total: -1,

      // 添加用户对话框的属性
      dialogFormVisibleAdd: false,

      // 编辑用户对话框的属性
      dialogFormVisibleEdit: false,

      // 添加用户的表单数据
      form: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      }
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    // // 点击删除用户
    showMessageBox(id){
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then( async () => {
          // console.log(id)
          const res = await this.$http.delete(`users/${id}`)
          // console.log(res)
          const {meta: {msg, status}} = res.data
          if(status == 200){
            this.$message({
            type: 'success',
            message: msg
          });
          this.getUserList()
          }
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },

    // 修改状态
    switchChange(id){
      this.userlist.some((item) => {
        if(item.id == id) {
          this.$http.put(`users/${id}/state/${item.mg_state}`).then((res) => {
            const {meta:{msg, status}} = res.data
            if(status == 200){
              this.$message.success(msg)
              this.getUserList()
            } else{
              this.$message.success(msg)
            }
          })
          return true
        }
      })
    },

    // 点击编辑显示编辑表单
    showEditUserBox(){
      this.dialogFormVisibleEdit = true
    },

    // 点击显示添加用户表单
    showAddUserDia() {
      this.dialogFormVisibleAdd = true
    },
    
    // 添加用户
    async  addUser(){
      const res = await this.$http.post('users', this.form)
      const {meta: {msg, status}} = res.data
      if(status == 201){
        // 1.表单数据清空 2.关闭表单 3.刷新列表数据 4.提示 
        this.form = {}
        this.dialogFormVisibleAdd = false
        this.pagenum = 1
        this.getUserList()
        this.$message.success(msg)
      } else {
        this.$message.success(msg)
      }
    },

    // 当搜索框内容改变了
    keywordSerach() {
      this.getUserList();
      
    },

    // 用户选择页数大小的时候触发
    handleSizeChange(val) {
      this.pagesize = val;
      this.getUserList();
    },

    // 用户选择第几页的时候触发
    handleCurrentChange(val) {
      this.pagenum = val;
      this.getUserList();
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
  height: 99.7%;
}
.inputSearch {
  width: 300px;
}
</style>
