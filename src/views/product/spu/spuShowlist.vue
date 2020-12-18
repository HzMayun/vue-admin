<template>
  <div>
    <el-card style="margin-top: 20px">
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="$emit('showUpdateList', { category3Id: category.category3Id })"
        :disabled="!category.category3Id"
        >添加SPU</el-button
      >
      <el-table
        :data="spuList"
        v-loading="loading"
        border
        style="width: 100%; margin: 20px 0"
      >
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>
        <el-table-column prop="spuName" label="SPU名称"> </el-table-column>

        <el-table-column prop="description" label="SPU描述"> </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="$emit('showSkuList', row)"
            ></el-button>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="$emit('showUpdateList', row)"
            ></el-button>
            <el-button type="info" icon="el-icon-info" size="mini"></el-button>
            <el-popconfirm
              @onConfirm="delSpuList(row.id)"
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
    </el-card>
    <!-- 分页器 -->
    <el-pagination
      class="trademark-pagination"
      @size-change="getPageList(page, $event)"
      @current-change="getPageList($event, limit)"
      :page-sizes="[6, 9, 12]"
      :page-size.sync="limit"
      :current-page="page"
      layout="prev, pager, next, jumper, sizes, total"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "SpuShowlist",
  data() {
    return {
      page: 1,
      limit: 6,
      total: 0,
      // category: {
      //   category1Id: "",
      //   category2Id: "",
      //   category3Id: "",
      // },
      spuList: [],
      loading: false,
    };
  },
  computed: {
    ...mapState({
      category: (state) => state.category.category,
    }),
  },
  watch: {
    "category.category3Id": {
      handler(category3Id) {
        console.log(category3Id);
        if (!category3Id) return;
        this.getPageList(this.page, this.limit);
      },
      immediate: true, // 一上来触发一次
    },
    "category.category1Id"() {
      this.clearList();
    },
    "category.category2Id"() {
      this.clearList();
    },
  },
  methods: {
    ...mapMutations(["category/DEL_ALL_DATA"]),
    //点击删除spuList的一个数据
    async delSpuList(id) {
      this.spuList = this.spuList.filter((item) => item.id !== id); //根据id取去除点击的元素
      //发送请求
      const result = await this.$API.spu.deleteSpu(id);
      if (result.code === 200) {
        this.$message.success("删除SPU分页列表成功~");
        //重新发送分页请求
        this.$bus.$on("change", this.handleCategoryChange);
      }
    },

    // 封装一个请求SPU分页列表的函数
    async getPageList(page, limit) {
      this.loading = true;
      const { category3Id } = this.category;
      const result = await this.$API.spu.getSpuList({
        page,
        limit,
        category3Id,
      });
      if (result.code === 200) {
        this.$message.success("获取SPU分页列表成功~");
        this.spuList = result.data.records;
        this.total = result.data.total;
      } else {
        this.$message.error(result.message);
      }
      this.loading = false;
    },
    // // 处理category的change（当选中三级分类时触发）
    // handleCategoryChange(category) {
    //   // 触发事件，会将分类id传递过来
    //   this.category = category;
    //   //发送请求（这里是封装的函数）
    //   this.getPageList(this.page, this.limit);
    // },
    //点击切换category后，清空数据
    //当选中1级或2级分类触发
    clearList() {
      this.spuList = [];
      this.page = 1;
      this.limit = 6;
      this.total = 0;
      this.category.category3Id = "";
    },

    //
  },
};
</script>

<style>
</style>
