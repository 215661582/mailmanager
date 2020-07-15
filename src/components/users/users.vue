<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-bread level1="用户管理" level2="用户列表"></my-bread>

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
            <el-switch
              v-model="scope.row.mg_state"
              @change="switchChange(scope.row.id)"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 编辑按钮 -->
            <el-button
              size="mini"
              plain
              type="primary"
              @click="showEditUserDia(scope.row)"
              icon="el-icon-edit"
              circle
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              size="mini"
              plain
              type="danger"
              @click="showMessageBox(scope.row.id)"
              icon="el-icon-delete"
              circle
            ></el-button>
            <!-- 分配按钮 -->
            <el-button
              size="mini"
              plain
              type="success"
              @click="showRoleUserDia(scope.row)"
              icon="el-icon-setting"
              circle
            ></el-button>
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

    <!-- 编辑用户表单对话框 -->
    <el-dialog title="修改用户信息" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form">
        <el-form-item label="用户名" label-width="100px">
          <el-input v-model="form.username" disabled autocomplete="off"></el-input>
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
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改用户角色表单对话框 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRole">
      <el-form :model="form">
        <el-form-item label="用户名:" label-width="100px">{{ currUserName }}</el-form-item>
        <el-form-item label="角 色:" label-width="100px">
        <el-select v-model="currRoleId">
          <el-option label="请选择" :value="-1"></el-option>
          <el-option v-for="item in nameRoleList" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
        </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
        <el-button type="primary" @click="userRoleEdit()">确 定</el-button>
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

      // 用户对话框的属性
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      dialogFormVisibleRole: false,

      // 添加用户的表单数据
      form: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },

      // 分配角色需要用到的数据
      // 角色id
      currRoleId: -1,
      // 用户信息
      currUserId: 0,
      // 用户名
      currUserName: '',
      // 角色名字
      nameRoleList: []
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    // 显示分配角色对话框
    async showRoleUserDia(user){
      // 显示对话框需要获取数据
      // 1. 当前用户名
      // 2. 当前用户信息
      // 3. 获取角色列表 名字
      // console.log(user)
      // 获取用户名
      this.currUserName = user.username
      // 获取用户信息
      const userInfo = await this.$http.get(`users/${user.id}`)
      // console.log(userInfo)
      this.currUserId = userInfo.data.data.id
      this.currRoleId = userInfo.data.data.rid
      // console.log(userInfo.data.data.id)
      // 获取角色列表 名字
      const nameList = await this.$http.get('roles')
      // console.log(nameList)
      this.nameRoleList = nameList.data.data
      this.dialogFormVisibleRole = true
    },
    // 设置用户角色
    async userRoleEdit(){
      const res = await this.$http.put(`users/${this.currUserId}/role`,{rid: this.currRoleId})
      // console.log(res)
      const {meta: {msg, status}} = res.data
      if(status == 200 ){
        this.$message.success(msg)
        this.dialogFormVisibleRole = false
      } else {
        this.$message.warning(msg)
      }
    },

    // 修改用户状态状态
    switchChange(id) {
      this.userlist.some(item => {
        if (item.id == id) {
          this.$http.put(`users/${id}/state/${item.mg_state}`).then(res => {
            const {
              meta: { msg, status }
            } = res.data;
            if (status == 200) {
              this.$message.success(msg);
              this.getUserList();
            } else {
              this.$message.warning(msg);
            }
          });
          return true;
        }
      });
    },

    // 点击编辑显示编辑表单
    showEditUserDia(user) {
      // 获取user数据
      // console.log(user)
      this.form = user;
      this.dialogFormVisibleEdit = true;
    },

    // 编辑用户信息
    async editUserInfo() {
      // id	用户 id	不能为空 参数是url参数:id
      // email	邮箱	可以为空
      // mobile	手机号	可以为空
      // console.log(this.form)
      const res = await this.$http.put(`users/${this.form.id}`, this.form);
      // console.log(res)
      const {
        meta: { msg, status }
      } = res.data;
      if (status == 200) {
        this.dialogFormVisibleEdit = false;
        this.$message.success(msg);
      } else {
        this.$message.warning(msg);
      }
    },

    // 点击显示添加用户表单
    showAddUserDia() {
      this.form = {}
      this.dialogFormVisibleAdd = true;
    },

    // 添加用户
    async addUser() {
      const res = await this.$http.post("users", this.form);
      const {
        meta: { msg, status }
      } = res.data;
      if (status == 201) {
        // 1.表单数据清空 2.关闭表单 3.刷新列表数据 4.提示
        this.form = {};
        this.dialogFormVisibleAdd = false;
        this.pagenum = 1;
        this.getUserList();
        this.$message.success(msg);
      } else {
        this.$message.success(msg);
      }
    },

    // 点击删除用户
    showMessageBox(id) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(async () => {
          // console.log(id)
          const res = await this.$http.delete(`users/${id}`);
          // console.log(res)
          const {
            meta: { msg, status }
          } = res.data;
          if (status == 200) {
            this.$message({
              type: "success",
              message: msg
            });
            this.getUserList();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
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

.box-card {
  height: 99.7%;
}
.inputSearch {
  width: 300px;
}
</style>
