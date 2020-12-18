import * as API from '@/api'
import { Message } from "element-ui"

export default {
  namespaced: true,
  state: {
    category: {
      category1Id: "",
      category2Id: "",
      category3Id: "",
    },
    category1List: [],
    category2List: [],
    category3List: [],

  },
  actions: {
    //获取一级分页列表，这个是一上来就要请求的 所以没有id
    async getCategory1List({ commit }) {
      const result = await API.attrs.getCategorys1();
      if (result.code === 200) {
        // console.log("请求成功了", result.data);
        commit('GET_CATEGORY1_LIST', result.data)
      } else {
        this.$message.error(result.message);
      }
    },
    //选择一级分页列表后，获取二级分页列表，
    async getCategory2List({ commit }, category1Id) {

      const result = await API.attrs.getCategorys2(category1Id);
      if (result.code === 200) {
        commit('GET_CATEGORY2_LIST_SUCCESS', { category1Id, category2List: result.data })
      } else {
        commit('GET_CATEGORY2_LIST_ERROR', category1Id)
        this.$message.error(result.message);
      }
    },
    //选择二级分页列表后，获取三级分页列表，
    async getCategory3List({ commit }, category2Id) {
      const result = await API.attrs.getCategorys3(category2Id);
      if (result.code === 200) {
        commit('GET_CATEGORY3_LIST_SUCCESS', { category2Id, category3List: result.data })
      } else {
        commit('GET_CATEGORY3_LIST_ERROR', category1Id)
        this.$message.error(result.message);
      }
    },

  },
  mutations: {
    //一级分页列表处理函数
    GET_CATEGORY1_LIST(state, category1List) {
      //赋值 ，此时一级分页列表数据展示完成，但是还没选择
      state.category1List = category1List
    },
    //二级分页列表处理函数(成功)
    GET_CATEGORY2_LIST_SUCCESS(state, { category2List, category1Id }) {
      //赋值 ，此时一级分页列表数据展示完成，但是还没选择
      //修改列表和id

      state.category2List = category2List;
      state.category.category1Id = category1Id;

      // 当一级列表选中时，清空三级数据和一级、二级ID
      state.category3List = [];
      state.category2Id = "";
      state.category3Id = "";
    },
    //二级分页列表处理函数(失败)
    GET_CATEGORY2_LIST_ERROR(state, category1Id) {
      state.category.category1Id = category1Id;

      state.category.category2Id = "";
      state.category.category3Id = "";
      state.category2List = [];
      state.category3List = [];
    },
    //三级分页列表处理函数（成功）
    GET_CATEGORY3_LIST_SUCCESS(state, { category2Id, category3List }) {
      state.category.category2Id = category2Id  //2 ID 赋值
      state.category3List = category3List
      state.category.category3Id = "";

    },
    //三级分页列表处理函数（失败）
    GET_CATEGORY3_LIST_ERROR(state, category2Id) {
      state.category.category2Id = category2Id  //2 ID 赋值
      state.category3List = []
      state.category.category3Id = "";
    },
    SET_CATEGORY3_ID(state, category3Id) {    //处理3级ID 的数值
      state.category.category3Id = category3Id
      // console.log(category3Id); //61
    },
    //清除所有的id的数据列表
    DEL_ALL_DATA(state) {
      state.category1List = [];
      state.category3List = [];
      state.category2List = [];
      state.category.category1Id = "";
      state.category.category2Id = "";
      state.category.category3Id = "";
    }
  },

}
