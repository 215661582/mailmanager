<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-bread level1="商品管理" level2="商品列表"></my-bread>

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
        <el-button type="primary" @click="showAddGoods">添加商品</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <template>
      <el-table :data="goodsList" :stripe="true" border style="width: 100%">
        <el-table-column type="index" label="#" width="80"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="500"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="120"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="100"></el-table-column>
        <el-table-column label="创建日期" width="150">
          <template slot-scope="scope">{{ scope.row.upd_time | dateFormat }}</template>
        </el-table-column>

        <el-table-column label="操作">
          <template>
            <!-- 编辑按钮 -->
            <el-button
              size="mini"
              plain
              type="primary"
              icon="el-icon-edit"
              circle
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              size="mini"
              plain
              type="danger"
              icon="el-icon-delete"
              circle
            ></el-button>
            <!-- 分配按钮 -->
          </template>
        </el-table-column>
      </el-table>
    </template>

    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 10, 15, 20]"
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
      pagesize: 5,
      // 当前页数
      currentPage: 1,

      // 商品列表
    //   {
    //             "goods_id": 144,
    //             "goods_name": "asfdsd",
    //             "goods_price": 1,
    //             "goods_number": 1,
    //             "goods_weight": 1,
    //             "goods_state": null,
    //             "add_time": 1512954923,
    //             "upd_time": 1512954923,
    //             "hot_mumber": 0,
    //             "is_promote": false
    //         }
      goodsList: [],

      // 分页相关数据
      total: -1,

    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    // 点击添加商品
    showAddGoods(){

    },

    // 当搜索框内容改变了
    keywordSerach() {
      this.getGoodsList();
    },

    // 用户选择页数大小的时候触发
    handleSizeChange(val) {
      this.pagesize = val;
      this.getGoodsList();
    },

    // 用户选择第几页的时候触发
    handleCurrentChange(val) {
      this.pagenum = val;
      this.getGoodsList();
    },

    // 获取商品列表
    async getGoodsList() {
      const res = await this.$http.get(
        `goods?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      );
      // console.log(res)
      const {
        meta: { msg, status },
        data: { total, goods }
      } = res.data;
      if (status == 200) {
        // 1. 给表格数据赋值
        this.goodsList = goods;
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
