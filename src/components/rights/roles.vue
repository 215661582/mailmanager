<template>
  <el-card>
    <!-- 面包屑 -->
    <my-bread level1="权限管理" level2="角色列表"></my-bread>

    <!-- 添加角色 -->
    <el-button type="info">添加角色</el-button>

    <!-- 表格 -->
    <template>
      <el-table :data="rolesList" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="(item1, i) in scope.row.children" :key="i">
              <el-col :span="4">
                <el-tag
                  @close="delRoleRights(scope.row,item1.id)"
                  closable
                  type
                >{{ item1.authName }}</el-tag>
              </el-col>
              <el-col :span="20">
                <el-row v-for="(item2, i) in item1.children" :key="i">
                  <el-col :span="4">
                    <el-tag
                      @close="delRoleRights(scope.row,item2.id)"
                      closable
                      type="success"
                    >{{ item2.authName }}</el-tag>
                  </el-col>
                  <el-col :span="20">
                    <el-tag v-for="(item3, i) in item2.children" :key="i">
                      <el-tag
                        @close="delRoleRights(scope.row,item3.id)"
                        closable
                        type="danger"
                      >{{ item3.authName }}</el-tag>
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- 无权限提示 -->
            <span v-if="scope.row.children.length === 0">未分配权限</span>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#" width="150"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="300"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="300"></el-table-column>
        <el-table-column prop="level" label="操作" width="300">
          <template slot-scope="scope">
            <!-- 编辑按钮 -->
            <el-button size="mini" plain type="primary" icon="el-icon-edit" circle></el-button>
            <!-- 删除按钮 -->
            <el-button size="mini" plain type="danger" icon="el-icon-delete" circle></el-button>
            <!-- 分配按钮 -->
            <el-button
              size="mini"
              @click="DistRights(scope.row)"
              plain
              type="success"
              icon="el-icon-setting"
              circle
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>

    <!-- 分配权限对话框 -->
    <el-dialog title="修改权限" :visible.sync="dialogFormVisibleRights">
      
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRights = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisibleRights = false">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      // 角色列表
      rolesList: [],

      dialogFormVisibleRights: false

      // 分配权限所需数据
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    // 分配权限
    DistRights(rights) {
      console.log(rights);
      this.dialogFormVisibleRights = true;
    },

    // 删除角色权限
    async delRoleRights(role, rightId) {
      // console.log(roleId, rightId)
      // :roleId	角色 ID	不能为空携带在url中
      // :rightId	权限 ID	不能为空携带在url中
      const res = await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
      // console.log(res)
      const {
        meta: { msg, status },
        data
      } = res.data;
      if (status == 200) {
        this.$message.success(msg);
        role.children = data;
      } else {
        this.$message.warning(msg);
      }
    },

    // // 获取权限列表数据
    async getRolesList() {
      const res = await this.$http.get("roles");
      // console.log(res.data.data);
      this.rolesList = res.data.data;
    }
  }
};
</script>

<style>
.el-tag {
  margin-bottom: 5px;
}
</style>