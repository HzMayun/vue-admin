import request from '@/utils/request'


const api_name = '/admin/product/baseTrademark'

export default {
  /*
  获取订单分页列表(带搜索)
  */
  getPageList(page, limit) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'GET',
    })
  },
  //新增品牌
  addPageList(data) {
    return request({
      url: `${api_name}/save`,
      method: 'POST',
      data
    })
  },
  //删除品牌
  RemovePageList(id) {
    return request({
      url: `${api_name}/remove/${id}`,
      method: 'DELETE',
    })
  },

}
