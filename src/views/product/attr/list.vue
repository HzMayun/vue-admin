<template>
  <div>
    <Category />
    <!-- 卡片1 -->

    <!-- 卡片2 -->
    <el-card>
      <el-button type="primary" class="el-icon-plus">添加属性</el-button>
      <el-table
        :data="attrCategory1List"
        border
        style="width: 100%; margin: 20px 0"
      >
        <el-table-column
          type="index"
          prop="index"
          label="序号"
          width="80"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="tmName" label="属性名称" width="180">
        </el-table-column>
        <el-table-column label="属性值列表">
          <template slot-scope="scope">
            <img style="width: 100px; height: 50px" :src="scope.row.logoUrl" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180"> </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import Category from "./Category";
export default {
  name: "AttrList",
  components: {
    Category,
  },
  data() {
    return {
      attrCategory1List: [],
    };
  },
  mounted() {
    // const result = this.$API.attrs.getCategory1List();
    // if (result.code === 200) {
    //   this.$message.success("获取1级分类列表成功");
    //   // this.category = result.id;
    //   console.log(result);
    // } else {
    //   this.$message.error(result.message);
    // }
  },
};
</script>
