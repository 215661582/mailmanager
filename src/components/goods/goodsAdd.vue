<template>
  <el-card>
    <!-- 面包屑 -->
    <my-bread level1="商品管理" level2="商品列表"></my-bread>
    <!-- 提示信息 -->
    <el-alert title="添加商品信息" type="info" center show-icon></el-alert>

    <!-- 步骤条 -->
    <el-steps :space="200" align-center :active="1*active" finish-status="success">
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>

    <!-- tabs 标签页 -->
    <el-form
      label-position="top"
      style="height: 330px; overflow:auto"
      label-width="80px"
      :model="form"
      :rules="rules"
    >
      <el-tabs @tab-click="tabChange" v-model="active" tab-position="left">
        <el-tab-pane name="1" label="基本信息">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="form.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类" prop="goods_cat">
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
        </el-tab-pane>
        <el-tab-pane name="2" label="商品参数">
          <el-form-item :label="item1.attr_name" v-for="(item1, i) in arrDyparams" :key="i">
            <el-checkbox-group v-model="item1.attr_vals">
              <el-checkbox border v-for="(item2, i) in item1.attr_vals" :key="i" :label="item2"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="3" label="商品属性">
          <el-form-item :label="item.attr_name" v-for="(item, i) in arrStaticparams" :key="i">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="4" label="商品图片">
          <el-upload
            class="upload-demo"
            action="http://localhost:8888/api/private/v1/upload"
            :headers="headers"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :file-list="fileList"
            list-type="picture"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane name="5" label="商品内容">
          <el-button type="primary" @click="addGoods">点我-添加商品</el-button>
          <quill-editor v-model="form.goods_introduce"></quill-editor>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>

  <!-- 
    <el-form-item label="名称">
      <el-input v-model="formLabelAlign.name"></el-input>
    </el-form-item>
  -->
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
 
import { quillEditor } from 'vue-quill-editor'

export default {
  components: {
    quillEditor
  },
  data() {
    return {
      active: "1",
      // goods_name	商品名称	不能为空
      // goods_cat	以为','分割的分类列表	不能为空
      // goods_price	价格	不能为空
      // goods_number	数量	不能为空
      // goods_weight	重量	不能为空
      // goods_introduce	介绍	可以为空
      // pics	上传的图片临时路径（对象）	可以为空
      // attrs	商品的参数（数组）	可以为空
      form: {
        goods_name: "",
        goods_cat: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_introduce: "",
        pics: [],
        attrs: []
      },
      // 表单校验
      rules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goods_cat: [
          { required: true, message: "请选择商品类型", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" }
        ]
      },

      // 联级选择器所需数据
      options: [],
      selectedOptions: [1, 3, 6],
      defaultProp: {
        label: "cat_name",
        value: "cat_id",
        childred: "childred"
      },
      // 动态数据
      arrDyparams: [],
      // 静态数据
      arrStaticparams: [],

      // 上传图片
      fileList: [],
      headers: {
        Authorization: localStorage.getItem('token')
      }
    };
  },
  created() {
    this.getGoodsCate();
  },
  methods: {
    // 添加商品
    async addGoods(){
      // 处理 商品分类
      this.form.goods_cat = this.selectedOptions.join(',')

      // 处理商品的参数
      let arr1 = this.arrDyparams.map(item => {
        return {attr_id: item.attr_id, attr_value: item.attr_vals}
      })
      let arr2 = this.arrStaticparams.map(item => {
        return {attr_id: item.attr_id, attr_value: item.attr_vals}
      })
      this.form.attrs = [...arr1,...arr2]
      // console.log(arr3)
      // console.log(this.arrDyparams)
      // console.log(this.arrStaticparams)
      // console.log(this.form)
      const res = await this.$http.post('goods',this.form)
      // console.log(res)
      if(res.data.meta.status == 201){
        this.$message.success(res.data.meta.msg)
        this.form = {}
        this.$router.push({name: 'goods'})
      } else {
        this.$message.success(res.data.meta.msg)
      }
    },
    // 上传图片成功的钩子
    handleSuccess(file){
      // 获取临时图片路劲 data.tmp_path
      // console.log(file)
      this.form.pics.push({pic: file.data.tmp_path})
      // console.log(this.form.pics)
    },
    // 移除图片的钩子
    handleRemove(file) {
      // 获取临时图片路劲 file.response.data.tmp_path
      // console.log(file);
      // 找到数组的索引删除
      var index = this.form.pics.findIndex(item => {
        return item.pic == file.response.data.tmp_path
      })
      this.form.pics.splice(index, 1)
      // console.log(index)
      // console.log(this.form.pics)
    },
    handlePreview(){},

    // 点击不同的tab时
    async tabChange() {
      if (this.active === "2") {
        if (this.selectedOptions.length !== 3) {
          this.$message.warning("请先选择商品的三级分类");
          return;
        }
        // 获取数据
        const res = await this.$http.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=many`
        );
        // console.log(res);
        this.arrDyparams = res.data.data;
        // 分类数据
        this.arrDyparams.forEach(item => {
          // 如果为空就返回空数组 否则把字符串变为数组

          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.trim().split(",");
        });
      }
      if (this.active === "3") {
        if (this.selectedOptions.length !== 3) {
          this.$message.warning("请先选择商品的三级分类");
          return;
        }
        // 获取数据
        const result = await this.$http.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=only`
        );
        // console.log(result);
        this.arrStaticparams = result.data.data;
      }
    },

    // 联级选择器触发的方法
    handleChange() {},

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
.el-alert {
  margin-bottom: 15px;
}
.el-step__title {
  font-size: 12px;
}
.el-steps {
  margin-bottom: 15px;
}
.ql-editor {
  min-height: 200px;
}
</style>