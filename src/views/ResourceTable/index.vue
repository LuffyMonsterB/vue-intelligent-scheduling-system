<template>
  <div>
    <!-- 操作栏 -->
    <el-card style="margin: 30px 30px 10px 30px; border-radius: 10px">
      <el-row type="flex" justify="space-between">
        <el-col>
          <el-button
            class="cu-shadow"
            type="danger"
            icon="el-icon-plus"
            @click="addResourceDialog = true"
            >添加资源</el-button
          >
        </el-col>
        <el-col>
          <el-row type="flex" justify="end">
            <el-button class="cu-shadow" type="success" icon="el-icon-upload2"
              >导入EXCEL</el-button
            >
            <el-button
              class="cu-shadow"
              type="success"
              icon="el-icon-paperclip"
              plain
              >下载模板</el-button
            >
          </el-row>
        </el-col>
      </el-row>
    </el-card>
    <!-- 资源数据表格 -->
    <el-card style="margin: 30px; border-radius: 10px">
      <el-table
        v-loading="listLoading"
        :data="resourceList"
        element-loading-text="Loading"
        border
        stripe
        fit
        highlight-current-row
      >
        <el-table-column align="center" label="资源名称">
          <template slot-scope="scope">
            {{ scope.row.resource_code }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="数量">
          <template slot-scope="scope">
            {{ scope.row.resource_number }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="颜色"
          style="background: #ff0000"
        >
          <template slot-scope="scope">
            <el-tag
              class="cu-shadow"
              :color="scope.row.color"
              effect="plain"
              :hit="false"
              style="color: #000; border-color: rgba(255, 255, 255, 0.1)"
              >{{ scope.row.color.toLowerCase() }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              class="cu-shadow"
              type="info"
              icon="el-icon-edit"
              size="mini"
              circle
              @click="handleEditResourceClick(scope.$index)"
            ></el-button>
            <el-button
              class="cu-shadow"
              type="danger"
              icon="el-icon-delete"
              size="mini"
              circle
              @click="handleDeleteResourceClick(scope.$index)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加资源弹窗 -->
    <el-dialog title="添加资源" :visible.sync="addResourceDialog" width="30%">
      <el-form
        :model="addResourceForm"
        :rules="addResourceFormRules"
        ref="addResourceForm"
        label-position="left"
        label-width="95px"
        style="padding: 30px"
      >  
            <el-form-item label="资源名称" prop="resource_code">
              <el-input
                v-model="addResourceForm.resource_code"
                placeholder="请输入资源名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="资源数量">
            <el-input-number
                v-model="addResourceForm.resource_number"
                :min="1"
                style="width:100%"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="颜色">
              <el-color-picker
                style="width: 100%"
                color-format="hex"
                v-model="addResourceForm.color"
              ></el-color-picker>
            </el-form-item>
      </el-form>
      <span slot="footer" style="display: flex; justify-content: center">
        <el-button
          class="cu-shadow"
          type="danger"
          @click="handleAddResourceDialogSubmit"
          >确 定</el-button
        >
        <el-button class="cu-shadow" @click="addItemDialog = false"
          >取 消</el-button
        >
      </span>
    </el-dialog>
    <!-- 修改资源弹窗 -->
    <el-dialog title="修改资源" :visible.sync="editResourceDialog" width="30%">
      <el-form
        :model="editResourceForm"
        :rules="editResourceFormRules"
        ref="editResourceForm"
        label-position="left"
        label-width="95px"
        style="padding: 30px"
      >
            <el-form-item label="资源名称" prop="resource_code">
              <el-input
                v-model="editResourceForm.resource_code"
                placeholder="请输入资源名称"
              ></el-input>
            </el-form-item>
                        <el-form-item label="资源数量">
              <el-input-number
                v-model="editResourceForm.resource_number"
                :min="1"
                style="width:100%"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="颜色">
              <el-color-picker
                style="width: 100%"
                color-format="hex"
                v-model="editResourceForm.color"
              ></el-color-picker>
            </el-form-item>
      </el-form>
      <span slot="footer" style="display: flex; justify-content: center">
        <el-button
          class="cu-shadow"
          type="danger"
          @click="handleEditResourceDialogSubmit"
          >确 定</el-button
        >
        <el-button class="cu-shadow" @click="editResourceDialog = false"
          >取 消</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getResourceList,addResource,updateResourceById,deleteResourceById } from "@/api/resource";
export default {
  name: "ResourceTable",
  data() {
    return {
      resourceList: [],
      editResourceDialog: false,
      editResourceForm: {},
      editIndex: 0,
      addResourceDialog: false,
      addResourceForm: {
        resource_code: null,
        resource_number: 1,
        color: "#F56C6C",
      },
      addResourceFormRules: {
        resource_code: [
          { required: true, message: "请输入资源名称", trigger: "blur" },
          { min: 1, max: 16, message: "长度在 1 到 16 个字符", trigger: "blur" },
        ]
      },
      editResourceFormRules: {
        name: [
          { min: 0, max: 8, message: "长度在 0 到 8 个字符", trigger: "blur" },
        ],
      },
      listLoading: false,
    };
  },
  computed: {
    resourceGroupList() {
      return this.resourceList.filter((item) => {
        return item.isGroup == "Yes";
      });
    },
    resourceMemberList() {
      return this.resourceList.filter((item) => {
        return item.isGroup == "No" && !item.group;
      });
    },
  },
  created() {
    this.listLoading = true;
    getResourceList().then((res) => {
      this.resourceList = res.data.resource_infos;
      this.listLoading = false;
    });
  },
  methods: {
    handleAddResourceDialogSubmit() {
      if (this.checkForm("addResourceForm")) {
        addResource(this.addResourceForm).then(res=>{
          if(res.code=='200'){
            this.$message({ message: "添加资源成功", type: "success" });
            getResourceList().then((res) => {
              this.resourceList = res.data.resource_infos;
              this.addResourceDialog = false;
        });
          }
        })
      }
    },
    handleEditResourceClick(index) {
      this.editIndex = index;
      this.editResourceForm = { ...this.resourceList[index] };
      this.editResourceDialog = true;
    },
    handleDeleteResourceClick(index) {
      this.$confirm("确定删除资源？", "删除资源警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let id = this.resourceList[index].id;
        deleteResourceById(id).then(res=>{
          if(res.code=='200'){
            this.$message({ message: "删除资源成功", type: "warning" });
            getResourceList().then(res => {
            if(res.code=='200'){
              this.resourceList = res.data.resource_infos;
            }
            })
          } 
        })
      });
    },
    handleEditResourceDialogSubmit() {
      if (this.checkForm("editResourceForm")) {
        updateResourceById(this.editResourceForm).then(res=>{
          if(res.code=='200'){
            this.$message({ message: "修改资源成功", type: "success" });
          }
          getResourceList().then(res => {
            if(res.code=='200'){
              this.resourceList = res.data.resource_infos;
              this.editResourceDialog = false;
            }
            })
        })
      }
    },
    checkForm(formName) {
      let flag = false;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          flag = true;
        } else {
          this.$message({ message: "请正确填写内容", type: "error" });
          return false;
        }
      });
      return flag;
    },
  },
};
</script>

<style></style>
