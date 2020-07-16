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
              @click="showDistRights(scope.row)"
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
      <!-- 
        树形结构
        data -> 数据源[]
        show-checkbox ->选择框
        node-key 每个节点的唯一标识 通常是data数据源中key名id
        default-expanded-keys 默认展开[要展开的节点的id]
        default-checked-keys [要选择的节点的id]
        props 配置项 {label， children}
        label 节点的文字标题和children节点的子节点
        值都来源于data绑定的数据源中的该数据的key名 'label' 和 'childred'
      -->
      <!-- :default-expanded-keys="[2, 3]"
      :default-checked-keys="[5]" -->
      <el-tree
        :data="rightsDataList"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :props="defaultProps"
        :default-checked-keys="arrcheck"
        ref="tree"
      ></el-tree>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRights = false">取 消</el-button>
        <el-button type="primary" @click="setRoleRights">确 定</el-button>
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

      dialogFormVisibleRights: false,

      // 分配权限所需数据
      rightsDataList: [],
      defaultProps: {
        label: "authName",
        childred: "children"
      },
      // 角色已有权限
      arrcheck: [],
      // 角色id
      currRoleId: -1
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    // 分配权限 - 角色授权
    async setRoleRights(){
      // roles/:roleId/rights
      // :roleId	角色 ID	不能为空携带在url中
      // rids	权限 ID 列表	以 , 分割的权限 ID 列表

      // 获取权限 全选和半选 id
      // getCheckedKeys  全选
      // getHalfCheckedKeys  半选
      var arr1 = []
      var arr2 = []
      arr1 = this.$refs.tree.getCheckedKeys()
      arr2 = this.$refs.tree.getHalfCheckedKeys()
      var arrRids = [...arr1,...arr2].join(',')
      // console.log(arrRids)
      // console.log([...arr1,...arr2])
      
      const res = await this.$http.post(`roles/${this.currRoleId}/rights`,{rids: arrRids})
      // console.log(res)
      if(res.data.meta.status == 200 ){
        this.getRolesList()
        this.dialogFormVisibleRights = false 
        this.$message.success(res.data.meta.msg)
      } else {
        this.$message.success(res.data.meta.msg)
      }
    },

    // 分配权限 - 打开对话框
    async showDistRights(rights) {
      // 当前角色id
      this.currRoleId = rights.id

      // 获取树形结构的数据
      const res = await this.$http.get("rights/tree");
      // console.log(rights);
      this.rightsDataList = res.data.data;

      // 获取当前啊角色的权限id
      let arrtemp1 = [];
      rights.children.forEach(item1 => {
        // arrtemp1.push(item1.id);
        item1.children.forEach(item2 => {
          // arrtemp1.push(item2.id);
          item2.children.forEach(item3 => {
            arrtemp1.push(item3.id);
          });
        });
      });
      // console.log(arrtemp1)
      this.arrcheck = arrtemp1

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