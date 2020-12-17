<template>
  <div>
    <el-card style="margin-top: 20px">
      <el-form label-width="100px">
        <el-form-item label="SPU 名称"> </el-form-item>
        <el-form-item label="SKU 名称">
          <el-input placeholder="SKU 名称"></el-input>
        </el-form-item>
        <el-form-item label="价格(元)">
          <el-input-number
            placeholder="SKU价格"
            controls-position="right"
            :min="0"
            v-model="num"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="重量(千克)">
          <el-input-number
            controls-position="right"
            :min="0"
            placeholder="SKU 重量"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="规格描述">
          <el-input type="textarea" placeholder="请输入SKU描述"></el-input>
        </el-form-item>
        <el-form-item label="平台属性">
          <div>
            <span>123123</span>
            <el-select placeholder="请选择">
              <el-option></el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="销售属性">
          <div>
            <span>123123</span>
            <el-select placeholder="请选择">
              <el-option></el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="图片列表">
          <el-table tooltip-effect="dark" style="width: 100%" border>
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column label="图片">
              <template slot-scope="scope"
                ><img :src="scope.row.imgUrl" :alt="scope.row.imgName"
              /></template>
            </el-table-column>
            <el-table-column prop="imgName" label="名称"> </el-table-column>
            <el-table-column label="操作">
              <template>
                <el-button type="primary" size="mini">设为默认</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">保存</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "SkuList",
  data() {
    return {
      num: 0,
    };
  },
};
</script>
