<template>
  <el-card>
    <!-- 面包屑 -->
    <my-bread level1="权限管理" level2="权限列表"></my-bread>

    <!-- 表格 -->
    <template>
      <el-table :data="rightsList" height="450" style="width: 100%">
        <el-table-column type="index" label="#" width="150"></el-table-column>
        <el-table-column prop="authName" label="权限名称" width="300"></el-table-column>
        <el-table-column prop="path" label="路劲" width="300"></el-table-column>
        <el-table-column prop="level" label="层级" width="300">
            <template slot-scope="scope">
                <span v-if="scope.row.level === '0'">一级</span>
                <span v-if="scope.row.level === '1'">二级</span>
                <span v-if="scope.row.level === '2'">三级</span>
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
    //   authName: "商品管理"
    //   id: 101
    //   level: "0"
    //   path: "goods"
    //   pid: 0
      rightsList: []
    };
  },
  created() {
    this.getRightsList();
  },
  methods: {
    // 获取列表数据
    async getRightsList() {
      const res = await this.$http.get("rights/list");
      // console.log(res)
      if (res.data.meta.status == 200) {
        this.rightsList = res.data.data;
      }
    }
  }
};
</script>

<style>
</style>