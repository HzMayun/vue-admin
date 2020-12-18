<template>
  <div>
    <el-card style="margin-top: 20px">
      <!--
      表单校验：
        1. 整体form表单中
        2. 通过prop属性来定义表单项名称
        3. 定义表单校验规则
          - 在data中定义rules
          - 绑定给form
        4. 校验表单
          - 给form绑定ref
          - this.$refs.spuForm.validate 校验表单
     -->

      <el-form label-width="80px" :model="spu" :rules="rules" ref="spuForm">
        <el-form-item label="SPU名称" prop="spuName">
          <el-input
            placeholder="请输入SPU名称"
            v-model="spu.spuName"
          ></el-input>
        </el-form-item>
        <el-form-item label="SPU品牌" prop="tmId">
          <el-select placeholder="请选择品牌" v-model="spu.tmId">
            <el-option
              v-for="tm in trademarkList"
              :key="tm.id"
              :label="tm.tmName"
              :value="tm.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="SPU描述" prop="description">
          <el-input
            type="textarea"
            placeholder="请输入SPU描述"
            v-model="spu.description"
          ></el-input>
        </el-form-item>
        <el-form-item label="SPU图片" prop="imageList">
          <el-upload
            class="avatar-uploader"
            list-type="picture-card"
            :file-list="ImageList"
            :action="`${$BASE_API}/admin/product/fileUpload`"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleAvatarSuccess"
          >
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span>只能上传jpg/png文件，且不超过50kb</span>
        </el-form-item>
        <el-form-item label="销售属性" prop="sale">
          <el-select
            :placeholder="`还剩${filterSaleAttrList.length}个未选择`"
            v-model="spu.sale"
          >
            <el-option
              v-for="sale in filterSaleAttrList"
              :label="sale.name"
              :value="`${sale.id}-${sale.name}`"
              :key="sale.id"
            ></el-option>
          </el-select>
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="addSpuSaleAttr"
            :disabled="!spu.sale"
            >添加销售属性</el-button
          >
          <el-table
            border
            :data="spuSaleAttrList"
            style="width: 100%; margin: 20px 0"
          >
            <el-table-column
              type="index"
              label="序号"
              width="80"
              align="center"
            >
            </el-table-column>
            <el-table-column prop="saleAttrName" label="属性名称" width="150">
            </el-table-column>
            <el-table-column label="属性值列表">
              <template v-slot="{ row }">
                <el-tag
                  style="margin-right: 5px"
                  @close="delTag(index, row)"
                  closable
                  v-for="(attrVal, index) in row.spuSaleAttrValueList"
                  :key="attrVal.id"
                  >{{ attrVal.saleAttrValueName }}</el-tag
                >
                <el-input
                  v-if="row.edit"
                  size="mini"
                  style="width: 100px"
                  @blur="editCompleted(row)"
                  @keyup.enter.native="editCompleted(row)"
                  autofocus
                  ref="input"
                  v-model="saleAttrValueText"
                >
                </el-input
                ><el-button
                  v-else
                  icon="el-icon-plus"
                  size="mini"
                  @click="edit(row)"
                  >添加</el-button
                >
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template v-slot="{ row, $index }">
                <el-popconfirm
                  @onConfirm="delSpuSaleAttr($index)"
                  :title="`确定要删除&quot;${row.saleAttrName}&quot;吗？`"
                  ><el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    slot="reference"
                  ></el-button
                ></el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="save">保存</el-button>
          <el-button @click="$emit('showList')"> 取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { category } from "@/api";
