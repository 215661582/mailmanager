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
      </el-col>
    </el-row>
    <!-- 表格 -->
    <template>
      <el-table :data="ordersList" :stripe="true" border style="width: 100%">
        <el-table-column type="index" label="#" width="80"></el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="350"></el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="100"></el-table-column>
        <el-table-column prop="goods_weight" label="是否付款" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.order_pay === '0'">已付款</el-tag>
            <el-tag type="danger" v-if="scope.row.order_pay === '1'">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="100"></el-table-column>
        <el-table-column label="下单时间" width="150">
          <template slot-scope="scope">{{ scope.row.create_time | dateFormat }}</template>
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
              @click="showEditbox"
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
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 添加分类 -->
    <el-dialog title="修改订单地址" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="省市区" label-width="100px">
          {{selectedOptions}}
          <!-- 联级选择器 -->
          <el-cascader
            clearable
            expand-trigger="hover"
            v-model="selectedOptions"
            :options="options"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" label-width="100px">
          <el-input v-model="form.cat_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import { regionData } from "element-china-area-data";

export default {
  data() {
    return {
      options: regionData,

      selectedOptions: [],

      form:{},

      // 查询参数
      query: "",
      // 当前页码
      pagenum: 1,
      // 每页显示条数
      pagesize: 5,
      // 当前页数
      currentPage: 1,

      ordersList: [],

      // 分页相关数据
      total: -1,

      dialogFormVisible: false,


    };
  },
  created() {
    this.getOrdersData();
  },
  methods: {
    handleChange() {},
    //  显示编辑盒子
    showEditbox() {
      this.dialogFormVisible = true;
    },
    addCate(){},

    // 点击添加商品
    showAddGoods() {
      this.$router.push({ name: "goodsadd" });
    },

    // 当搜索框内容改变了
    keywordSerach() {
      this.getOrdersData();
    },

    // 用户选择页数大小的时候触发
    handleSizeChange(val) {
      this.pagesize = val;
      this.getOrdersData();
    },

    // 用户选择第几页的时候触发
    handleCurrentChange(val) {
      this.pagenum = val;
      this.getOrdersData();
    },

    // 获取商品列表
    async getOrdersData() {
      const res = await this.$http.get(
        `orders?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      );
      //   console.log(res)
      const {
        meta: { msg, status },
        data: { total, goods }
      } = res.data;
      if (status == 200) {
        // 1. 给表格数据赋值
        this.ordersList = goods;
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
