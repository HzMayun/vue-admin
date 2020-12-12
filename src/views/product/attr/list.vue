<template>
  <div>
    <!-- 卡片1 -->
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
    <!-- 卡片2 -->
    <el-card>
      <el-button type="primary" class="el-icon-plus">添加属性</el-button>
      <el-table :data="attrList" border style="width: 100%; margin: 20px 0">
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
        <el-table-column label="操作" width="180">
          <template v-slot="{ row }">
            <el-button size="mini" @click="update(row)">修改</el-button>
            <el-button size="mini" type="danger" @click="DelPageList(row.id)"
              >删除</el-button
            >
          </template></el-table-column
        >
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "AttrList",
  data() {
    return {
      category: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
      attrList: [],
    };
  },
};
</script>
