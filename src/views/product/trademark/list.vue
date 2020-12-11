<template>
  <div>
    <!-- 按钮 -->
    <el-button type="primary" class="el-icon-plus" @click="visible = true"
      >添加品牌</el-button
    >
    <!-- 点击添加按钮，显示出对话框 -->
    <el-dialog :visible.sync="visible" title="添加品牌">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <!-- 品牌名称 -->
        <el-form-item label="品牌名称" prop="tmName">
          <el-input v-model="form.tmName"></el-input>
        </el-form-item>
        <!-- 添加品牌、上传logo -->
        <el-form-item label="品牌LOGO" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            :action="`${$BASE_API}/admin/product/fileUpload`"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="form.logoUrl" :src="form.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm()">确 定</el-button>
      </div>
    </el-dialog>

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
    <!-- 分页器 -->
    <!--
      :page-size.sync="limit"   可以让limit更新变成同步更新
      :current-page.sync="page" 可以让page更新变成同步更新

      $event
        1.  在DOM事件中代表 event
        <button @click="handle(123, $event)"></button>
        触发事件是浏览器的行为，所以$event代表event

        2. 在自定义事件中代表 第一个参数
          <button @aaa="handle($event)"></button>
          假设这样触发自定义事件： this.$emit('aaa', 123, 456);
          那么$event就为123（第一个参数）
    -->
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
      form: {
        tmName: "",
        logoUrl: "",
      },
      rules: {
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
        ],
        logoUrl: [{ required: true, message: "请提交品牌logo图片" }],
      },
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
    //提交之前先验证
    beforeAvatarUpload(file) {
      const imgType = ["image/jpeg", "image/png", "image/jpg"];
      const isVail = imgType.indexOf(file.type) > -1;
      const isLt = file.size / 1024 < 50;

      if (!isVail) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt) {
        this.$message.error("上传头像图片大小不能超过 50KB!");
      }
      return isVail && isLt;
    },
    //提交LOGO成功的回调，将背景图换成上传的
    handleAvatarSuccess(res) {
      this.form.logoUrl = res.data;
      console.log(this.form.logoUrl);
    },
    //提交表单
    submitForm() {
      this.$refs["form"].validate(async (valid) => {
        if (valid) {
          this.$message.success("添加品牌成功");
          const { tmName, logoUrl } = this.form;
          console.log(tmName, logoUrl);
          //发送添加项目的请求
          await this.$API.tradeMark.addPageList({ tmName, logoUrl });
          this.visible = false; //隐藏会话框
        } else {
          this.$message.error("添加品牌失败 ");
        }
      });
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

>>>.avatar-uploader .el-upload
  border: 1px dashed #d9d9d9
  border-radius: 6px
  cursor: pointer
  position: relative
  overflow: hidden
  &:hover
    border-color: #409EFF

.avatar-uploader-icon
  font-size: 28px
  color: #8c939d
  width: 178px
  height: 178px
  line-height: 178px
  text-align: center

.avatar
  width: 178px
  height: 178px
  display: block
</style>
