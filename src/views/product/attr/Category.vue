<template>
  <el-card>
    <el-form inline :model="category">
      <el-form-item label="一级分类">
        <el-select v-model="category.category1Id" placeholder="请选择">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="shanghai"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select v-model="category.category2Id" placeholder="请选择">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="shanghai"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select v-model="category.category3Id" placeholder="请选择">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="shanghai"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: "Category",
  data() {
    return {
      category: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
      attrCategory1List: [],
      attrCategory2List: [],
      attrCategory3List: [],
    };
  },
  async mounted() {
    const result = await this.$API.attrs.getCategory1List();
    console.log(result);
    if (result.code === 200) {
      this.$message.success("获取1级分类列表成功");
      this.attrCategory1List = result.data;
      console.log(result);
    } else {
      this.$message.error(result.message);
    }
  },
};
</script>

<style>
</style>
