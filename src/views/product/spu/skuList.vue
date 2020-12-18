<template>
  <div>
    <el-card style="margin-top: 20px">
      <el-form label-width="100px">
        <el-form-item label="SPU 名称">
          <span>{{ spu.spuName }}</span></el-form-item
        >
        <el-form-item label="SKU 名称">
          <el-input placeholder="SKU 名称" v-model="sku.skuName"></el-input>
        </el-form-item>
        <el-form-item label="价格(元)">
          <el-input-number
            placeholder="SKU价格"
            controls-position="right"
            :min="0"
            v-model="sku.price"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="重量(千克)">
          <el-input-number
            controls-position="right"
            :min="0"
            placeholder="SKU 重量"
            v-model="sku.weight"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="规格描述">
          <el-input
            type="textarea"
            placeholder="请输入SKU描述"
            v-model="sku.skuDesc"
          ></el-input>
        </el-form-item>
        <el-form-item label="平台属性">
          <div
            v-for="(attr, index) in attrList"
            :key="attr.id"
            class="skulist-select-container"
          >
            <el-form-item :label="attr.attrName">
              <el-select
                placeholder="请输入"
                v-model="sku.attrIdValueId[index]"
              >
                <el-option
                  v-for="attrValue in attr.attrValueList"
                  :key="attrValue.id"
                  :label="attrValue.valueName"
                  :value="`${attrValue.attrId}-${attrValue.id}`"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item label="销售属性">
          <div
            v-for="(sale, index) in spuSaleAttrList"
            :key="sale.id"
            class="skulist-select-container"
          >
            <el-form-item :label="sale.saleAttrName">
              <el-select
                placeholder="请输入"
                v-model="sku.skuSaleAttrValueList[index]"
              >
                <el-option
                  v-for="saleValue in sale.spuSaleAttrValueList"
                  :key="saleValue.id"
                  :label="saleValue.saleAttrValueName"
                  :value="`${saleValue.spuId}-${saleValue.id}`"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item label="图片列表">
          <el-table
            tooltip-effect="dark"
            style="width: 100%"
            border
            :data="imageList"
            row-key="id"
          >
            <el-table-column type="selection" reserve-selection width="55">
            </el-table-column>
            <el-table-column label="图片">
              <template slot-scope="scope"
                ><img
                  style="width: 200px; height: 100px"
                  :src="scope.row.imgUrl"
                  :alt="scope.row.imgName"
              /></template>
            </el-table-column>
            <el-table-column prop="imgName" label="名称"> </el-table-column>
            <el-table-column label="操作">
              <template>
                <el-button type="primary" size="mini">设为默认</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">保存</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "SkuList",
  props: {
    skuItem: Object,
  },
  computed: {
    ...mapState({
      category: (state) => state.category.category,
    }),
  },
  data() {
    return {
      spu: this.skuItem,
      num: 0,
      imageList: [], //图片列表
      spuSaleAttrList: [], //销售属性列表
      attrList: [], //平台属性列表
      sku: {
        attrIdValueId: [], //拼接平台属性id
        skuSaleAttrValueList: [], //拼接销售列表的id
      },
    };
  },
  methods: {
    async getSpuImageList() {
      const { id } = this.spu;
      const result = await this.$API.spu.getSpuImageList(id);
      if (result.code === 200) {
        this.$message.success("请求图片属性成功！");
        this.imageList = result.data;
      } else {
        this.$message.error(new Error(result.message));
      }
    },
    async getSpuSaleAttrList() {
      const { id } = this.spu;
      const result = await this.$API.spu.getSpuSaleAttrList(id);
      if (result.code === 200) {
        this.$message.success("请求销售属性成功！");
        this.spuSaleAttrList = result.data;
        console.log(this.attrList);
      } else {
        this.$message.error(new Error(result.message));
      }
    },
    async getAttrList() {
      const result = await this.$API.attrs.getAttrList(this.category);
      if (result.code === 200) {
        this.$message.success("请求平台属性成功！");
        this.attrList = result.data;
      } else {
        this.$message.error(new Error(result.message));
      }
    },
  },
  mounted() {
    this.getSpuImageList(); //获取所有的图片数据
    this.getAttrList(); //平台属性列表
    this.getSpuSaleAttrList(); //销售属性列表
  },
};
</script>
