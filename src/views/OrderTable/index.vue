<template>
  <div>
    <!-- 操作栏 -->
    <el-card style="margin: 30px 30px 10px 30px; border-radius: 10px">
      <el-row type="flex" justify="space-between">
        <el-col>
          <el-button
            class="cu-shadow"
            type="primary"
            icon="el-icon-plus"
            @click="handleAddOrderDialogClick"
            >添加订单</el-button
          >
        </el-col>
        <el-col>
          <el-row type="flex" justify="end">
            <el-button
              class="cu-shadow"
              type="success"
              icon="el-icon-upload2"
              @click="addOrderDialog = true"
              >导入EXCEL</el-button
            >
            <el-button
              class="cu-shadow"
              type="success"
              icon="el-icon-paperclip"
              plain
              @click="addOrderDialog = true"
              >下载模板</el-button
            >
          </el-row>
        </el-col>
      </el-row>
    </el-card>
    <!-- 订单数据表格 -->
    <el-card style="margin: 30px; border-radius: 10px">
      <el-table
        v-loading="listLoading"
        :data="orderList"
        element-loading-text="Loading"
        border
        stripe
        fit
        highlight-current-row
      >
        <el-table-column align="center" label="订单状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              @change="handleOrderStatusChange(scope.$index)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" label="订单名称" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.order_code }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="品目">
          <template slot-scope="scope">
            {{ scope.row.item_name }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="数量">
          <template slot-scope="scope">
            {{ scope.row.item_num }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="开始时间">
          <template slot-scope="scope">
            {{ scope.row.start_time }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="结束时间">
          <template slot-scope="scope">
            {{ scope.row.end_time }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="延迟(天)">
          <template slot-scope="scope">
            {{ scope.row.delay_time }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="优先级">
          <template slot-scope="scope">
            {{ scope.row.priority }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="分派方法">
          <template slot-scope="scope">
            {{ scope.row.allocation_method }}
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
        <el-table-column align="center" label="操作" width="100">
          <template slot-scope="scope">
            <el-button
              class="cu-shadow"
              type="info"
              icon="el-icon-edit"
              size="mini"
              circle
              @click="handleEditOrderClick(scope.$index)"
            ></el-button>
            <el-button
              class="cu-shadow"
              type="danger"
              icon="el-icon-delete"
              size="mini"
              circle
              @click="handleDeleteOrderClick(scope.$index)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加订单弹窗 -->
    <el-dialog title="添加订单" :visible.sync="addOrderDialog" width="60%">
      <el-form
        :model="addOrder"
        :rules="addOrderRules"
        ref="addOrderForm"
        label-position="left"
        label-width="95px"
        style="padding: 30px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="订单名称" prop="order_code">
              <el-input
                v-model="addOrder.order_code"
                placeholder="请输入订单名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="开始时间" prop="start_time">
              <el-date-picker
                v-model="addOrder.start_time"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 100%"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间" prop="end_time">
              <el-date-picker
                v-model="addOrder.end_time"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 100%"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="延迟(天)" prop="delay_time">
              <el-input-number
                v-model="addOrder.delay_time"
                :min="0"
                style="width: 100%"
              ></el-input-number>
            </el-form-item>
                        <el-form-item label="颜色">
              <el-color-picker
                style="width: 100%"
                color-format="hex"
                v-model="addOrder.color"
              ></el-color-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="品目" prop="item_id">
              <el-select v-model="addOrder.item_id" style="width: 100%">
                <el-option
                  v-for="(item, key) in itemList"
                  :key="key"
                  :value="item.id"
                  :label="item.item_name"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="数量" prop="item_num">
              <el-input
                v-model.number="addOrder.item_num"
                type="number"
                placeholder="请输入生产数量"
              ></el-input>
            </el-form-item>
            <el-form-item label="优先级" prop="priority">
              <el-input
                v-model.number="addOrder.priority"
                type="number"
                placeholder="请输入生产优先级"
              ></el-input>
            </el-form-item>
            <el-form-item label="分派方法">
              <el-radio-group v-model="addOrder.allocation_method">
                <el-radio label="F">正向</el-radio>
                <el-radio label="B">逆向</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" style="display: flex; justify-content: center">
        <el-button
          class="cu-shadow"
          type="primary"
          @click="handleAddOrderDialogSubmit"
          >确 定</el-button
        >
        <el-button class="cu-shadow" @click="addOrderDialog = false"
          >取 消</el-button
        >
      </span>
    </el-dialog>
    <!-- 修改订单弹窗 -->
    <el-dialog title="修改订单信息" :visible.sync="editOrderDialog" width="60%">
      <el-form
        :model="editOrder"
        :rules="editOrderRules"
        ref="editOrderForm"
        label-position="left"
        label-width="95px"
        style="padding: 30px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="订单名称" prop="order_code">
              <el-input v-model="editOrder.order_code"></el-input>
            </el-form-item>

            <el-form-item label="开始时间" prop="start_time">
              <el-date-picker
                v-model="editOrder.start_time"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间"
                style="width: 100%"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间" prop="end_time">
              <el-date-picker
                v-model="editOrder.end_time"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间"
                style="width: 100%"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="延迟(天)" prop="delay_time">
              <el-input-number
                v-model="editOrder.delay_time"
                :min="0"
                style="width: 100%"
              ></el-input-number>
            </el-form-item>
                                    <el-form-item label="颜色">
              <el-color-picker
                style="width: 100%"
                color-format="hex"
                v-model="editOrder.color"
              ></el-color-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="品目" prop="item_id">
              <el-select
                v-model="editOrder.item_id"
                style="width: 100%"
              >
                <el-option
                  v-for="(item, key) in itemList"
                  :key="key"
                  :value="item.id"
                  :label="item.item_name"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="数量" prop="item_num">
              <el-input
                type="number"
                v-model.number="editOrder.item_num"
              ></el-input>
            </el-form-item>
                        <el-form-item label="优先级" prop="priority">
              <el-input
                type="number"
                v-model.number="editOrder.priority"
              ></el-input>
            </el-form-item>
            <el-form-item label="分派方法">
              <el-radio-group v-model="editOrder.allocation_method">
                <el-radio label="F">正向</el-radio>
                <el-radio label="B">逆向</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" style="display: flex; justify-content: center">
        <el-button
          class="cu-shadow"
          type="primary"
          @click="handleEditOrderDialogSubmit"
          >确 定</el-button
        >
        <el-button class="cu-shadow" @click="editOrderDialog = false"
          >取 消</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getOrderList,addOrder,updateOrderById,deleteOrderById } from "@/api/order";
import { getItemList } from "@/api/item";
export default {
  name: "OrderTable",
  data() {
    return {
      orderList: [],
      itemList: [],
      editOrderDialog: false,
      editOrder: {},
      editIndex: 0,
      addOrderDialog: false,
      addOrder: {
        order_code: null,
        status:0,
        item_id:null,
        item_num: 1,
        priority: null,
        start_time: null,
        end_time: null,
        delay_time: null,
        color:'#409EFF',
        allocation_method: "F",
      },
      addOrderRules: {
        order_code: [{ required: true, message: "请输入订单名称", trigger: "blur" }],
        item_id: [{ required: true, message: "请选择品目", trigger: "blur" }],
        item_num: [
          { required: true, message: "请输入生产数量", trigger: "blur" },
          {
            type: "number",
            min: 1,
            message: "请输入数字且不小于1",
            trigger: "blur",
          },
        ],
        priority: [
          { required: true, message: "请输入生产优先级", trigger: "blur" },
          { type: "number", message: "请输入数字", trigger: "blur" },
        ],
        start_time: [
          { required: true, message: "请选择开始时间", trigger: "blur" },
        ],
        end_time: [
          { required: true, message: "请选择结束时间", trigger: "blur" },
        ],
      },
      editOrderRules: {
        order_code: [{ required: true, message: "请输入订单名称", trigger: "blur" }],
        id: [{ required: true, message: "请选择品目", trigger: "blur" }],
        item_num: [
          { required: true, message: "请输入生产数量", trigger: "blur" },
          {
            type: "number",
            min: 1,
            message: "请输入数字且不小于1",
            trigger: "blur",
          },
        ],
        priority: [
          { required: true, message: "请输入生产优先级", trigger: "blur" },
          { type: "number", message: "请输入数字", trigger: "blur" },
        ],
        start_time: [
          { required: true, message: "请选择开始时间", trigger: "blur" },
        ],
        end_time: [
          { required: true, message: "请选择结束时间", trigger: "blur" },
        ],
      },
      listLoading: false,
    };
  },
  created() {
    this.listLoading = true;
    getOrderList().then((res) => {
      if(res.code="200"){
        this.orderList = res.data.order_infos;
        this.listLoading = false;
      }
    });
  },
  methods: {
    handleOrderStatusChange(index) {
      //添加改变订单状态api
      updateOrderById(this.orderList[index]).then(res=>{
          if(!res.code=='200'){
            this.$message({ message: "订单状态修改失败", type: "danger" });
          }
        })
    },
    handleAddOrderDialogClick() {
      getItemList().then((res) => {
        if (res.code == "200") {
          this.itemList = res.data.item_infos;
        }
      });
      this.addOrderDialog = true;
    },
    handleAddOrderDialogSubmit() {
      if (this.checkForm("addOrderForm")) {
        addOrder(this.addOrder).then(res=>{
          if(res.code=='200'){
            this.$message({ message: "添加订单成功", type: "success" });
            getOrderList().then(res=>{
              if(res.code=='200'){
                this.orderList = res.data.order_infos;
                this.addOrderDialog = false;
              }
            })
          }
        })
      }
    },
    handleEditOrderClick(index) {
      getItemList().then((res) => {
        if (res.code == "200") {
          this.itemList = res.data.item_infos;
          this.editIndex = index;
          this.editOrder = { ...this.orderList[index] };
          this.editOrderDialog = true;
        }
      });
    },
    handleDeleteOrderClick(index) {
      this.$confirm("确定删除订单？", "删除订单警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        //删除订单，需要接api
        let orderId=this.orderList[index].id
        deleteOrderById(orderId).then(res=>{
          if(res.code=='200'){
             this.$message({ message: "删除订单成功", type: "warning" });
             getOrderList().then(res=>{
               if(res.code=='200'){
                this.orderList = res.data.order_infos;
              }
             })
          }
        })
      });
    },
    handleEditOrderDialogSubmit() {
      if (this.checkForm("editOrderForm")) {
        //修改订单，需要接api
        updateOrderById(this.editOrder).then(res=>{
          if(res.code=='200'){
            this.$message({ message: "修改订单成功", type: "success" });
            getOrderList().then(res=>{
              if(res.code=='200'){
                this.orderList = res.data.order_infos;
                this.editOrderDialog = false;
              }
            }) 
          }
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
