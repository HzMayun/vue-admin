<template>
  <el-card>
    <el-form inline :model="category">
      <el-form-item label="一级分类">
        <el-select
          v-model="category.category1Id"
          placeholder="请选择"
          @change="handleSelectChange1"
          :disabled="disabled"
        >
          <el-option
            v-for="c1 in category1List"
            :key="c1.id"
            :label="c1.name"
            :value="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          v-model="category.category2Id"
          placeholder="请选择"
          @change="handleSelectChange2"
          :disabled="disabled"
        >
          <el-option
            v-for="c2 in category2List"
            :key="c2.id"
            :label="c2.name"
            :value="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          v-model="category.category3Id"
          placeholder="请选择"
          @change="handleSelectChange3"
          :disabled="disabled"
        >
          <el-option
            v-for="c3 in category3List"
            :key="c3.id"
            :label="c3.name"
            :value="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  name: "Category",
  props: ["disabled"],
  data() {
    return {
      category: {
        category1Id: "", // 1级分类id
        category2Id: "",
        category3Id: "",
      },
    };
  },
  computed: {
    ...mapState({
      category1List: (state) => state.category.category1List,
      category2List: (state) => state.category.category2List,
      category3List: (state) => state.category.category3List,
    }),
  },
  methods: {
    ...mapMutations(["category/SET_CATEGORY3_ID"]),
    ...mapActions([
      "category/getCategory1List",
      "category/getCategory2List",
      "category/getCategory3List",
    ]),
    // 处理输入框的change事件
    //选中一级列表，使用category1Id 请求二级列表数据
    async handleSelectChange1(category1Id) {
      // console.log(category1Id); //2
      //清除自己的ID
      this.category.category2Id = "";
      this.category.category3Id = "";
      //category2List 和 category3List 使用的vuex中的数据，在vuex中已经处理过了
      this["category/getCategory2List"](category1Id);
      // // 清空父组件的数据 全局事件总线
      // this.$bus.$emit("clearList");
    },
    //选中二级列表数据，使用category2Id 请求三级数据列表数据
    async handleSelectChange2(category2Id) {
      this.category.category3Id = "";
      this["category/getCategory3List"](category2Id);
      // // 清空父组件的数据   这个在vuex中的actions中已经处理过了，这里就不用再写了
      // this.$bus.$emit("clearList");
    },
    //选中三级列表数据，使用category3Id 请求下面form表单的数据
    async handleSelectChange3(category3Id) {
      this["category/SET_CATEGORY3_ID"](category3Id);
    },
  },
  async mounted() {
    this["category/getCategory1List"](); //获取一级分页列表，这个是一上来就要请求的 所以没有id
    // console.log(111);
    // console.log(this.category1List);
  },
};
</script>

<style>
</style>
