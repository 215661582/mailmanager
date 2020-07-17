<template>
  <el-card>
    <!-- 面包屑 -->
    <my-bread level1="商品管理" level2="商品列表"></my-bread>

    <!-- 提示 -->
    <el-alert class="alert" title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon></el-alert>

    <!-- 级联选择器 -->
    <el-form label-position="left" label-width="80px" :model="form">
      <el-form-item label="商品分类" prop="goods_cat">
        {{selectedOptions}}
        <!-- 联级选择器 -->
        <el-cascader
         :show-all-levels="false"
          clearable
          expand-trigger="hover"
          v-model="selectedOptions"
          :options="options"
          :props="defaultProp"
          @change="handleChange"
        ></el-cascader>
      </el-form-item>
    </el-form>

    <!-- tabs -->
    <el-tabs tab-position="top">
      <el-tab-pane label="动态参数">
        <el-button type="danger">设置动态参数</el-button>
        <!-- 表格 -->
        <template>
          <el-table :data="arrDyparams" :stripe="true" border style="width: 100%">
            <el-table-column type="expand" label="#">
              <template slot-scope="scope">
                <el-tag
                  :key="tag"
                  v-for="tag in scope.row.attr_vals"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(scope.row,tag)"
                >{{tag}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="attr_name" label="属性名称" width="500"></el-table-column>

            <el-table-column label="操作">
              <template>
                <!-- 编辑按钮 -->
                <el-button size="mini" plain type="primary" icon="el-icon-edit" circle></el-button>
                <!-- 删除按钮 -->
                <el-button size="mini" plain type="danger" icon="el-icon-delete" circle></el-button>
                <!-- 分配按钮 -->
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-tab-pane>
      <el-tab-pane label="静态参数">
          <el-button type="danger">设置动态参数</el-button>
          <template>
          <el-table :data="arrStaticparams" :stripe="true" border style="width: 100%">
            
            <el-table-column type="index" label="#" width="100"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称" width="300"></el-table-column>
            <el-table-column prop="attr_vals" label="属性值" width="300"></el-table-column>

            <el-table-column label="操作">
              <template>
                <!-- 编辑按钮 -->
                <el-button size="mini" plain type="primary" icon="el-icon-edit" circle></el-button>
                <!-- 删除按钮 -->
                <el-button size="mini" plain type="danger" icon="el-icon-delete" circle></el-button>
                <!-- 分配按钮 -->
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      form: {},
      // 级联选择器数据
      options: [],
      selectedOptions: [],
      defaultProp: {
        label: "cat_name",
        value: "cat_id",
        childred: "childred"
      },

      // 动态数据
      arrDyparams: [],
      // 静态数据
      arrStaticparams: [],

      inputVisible: false,
      inputValue: ""
    };
  },
  created() {
    this.getGoodsCate();
  },
  methods: {

    //   点击 X 的时候触发
    async handleClose(arrDyparams,tag) {
        arrDyparams.attr_vals.splice(arrDyparams.attr_vals.indexOf(tag), 1);
        // categories/:id/attributes/:attrId
        // :id	分类 ID	不能为空携带在url中
        // :attrId	属性 ID	不能为空携带在url中
        // attr_name	参数名称	不能为空
        // attr_sel	[only,many]	不能为空
        // attr_vals	如果是 many 就需要填写值的选项，以逗号分隔
        // console.log(arrDyparams)
        let putData = {
            attr_name: arrDyparams.attr_name,
            attr_sel: arrDyparams.attr_sel,
            attr_vals: arrDyparams.attr_vals.join(',')
        }
        const res = await this.$http.put(`categories/${arrDyparams.cat_id}/attributes/${arrDyparams.attr_id}`, putData)
        // console.log(res)
      
    // console.log(tag)
    },

    // 点击newTag
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    // 键盘 enter 和失去焦点 执行
    async handleInputConfirm(arrDyparams) {
      let inputValue = this.inputValue;
      if (inputValue) {
        arrDyparams.attr_vals.push(inputValue);

        let putData = {
            attr_name: arrDyparams.attr_name,
            attr_sel: arrDyparams.attr_sel,
            attr_vals: arrDyparams.attr_vals.join(',')
        }
        const res = await this.$http.put(`categories/${arrDyparams.cat_id}/attributes/${arrDyparams.attr_id}`, putData)
      }
      this.inputVisible = false;
      this.inputValue = "";
    },

    //  联级选择器改变
    async handleChange() {
      if (this.selectedOptions.length === 3) {
        // 获取动态数据
        const res = await this.$http.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=many`
        );

        this.arrDyparams = res.data.data;
        // 分类数据
        this.arrDyparams.forEach(item => {
          // 如果为空就返回空数组 否则把字符串变为数组

          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.trim().split(",");
        });
        // console.log(this.arrDyparams);

        // 获取静态数据
        const result = await this.$http.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=only`
        );
        // console.log(result);
        this.arrStaticparams = result.data.data;
        console.log(this.arrStaticparams)
      }
    },
    // 获取商品分类列表
    async getGoodsCate() {
      const res = await this.$http.get("categories?type=3");
      //   console.log(res.data.data);
      this.options = res.data.data;
    }
  }
};
</script>

<style>
.alert {
  margin-bottom: 15px;
}
</style>