export default {
  name: "SpuUpdateList",
  props: {
    item: Object,
  },
  data() {
    return {
      spu: this.item,
      trademarkList: [], // 所有品牌数据
      spuImageList: [], // 所有图片列表
      previewImgUrl: "", // 图片地址
      visible: false, // 图片对话框显示&隐藏
      saleAttrList: [], // 所有销售属性列表
      spuSaleAttrList: [], // 当前SPU销售属性列表
      saleAttrValueText: "",
      //表单验证规则
      rules: {
        spuName: [{ required: true, message: "请输入SPU名称~" }],
        tmId: [{ required: true, message: "请选择品牌~" }],
        description: [{ required: true, message: "请输入SPU描述~" }],
        imageList: [{ required: true, validator: this.imageListValidator }],
        sale: [{ required: true, validator: this.saletValidator }],
      },
    };
  },
  computed: {
    ...mapState({
      category: (state) => state.category.category,
    }),
    //计算属性来生成一个新的spuImageList ，elemnt UI  必须使用 {name：xxx,url :xxx}
    //但是数据库发送请求，又要使用{imgName：xxx,imgUrl :xxx},这个是 返回来的图片数据的格式
    ImageList() {
      return this.spuImageList.map((img) => {
        return {
          uid: img.uid || img.id,
          name: img.imgName,
          url: img.imgUrl,
        };
      });
    },

    filterSaleAttrList() {
      return this.saleAttrList.filter((sale) => {
        // this.spuSaleAttrList.indexOf() // 只适用于数组中是基本类型
        // 找到了返回{}  没有找到返回undefined
        return !this.spuSaleAttrList.find(
          (spuSale) => spuSale.baseSaleAttrId === sale.id
        ); // 适用于数组中是引用类型
      });
    },
  },
  methods: {
    //表单验证自定义函数
    imageListValidator(rule, value, callback) {
      if (this.spuImageList.length > 0) {
        callback(); //验证通过 、、图片列表长度不等于0
        return;
      }
      //校验失败
      callback(new Error("请上传至少一张图片~"));
    },
    saletValidator(rule, value, callback) {
      //判断至少有一个销售属性
      if (this.spuSaleAttrList.length === 0) {
        callback(new Error("请至少选择一个销售属性~"));
        return;
      }
      // 判断销售属性中至少有一个属性值
      const isNotOk = this.spuSaleAttrList.some(
        (sale) => sale.spuSaleAttrValueList.length === 0
      );
      if (isNotOk) {
        callback(new Error("请至少添加一个销售属性值~"));
        return;
      }
      callback(); //最后检验成功
    },
    //提交LOGO成功的回调，将背景图换成上传的
    handleAvatarSuccess(res, file) {
      // console.log(res, file);
      this.spuImageList.push({
        uid: file.uid,
        imgName: file.name,
        imgUrl: res.data,
        spuId: this.spu.id,
      });
      console.log(this.spuImageList);
    },
    // 处理删除
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.spuImageList = this.spuImageList.filter(
        (img) => img.imgUrl !== file.url
      );
    },
    // 处理图片预览
    handlePictureCardPreview(file) {
      this.previewImgUrl = file.url;
      this.visible = true;
    },
    // 获取所有品牌数据
    async getTrademarkList() {
      const result = await this.$API.spu.getTrademarkList();
      if (result.code === 200) {
        this.$message.success("获取所有品牌成功~");
        this.trademarkList = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
    // 获取所有图片数据
    async getSpuImageList() {
      const { id } = this.spu;
      const result = await this.$API.spu.getSpuImageList(id);
      if (result.code === 200) {
        this.$message.success("获取所有图片成功~");
        this.spuImageList = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
    // 获取所有销售属性列表
    async getSaleAttrList() {
      const result = await this.$API.spu.getSaleAttrList();
      if (result.code === 200) {
        this.$message.success("获取所有销售属性列表成功~");
        // 处理数据
        this.saleAttrList = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
    // 获取SPU销售属性列表
    async getSpuSaleAttrList() {
      const { id } = this.spu;
      const result = await this.$API.spu.getSpuSaleAttrList(id);
      if (result.code === 200) {
        this.$message.success("获取SPU销售属性列表成功~");
        // 处理数据
        this.spuSaleAttrList = result.data;
        console.log("spuSaleAttrList", result);
      } else {
        this.$message.error(result.message);
      }
    },
    //添加销售属性
    addSpuSaleAttr() {
      //选中的销售属性

      const { sale, id } = this.spu;
      const [baseSaleAttrId, saleAttrName] = sale.split("-");

      //将销售属性添加到商品中
      /*
      props ： spu = item
      item:Object
          category3Id:61
          description:"123"
          id:2247
          spuImageList:null
          spuName:"尼古拉斯赵四"
          spuSaleAttrList:null
          tmId:246
       */
      this.spuSaleAttrList.push({
        baseSaleAttrId: +baseSaleAttrId, //所有销售属性的id
        saleAttrName, //所有销售属性名称
        spuId: id, //spu的id
        spuSaleAttrValueList: [], //销售值属性的列表
      });
      console.log(this.spuSaleAttrList);
      // 清空选中的销售属性id
      this.spu.sale = "";
    },
    //添加单个销售属性值，自动获取焦点
    edit(row) {
      this.$set(row, "edit", true);
      this.$nextTick(() => {
        this.$refs.input.focus(); //自动激获取焦点
      });
    },
    //添加销售属性值
    editCompleted(row) {
      if (this.saleAttrValueText) {
        row.spuSaleAttrValueList.push({
          baseSaleAttrId: row.baseSaleAttrId,
          saleAttrName: row.saleAttrName,
          saleAttrValueName: this.saleAttrValueText,
          spuId: row.spuId,
        });
        // 添加完成数据清空
        this.saleAttrValueText = "";
      }
      row.edit = false;
    },
    //删除单个销售属性值
    delTag(index, row) {
      row.spuSaleAttrValueList.splice(index, 1);
    },
    //删除整个销售属性
    delSpuSaleAttr(index) {
      this.spuSaleAttrList.splice(index, 1);
    },
    //保存
    save() {
      this.$refs.spuForm.validate(async (valid) => {
        if (valid) {
          console.log("表单验证通过");
          const spu = {
            ...this.spu,
            category3Id: this.category.category3Id,
            spuImageList: this.spuImageList,
            spuSaleAttrList: this.spuSaleAttrList,
          };
          let result;
          //获取spu后，发送请求
          if (this.spu.id) {
            result = await this.$API.spu.updateSpu(spu);
          } else {
            result = await this.$API.spu.saveSpu(spu);
          }

          if (result.code === 200) {
            this.$message.success(
              this.spu.id ? "更新 spu成功" : "保存spu成功过"
            );
            //成功保存后，触发自定义事件，把isShowList设置为true，跳转到spuShowList界面
            this.$emit("showList");
          } else {
            this.$message.error(error.message);
          }
          this.$message.success("保存spu成功");
        }
      });
      /*
        {
          1、发送请求的参数 ：
            "category3Id": 0,          //三级分类ID
            "description": "string",   // 描述
            "id": 0,                   //  id   spu里面的  item传递过来的
            "spuImageList": [          //spu图片列表
              {
                "id": 0,
                "imgName": "string",
                "imgUrl": "string",
                "spuId": 0
              }
            ],
            "spuName": "string",       //spu名
            "spuSaleAttrList": [      //spu 属性列表
              {
                "baseSaleAttrId": 0,
                "id": 0,
                "saleAttrName": "string",
                "spuId": 0,
                "spuSaleAttrValueList": [
                  {
                    "baseSaleAttrId": 0,
                    "id": 0,
                    "isChecked": "string",
                    "saleAttrName": "string",
                    "saleAttrValueName": "string",
                    "spuId": 0
                  }
                ]
              }
            ],
            "tmId": 0          // tmId
          }
      */
      /*
     spu 结构的结果·
      {
        category3Id: 61
        description: "迪迦1111"
        id: 210
        spuImageList: null      //这两项数据还没有 ，需要从本组件中获取
        spuName: "迪迦！"
        spuSaleAttrList: null
        tmId: 253
      }
     */
    },
  },

  mounted() {
    this.getSaleAttrList(); // 获取所有销售属性列表
    this.getTrademarkList(); // 获取所有品牌数据
    if (this.spu.id) {
      this.getSpuImageList(); // 获取所有图片数据
      this.getSpuSaleAttrList(); // 获取SPU销售属性列表
    }
  },
};
</script>

<style>
</style>
