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
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="商品名称">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="所属店铺">
                <span>{{ props.row.shop }}</span>
              </el-form-item>
              <el-form-item label="商品 ID">
                <span>{{ props.row.id }}</span>
              </el-form-item>
              <el-form-item label="店铺 ID">
                <span>{{ props.row.shopId }}</span>
              </el-form-item>
              <el-form-item label="商品分类">
                <span>{{ props.row.category }}</span>
              </el-form-item>
              <el-form-item label="店铺地址">
                <span>{{ props.row.address }}</span>
              </el-form-item>
              <el-form-item label="商品描述">
                <span>{{ props.row.desc }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#" width="150"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="300"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="300"></el-table-column>
        <el-table-column prop="level" label="操作" width="300">
          <template>
            <!-- 编辑按钮 -->
            <el-button size="mini" plain type="primary" icon="el-icon-edit" circle></el-button>
            <!-- 删除按钮 -->
            <el-button size="mini" plain type="danger" icon="el-icon-delete" circle></el-button>
            <!-- 分配按钮 -->
            <el-button size="mini" plain type="success" icon="el-icon-setting" circle></el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      rolesList: []
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    // // 获取权限列表数据
    async getRolesList() {
      const res = await this.$http.get("roles");
      //   console.log(res)
      this.rolesList = res.data.data;
    }
  }
};
</script>

<style>
</style>