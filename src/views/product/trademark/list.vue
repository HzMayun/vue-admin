<template>
  <div>
    <!-- 按钮 -->
    <el-button type="primary" class="el-icon-plus" round>主要按钮</el-button>
    <!-- 表单 -->
    <el-table :data="tradeLists" border style="width: 100%; margin: 20px 0">
      <el-table-column
        type="index"
        prop="index"
        label="序号"
        width="180"
        align="center"
      >
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="180">
      </el-table-column>
      <el-table-column label="品牌logo" width="180">
        <template slot-scope="scope">
          <img style="width: 100px; height: 50px" :src="scope.row.logoUrl" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template></el-table-column
      >
    </el-table>
    <el-pagination
      class="trademark-pagination"
      @size-change="getTrademarkList(page, $event)"
      @current-change="getTrademarkList($event, limit)"
      :page-sizes="[3, 6, 9]"
      :page-size.sync="limit"
      :current-page="page"
      layout="prev, pager, next, jumper, sizes, total"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "TrademarkList",
  data() {
    return {
      tradeLists: [],
      total: 0,
      page: 1, //页码
      limit: 3, //每页条数
      visible: false, // 对话框显示&隐藏
    };
  },
  methods: {
    //获取列表数据 的封装
    async getTrademarkList(page, limit) {
      const result = await this.$API.tradeMark.getPageList(page, limit);
      console.log(page, limit);
      if (result.code === 200) {
        this.$message.success("获取品牌分页列表成功");
        this.tradeLists = result.data.records;
        this.total = result.data.total; //总数等于获取到的总数
        this.limit = result.data.size; // 代表每页显示的条数
        this.page = result.data.current; //默认页码也根据获取的数据来修改
      } else {
        this.$message.error("获取品牌分页列表失败");
      }
    },
  },
  mounted() {
    //发送请求，获得列表数据
    this.getTrademarkList(this.page, this.limit);
  },
};
</script>

<style lang="sass" scoped>
.trademark-pagination
  text-align: right
  width: 100%
>>> .el-pagination__sizes
  margin-left: 27%
</style>
