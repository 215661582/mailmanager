<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-bread level1="商品管理" level2="商品列表"></my-bread>

    <!-- 搜索 -->
    <el-row>
      <el-col>
        <el-button type="primary" @click="showAddCate">添加分类</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <template>
      <el-table :data="goodsCateList" :stripe="true" border style="width: 100%">
        
        <el-tree-grid 
        prop="cat_name" 
        label="分类名称" 
        treeKey="cat_id"
        parentKey="cat_pid" 
        levelKey="cat_level" 
        childKey="children"></el-tree-grid>
          
        <el-table-column label="级别" width="500">
          <template slot-scope="scope">
            <span v-if="scope.row.cat_level===0">一级</span>
            <span v-else-if="scope.row.cat_level===1">二级</span>
            <span v-else-if="scope.row.cat_level===2">三级</span>
          </template>
        </el-table-column>
        <el-table-column label="是否有效" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.cat_deleted===false">有效</span>
            <span v-else-if="scope.row.cat_deleted===true">无效</span>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 编辑按钮 -->
            <el-button size="mini" plain type="primary" icon="el-icon-edit" circle></el-button>
            <!-- 删除按钮 -->
            <el-button
              size="mini"
              plain
              type="danger"
              icon="el-icon-delete"
              circle
              @click="delGoods(scope.row.goods_id)"
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

    <!-- 添加分类 -->
  <el-dialog title="添加分类" :visible.sync="dialogFormVisibleAdd">
    
  <el-alert
    title="添加分类提示"
    type="info"
    description="没选分类添加为一级，选择一级分类则添加为该一级分类的二级，选择二级分类则添加为该二级分类的三级"
    show-icon>
  </el-alert>
      <el-form :model="form">
        <el-form-item label="分类名称" label-width="100px">
          <el-input  v-model="form.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分 类" label-width="100px">
          {{selectedOptions}}
          <!-- 联级选择器 -->
            <el-cascader
              clearable
              expand-trigger="hover"
              v-model="selectedOptions"
              :options="options"
              :props="defaultProp"
              @change="handleChange"
            ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </div>
    </el-dialog>

  </el-card>
</template>

<script>
import ElTreeGrid from "element-tree-grid";

export default {
  components: {
    ElTreeGrid
  },
  data() {
    return {
      // 当前页码
      pagenum: 1,
      // 每页显示条数
      pagesize: 10,
      // 当前页数
      currentPage: 1,

      // 分页相关数据
      total: -1,

      goodsCateList: [],

      dialogFormVisibleAdd: false,

      // cat_pid	分类父 ID	不能为空
      // cat_name	分类名称	不能为空
      // cat_level	分类层级	不能为空
      form: {
        cat_pid: '',
        cat_name: '',
        cat_level: ''
      },

      // 联级选择器所需数据
      options: [],
      selectedOptions: [],
      defaultProp: {
        label: "cat_name",
        value: "cat_id",
        childred: "childred",
         checkStrictly: true
      }

    };
  },
  created() {
    this.getGoodsCate();
    this.getCateData()
  },
  methods: {
    // 添加分类
    async addCate(){
      if(this.form.cat_name.length === 0){
        this.$message.warning('分类名称不能为空')
        return
      }
      if(this.selectedOptions.length === 0){
        this.form.cat_pid = 0
        this.form.cat_level = 0
      } else if (this.selectedOptions.length === 1){
        this.form.cat_pid = this.selectedOptions[0]
        this.form.cat_level = 1
      } else if (this.selectedOptions.length === 2){
        this.form.cat_pid = this.selectedOptions[1]
        this.form.cat_level = 2
      } 
      // console.log(this.form)
      const res = await this.$http.post('categories', this.form)
      console.log(res)
      const {meta: {msg, status}} = res.data
      if(status === 201){
        this.$message.success(msg)
        this.getGoodsCate()
        this.dialogFormVisibleAdd = false
      } else {
        this.$message.warning(msg)
      }
    },
    // 显示添加分类视图
    showAddCate(){
      this.dialogFormVisibleAdd = true
    },

    handleChange(){},

    // 获取二级分类数据
    async getCateData(){
      const res = await this.$http.get("categories?type=2");
        // console.log(res.data.data);
      this.options = res.data.data;
    },

    // 用户选择页数大小的时候触发
    handleSizeChange(val) {
      this.pagesize = val;
      this.getGoodsCate();
    },

    // 用户选择第几页的时候触发
    handleCurrentChange(val) {
      this.pagenum = val;
      this.getGoodsCate();
    },

    // 获取商品列表
    async getGoodsCate() {
      const res = await this.$http.get(
        `categories?type=3&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      );
      // console.log(res);
      const {
        meta: { msg, status },
        data: { total, result }
      } = res.data;
      if (status == 200) {
        // 1. 给表格数据赋值
        this.goodsCateList = result;
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
