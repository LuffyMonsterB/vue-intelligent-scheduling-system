<template>
  <div>
    <!-- 操作栏 -->
    <el-card style="margin: 30px 30px 10px 30px; border-radius: 10px">
      <el-row type="flex" justify="space-between">
        <el-col>
          <el-button
            class="cu-shadow"
            type="warning"
            icon="el-icon-plus"
            @click="addItemDialog = true"
            >添加品目</el-button
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
    <!-- 品目数据表格 -->
    <el-card style="margin: 30px; border-radius: 10px">
      <el-table
        v-loading="listLoading"
        :data="itemList"
        element-loading-text="Loading"
        border
        stripe
        fit
        highlight-current-row
      >
        <el-table-column align="center" label="品目名称">
          <template slot-scope="scope">
            {{ scope.row.item_name }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="类型">
          <template slot-scope="scope">
            {{ scope.row.item_type }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="数量">
          <template slot-scope="scope">
            {{ scope.row.number }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="组标志">
          <template slot-scope="scope">
            {{ scope.row.group_flag == 0 ? "No" : "Yes" }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="所属组">
          <template slot-scope="scope">
            {{ scope.row.group_belong }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="组成员">
          <template slot-scope="scope">
            {{ scope.row.group_member ? scope.row.group_member : "" }}
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
              @click="handleEditItemClick(scope.$index)"
            ></el-button>
            <el-button
              class="cu-shadow"
              type="danger"
              icon="el-icon-delete"
              size="mini"
              circle
              @click="handleDeleteItemClick(scope.$index)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加品目弹窗 -->
    <el-dialog title="添加品目" :visible.sync="addItemDialog" width="60%">
      <el-form
        :model="addItemForm"
        :rules="addItemFormRules"
        ref="addItemForm"
        label-position="left"
        label-width="95px"
        style="padding: 30px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="品目名称" prop="item_name">
              <el-input
                v-model="addItemForm.item_name"
                placeholder="请输入品目名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="类型" prop="item_type">
              <el-select
                v-model.number="addItemForm.item_type"
                placeholder="请输入品目类型"
                style="width: 100%"
              >
                <el-option label="S:单纯资源" :value="0"></el-option>
                <el-option label="M:多重资源" :value="1"></el-option>
                <el-option label="V:可变能力多重资源" :value="2"></el-option>
                <el-option label="I:无限资源" :value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="数量" prop="number">
              <el-input-number
                v-model="addItemForm.number"
                placeholder="请输入品目数量"
                style="width: 100%"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="颜色">
              <el-color-picker
                style="width: 100%"
                color-format="hex"
                v-model="addItemForm.color"
              ></el-color-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="组标志" prop="group_flag">
              <el-radio-group v-model="addItemForm.group_flag">
                <el-radio :label="1">Yes</el-radio>
                <el-radio :label="0">No</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="所属组" prop="group_belong">
              <el-select
                v-model="addItemForm.group_belong"
                :disabled="addItemForm.group_flag == 1 ? true : false"
              >
                <el-option
                  v-for="(item, index) in itemGroupList"
                  :key="index"
                  :label="item.item_name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="组成员" prop="group_member">
              <el-select
                multiple
                v-model="addItemForm.group_member"
                :disabled="addItemForm.group_flag == 0 ? true : false"
              >
                <el-option
                  v-for="(item, index) in itemMemberList"
                  :key="index"
                  :label="item.item_name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" style="display: flex; justify-content: center">
        <el-button
          class="cu-shadow"
          type="warning"
          @click="handleAddItemDialogSubmit"
          >确 定</el-button
        >
        <el-button class="cu-shadow" @click="addItemDialog = false"
          >取 消</el-button
        >
      </span>
    </el-dialog>
    <!-- 修改品目弹窗 -->
    <el-dialog title="修改品目" :visible.sync="editItemDialog" width="60%">
      <el-form
        :model="editItemForm"
        :rules="editItemFormRules"
        ref="editItemForm"
        label-position="left"
        label-width="95px"
        style="padding: 30px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="品目名称" prop="item_name">
              <el-input
                v-model="editItemForm.item_name"
                placeholder="请输入品目名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="类型" prop="item_type">
              <el-select
                v-model="editItemForm.item_type"
                placeholder="请输入品目类型"
                style="width: 100%"
              >
                <el-option label="S:单纯资源" :value="0"></el-option>
                <el-option label="M:多重资源" :value="1"></el-option>
                <el-option label="V:可变能力多重资源" :value="2"></el-option>
                <el-option label="I:无限资源" :value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="数量" prop="number">
              <el-input-number
                v-model="editItemForm.number"
                style="width: 100%"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="颜色">
              <el-color-picker
                style="width: 100%"
                color-format="hex"
                v-model="editItemForm.color"
              ></el-color-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="组标志" prop="group_flag">
              <el-radio-group v-model="editItemForm.group_flag">
                <el-radio :label="1">Yes</el-radio>
                <el-radio :label="0">No</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="所属组" prop="group_belong">
              <el-select
                v-model="editItemForm.group_belong"
                :disabled="editItemForm.group_flag == 1 ? true : false"
              >
                <el-option
                  v-for="(item, index) in itemGroupList"
                  :key="index"
                  :label="item.item_name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="组成员" prop="group_member">
              <el-select
                multiple
                v-model="editItemForm.group_member"
                :disabled="editItemForm.group_flag == 0 ? true : false"
              >
                <el-option
                  v-for="(item, index) in itemMemberList"
                  :key="index"
                  :label="item.item_name"
                  :value="item.id"
                  v-show="item.item_id != editItemForm.item_id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" style="display: flex; justify-content: center">
        <el-button
          class="cu-shadow"
          type="warning"
          @click="handleEditItemDialogSubmit"
          >确 定</el-button
        >
        <el-button class="cu-shadow" @click="editItemDialog = false"
          >取 消</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getItemList, addItem, updateItemById,deleteItemById } from "@/api/item";
export default {
  name: "ItemTable",
  data() {
    return {
      itemList: [],
      editItemDialog: false,
      editItemForm: {},
      editIndex: 0,
      addItemDialog: false,
      addItemForm: {
        item_name: null,
        item_type: 0,
        group_flag: 0,
        number: 0,
        group_belong: null,
        group_member: [],
        color: "#E6A23C",
      },
      addItemFormRules: {
        item_name: [
          { required: true, message: "请输入品目名称", trigger: "blur" },
          { min: 0, max: 8, message: "长度在 0 到 8 个字符", trigger: "blur" },
        ],
      },
      editItemFormRules: {
        name: [
          { min: 0, max: 8, message: "长度在 0 到 8 个字符", trigger: "blur" },
        ],
      },
      listLoading: false,
    };
  },
  computed: {
    itemGroupList() {
      return this.itemList.filter((item) => {
        return item.group_flag == 1;
      });
    },
    itemMemberList() {
      return this.itemList.filter((item) => {
        return item.group_flag == 0 && !item.group_belong;
      });
    },
  },
  created() {
    this.listLoading = true;
    getItemList().then((res) => {
      this.itemList = res.data.item_infos;
      this.listLoading = false;
    });
  },
  methods: {
    handleAddItemDialogSubmit() {
      if (this.checkForm("addItemForm")) {
        //添加品目，需要接api
        console.log(this.addItemForm);
        this.addItemForm.group_member = this.addItemForm.group_member.join(",");
        addItem(this.addItemForm).then((res) => {
          if (res.code == "200") {
            this.$message({ message: "添加品目成功", type: "success" });
            getItemList().then((res) => {
              if (res.code == "200") {
                this.itemList = res.data.item_infos;
                this.addItemForm = {
                  item_name: null,
                  item_type: 0,
                  group_flag: 0,
                  group_belong: null,
                  group_member: [],
                  color: "#E6A23C",
                };
                this.addItemDialog = false;
              }
            });
          }
        });
      }
    },
    handleEditItemClick(index) {
      this.editIndex = index;
      this.editItemForm = { ...this.itemList[index] };
      this.editItemDialog = true;
    },
    handleDeleteItemClick(index) {
      this.$confirm("确定删除品目？", "删除品目警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let item_id = this.itemList[index].id;
        deleteItemById(item_id).then(res=>{
          if(res.code=='200'){
            this.$message({ message: "删除品目成功", type: "warning" });
            getItemList().then(res=>{
              if(res.code=='200'){
                this.itemList=res.data.item_infos
              }
            })
          }
        })
      });
    },
    handleEditItemDialogSubmit() {
      if (this.checkForm("editItemForm")) {
        this.editItemForm.group_member=this.editItemForm.group_member.join(',')
        updateItemById(this.editItemForm).then((res) => {
          if (res.code == "200") {
            this.$message({ message: "修改品目成功", type: "success" });
            getItemList().then((res) => {
              if (res.code == "200") {
                this.itemList = res.data.item_infos;
                this.editItemDialog = false;
              }
            });
          }
        });
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
