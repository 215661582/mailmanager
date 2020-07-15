<template>
  <el-card>
    <!-- 面包屑 -->
    <my-bread level1="权限管理" level2="权限列表"></my-bread>

    <!-- 表格 -->
    <!-- <template>
      <el-table :data="rightsList" style="width: 100%">
        <el-table-column type="index" label="#" width="150"></el-table-column>
        <el-table-column prop="username" label="权限名称" width="200"></el-table-column>
        <el-table-column prop="email" label="路劲" width="200"></el-table-column>
        <el-table-column prop="mobile" label="层级" width="200"></el-table-column>
      </el-table>
    </template>-->
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      rightsList: []
    };
  },
  created() {
    this.getRightsList();
  },
  methods: {
    // 获取列表数据  
    async getRightsList(){
        const res = await this.$http.get('rights/list')
        console.log(res)
    }
  }
};
</script>

<style>
</style>