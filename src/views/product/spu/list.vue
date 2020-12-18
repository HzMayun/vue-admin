<template>
  <div>
    <!--
      @change 当三级分类修改的时候触发。得到所有分类id
      @clearList 当1级分类和2级分类触发的时候触发，清空列表
      :disabled 决定select是否可以使用
     -->
    <SkuList v-if="isSkuShow" :skuItem="skuItem"></SkuList>
    <div v-else>
      <Category :disabled="!isShowList" />
      <SpuShowlist
        v-if="isShowList"
        @showUpdateList="showUpdateList"
        @showSkuList="showSkuList"
      />
      <SpuUpdateList v-else :item="item" @showList="showList" />
    </div>
  </div>
</template>

<script>
import Category from "@/components/Category";
import SpuShowlist from "./spuShowlist";
import SpuUpdateList from "./spuUpdateList";
import SkuList from "./skuList";
import { createNamespacedHelpers } from "vuex";

export default {
  name: "SpuList",
  data() {
    return {
      isShowList: true,
      item: {},
      isSkuShow: false,
      skuItem: {},
    };
  },
  components: {
    Category,
    SpuShowlist,
    SpuUpdateList,
    SkuList,
  },
  methods: {
    //修改
    showUpdateList(row) {
      this.isShowList = false;
      this.item = { ...row };
    },

    showSkuList(row) {
      this.isSkuShow = true;
      this.skuItem = { ...row };
    },
    showList(category3Id) {
      this.isShowList = true; //这个事件触发后，页面就会跳转到spuShowList ,这时候要重新发送一边请求
      this.$nextTick(() => {
        //这里是为了是spuShowList 组件加载完毕，然后在触发全局事件总线事件
        this.$bus.$emit("change", { category3Id });
        //全局事件总线 ，定义在spuShowList中，handleCategoryChange，用来发送请求，获取表单数据的
        //参数是分级列表的3级id
      });
    },
  },
  beforeDestroy() {
    this.$store.commit("category/DEL_ALL_DATA");
  },
};
</script>
