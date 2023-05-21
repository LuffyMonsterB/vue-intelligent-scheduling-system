<template>
  <div>
    <el-card style="margin: 30px 30px 10px 30px; border-radius: 10px">
      <el-row type="flex" justify="space-between">
        <el-col>
          <el-select
            v-model="selectedItem.id"
            placeholder="请选择品目"
            @change="handleItemChange"
          >
            <el-option
              v-for="(item, index) in itemList"
              :key="index"
              :label="item.item_name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>
        <el-col>
          <el-row type="flex" justify="end">
            <el-button class="cu-shadow" type="primary" icon="el-icon-upload2"
              >导出工序图</el-button
            >
            <el-button
              class="cu-shadow"
              type="primary"
              icon="el-icon-download"
              plain
              >下载工序表</el-button
            >
          </el-row>
        </el-col>
      </el-row>
    </el-card>
    <el-card style="margin: 30px 30px 10px 30px; border-radius: 10px">
      <el-container>
        <el-aside
          style="
            width: 8%;
            background: rgba(220, 220, 220, 0.2);
            border-radius: 10px;
          "
        >
          <el-row type="flex" justify="center" style="margin-top: 10px">
            <el-tooltip
              class="item"
              effect="dark"
              content="保存工序"
              placement="right"
            >
              <el-button
                @click="saveProcess"
                icon="el-icon-check"
                type="primary"
                plain
                class="cu-shadow"
                circle
              ></el-button>
            </el-tooltip>
          </el-row>
          <el-divider></el-divider>
          <el-row type="flex" justify="center" style="margin-top: 10px">
            <el-tooltip
              class="item"
              effect="dark"
              content="添加工序"
              placement="right"
            >
              <el-button
                @click="handleNewProcessNodeDialog"
                icon="el-icon-bangzhu"
                class="cu-shadow"
                circle
              ></el-button>
            </el-tooltip>
          </el-row>
          <el-row type="flex" justify="center" style="margin-top: 10px">
            <el-tooltip
              class="item"
              effect="dark"
              content="添加品目"
              placement="right"
            >
              <el-button
                @click="handleNewItemNodeDialog"
                icon="el-icon-aim"
                class="cu-shadow"
                circle
              ></el-button>
            </el-tooltip>
          </el-row>
          <el-divider></el-divider>
          <el-row type="flex" justify="center" style="margin-top: 10px">
            <el-tooltip
              class="item"
              effect="dark"
              content="撤销"
              placement="right"
            >
              <el-button
                @click="toUndo()"
                icon="el-icon-refresh-left"
                class="cu-shadow"
                circle
              ></el-button>
            </el-tooltip>
          </el-row>
          <el-row type="flex" justify="center" style="margin-top: 10px">
            <el-tooltip
              class="item"
              effect="dark"
              content="放大视图"
              placement="right"
            >
              <el-button
                @click="mapZoom('+')"
                icon="el-icon-zoom-in"
                class="cu-shadow"
                circle
              ></el-button>
            </el-tooltip>
          </el-row>

          <el-row type="flex" justify="center" style="margin-top: 10px">
            <el-tooltip
              class="item"
              effect="dark"
              content="缩小视图"
              placement="right"
            >
              <el-button
                @click="mapZoom('-')"
                icon="el-icon-zoom-out"
                class="cu-shadow"
                circle
              ></el-button>
            </el-tooltip>
          </el-row>
          <el-row type="flex" justify="center" style="margin-top: 10px">
            <el-tooltip
              class="item"
              effect="dark"
              content="重置视图"
              placement="right"
            >
              <el-button
                @click="mapZoom()"
                icon="el-icon-full-screen"
                class="cu-shadow"
                circle
              ></el-button>
            </el-tooltip>
          </el-row>
        </el-aside>
        <el-main>
          <div ref="graphBoard" style="width: 100%"></div>
        </el-main>
      </el-container>
    </el-card>
    <el-row style="margin: 30px 30px 10px 30px">
      <el-col :span="14">
        <!-- 工序节点资源编辑 -->
        <el-card style="border-radius: 10px; margin-right: 10px">
          <div style="font-weight: bold; color: #606266; margin-bottom: 10px">
            工序资源面板
          </div>
            <el-divider>设置</el-divider>
          <el-form label-width="80px">
            <el-form-item label="工序名称">
              <el-input v-model="selectedProcessNode.name" @change="handleSelectedProcessNodeNameChange"></el-input>
            </el-form-item>
            <el-form-item label="可用资源">
              <el-select
                v-model="selectedProcessNode.resources"
                style="width: 100%"
                multiple
                @change="handleSelectedProcessNodeResourcesChange"
              >
            <el-option
              v-for="(item, key) in resourcesList"
              :key="key"
              :label="item.resource_code"
              :value="item.id"
            ></el-option>
              </el-select>
              <el-row
            v-for="(item, key) in selectedProcessNode.resourcesMap"
            :key="key"
          >
            <el-col :span="4">
              <el-tag size="mini" style="margin-right: 4px">{{
                item.resource_code
              }}</el-tag>
            </el-col>
            <el-col :span="20">
              <span>数量：</span>
              <el-input
                v-model="item.number"
                size="mini"
                type="number"
                style="width: 15%"
                @change="handleSelectedProcessNodeResourcesMapChange"
              ></el-input>
              <span>占用时间：</span>
              <el-input
                v-model="item.time"
                type="number"
                size="mini"
                style="width: 15%"
                @change="handleSelectedProcessNodeResourcesMapChange"
              ></el-input>
              <el-select
                placeholder="单位"
                size="mini"
                style="width: 30%"
                v-model="item.unit"
                @change="handleSelectedProcessNodeResourcesMapChange"
              >
                <el-option label="P/M (数量/分)" value="P/M"></el-option>
                <el-option label="P/H (数量/小时)" value="P/H"></el-option>
                <el-option label="P/D (数量/天)" value="P/D"></el-option>
              </el-select>
            </el-col>
          </el-row>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <!-- 品目节点资源编辑 -->
      <el-col :span="10">
        <el-card style="border-radius: 10px">
          <div style="font-weight: bold; color: #606266; margin-bottom: 10px">
            品目资源面板
          </div>
          <el-divider>设置</el-divider>
          <el-form label-width="80px">
            <el-form-item label="品目名称">
              <span>{{selectedItemNode.name}}</span>
            </el-form-item>
            <el-form-item label="生产数量">
              <el-input-number v-model="selectedItemNode.number" @change="handleItemPanelNumberChange"></el-input-number>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
    <!-- 添加新工序弹窗 -->
    <el-dialog
      :visible.sync="newProcessNodeDialog"
      title="添加新工序"
      width="50%"
    >
      <el-form
        :model="newProcessNodeForm"
        :rules="newProcessNodeFormRules"
        ref="newProcessNodeForm"
        label-position="left"
        label-width="60px"
        style="padding: 30px"
      >
        <el-form-item label="工序" prop="name">
          <el-input
            v-model="newProcessNodeForm.name"
            placeholder="请输入工序名称"
            style="width: 100%"
          ></el-input>
        </el-form-item>
        <el-form-item label="资源" prop="resources">
          <el-select
            style="width: 100%"
            multiple
            v-model="newProcessNodeForm.resources"
            @change="handleNewProcessNodeResourcesChange"
          >
            <el-option
              v-for="(item, key) in resourcesList"
              :key="key"
              :label="item.resource_code"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-row
            v-for="(item, key) in newProcessNodeForm.resourcesMap"
            :key="key"
          >
            <el-col :span="4">
              <el-tag size="mini" style="margin-right: 4px">{{
                item.resource_code
              }}</el-tag>
            </el-col>
            <el-col :span="20">
              <span>数量：</span>
              <el-input
                v-model="item.number"
                size="mini"
                type="number"
                style="width: 15%"
              ></el-input>
              <span>占用时间：</span>
              <el-input
                v-model="item.time"
                type="number"
                size="mini"
                style="width: 15%"
              ></el-input>
              <el-select
                placeholder="单位"
                size="mini"
                style="width: 30%"
                v-model="item.unit"
              >
                <el-option label="P/M (数量/分)" value="P/M"></el-option>
                <el-option label="P/H (数量/小时)" value="P/H"></el-option>
                <el-option label="P/D (数量/天)" value="P/D"></el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button
          class="cu-shadow"
          type="primary"
          @click="handleNewProcessNodeClick"
          >确 定</el-button
        >
        <el-button class="cu-shadow" @click="newProcessNodeDialog = false"
          >取 消</el-button
        >
      </span>
    </el-dialog>
    <!-- 添加品目弹窗 -->
    <el-dialog :visible.sync="newItemNodeDialog" title="添加品目" width="40%">
      <el-row type="flex" align="middle" justify="center">
        <el-form
          :model="newItemNodeForm"
          ref="newItemNodeForm"
          label-position="right"
          label-width="60px"
        >
          <el-form-item label="品目" prop="name">
            <el-row
              type="flex"
              align="middle"
              justify="space-between"
              style="width: 100%"
            >
            <!-- 未限制添加自身 -->
              <el-select
                v-model="newItemNodeForm.name"
                @change="handleNewItemNodeItemChange"
              >
                <el-option
                  v-for="(item, key) in itemList"
                  :key="key"
                  :label="item.item_name"
                  :value="item"
                ></el-option>
              </el-select>
              <el-color-picker
                v-model="newItemNodeForm.color"
                disabled
              ></el-color-picker>
            </el-row>
          </el-form-item>
          <el-form-item label="数量" prop="number">
            <el-input-number
              v-model="newItemNodeForm.number"
              :min="1"
              style="width: 100%"
            ></el-input-number>
          </el-form-item>
        </el-form>
      </el-row>

      <span slot="footer">
        <el-row type="flex" align="middle" justify="center">
          <el-button
            class="cu-shadow"
            type="primary"
            @click="handleNewItemNodeClick"
            >确 定</el-button
          >
          <el-button class="cu-shadow" @click="newItemNodeDialog = false"
            >取 消</el-button
          >
        </el-row>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { Graph, ObjectExt, Shape } from "@antv/x6";
import { DagreLayout } from "@antv/layout";
import {getProcessByItemId, updateProcessByItemId } from "@/api/process";
import { getResourceList } from "@/api/resource";
import { getItemList, updateItemById } from "@/api/item";

Shape.Rect.config({
  width: 60,
  height: 50,
  markup: [
    {
      tagName: "rect",
      selector: "body",
    },
    {
      tagName: "text",
      selector: "label",
    },
  ],
  attrs: {
    body: {
      fill: "#eee",
      stroke: "#000",
      strokeWidth: 2,
    },
    label: {
      fontSize: 10,
      fill: "#333",
      fontFamily: "Arial, helvetica, sans-serif",
      textAnchor: "middle",
      textVerticalAnchor: "middle",
    },
  },
  //连接桩
  ports: {
    groups: {
      // 输入链接桩群组定义
      left: {
        position: "left",
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: "#000",
            strokeWidth: 2,
            fill: "#fff",
          },
        },
      },
      right: {
        position: "right",
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: "#000",
            strokeWidth: 2,
            fill: "#fff",
          },
        },
      },
    },
    items: [
      {
        id: "port1-1",
        group: "left",
      },

      {
        id: "port2-2",
        group: "right",
      },
    ],
  },
  propHooks: {
    props(metadata) {
      const { nodeProps, ...others } = metadata;
      if (nodeProps != null) {
        ObjectExt.setByPath(others, "attrs/nodeProps", nodeProps);
      }
      return others;
    },
  },
});
Shape.Ellipse.config({
  width: 60,
  height: 50,
  markup: [
    {
      tagName: "ellipse",
      selector: "body",
    },
    {
      tagName: "text",
      selector: "label",
    },
  ],
  attrs: {
    body: {
      fill: "#fff",
      stroke: "#000",
      strokeWidth: 2,
    },
    label: {
      fontSize: 10,
      fill: "#333",
      fontFamily: "Arial, helvetica, sans-serif",
      textAnchor: "middle",
      textVerticalAnchor: "middle",
    },
  },
  //连接桩
  ports: {
    groups: {
      // 输入链接桩群组定义
      left: {
        position: "left",
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: "#000",
            strokeWidth: 2,
            fill: "#fff",
          },
        },
      },
      right: {
        position: "right",
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: "#000",
            strokeWidth: 2,
            fill: "#fff",
          },
        },
      },
    },
    items: [
      {
        id: "port1-1",
        group: "left",
      },

      {
        id: "port2-2",
        group: "right",
      },
    ],
  },
  propHooks: {
    props(metadata) {
      const { nodeProps, ...others } = metadata;
      if (nodeProps != null) {
        ObjectExt.setByPath(others, "attrs/nodeProps", nodeProps);
      }
      return others;
    },
  },
});

export default {
  data() {
    return {
      selectedProcessNode:{name:null,resources:[],resourcesMap:null},
      selectedItemNode:{name:null,number:null},
      selectedItem:{
        id:null,
        item_name:null,
      },
      processList: null,
      lastIndex: 0,
      listLoading: false,
      newProcessNodeDialog: false,
      resourcesList:[],
      newProcessNodeForm: { name: null, resources: [], resourcesMap: null },
      newProcessNodeFormRules: {
        name: [
          { required: true, message: "请输入工序名称", trigger: "blur" },
          { min: 1, max: 8, message: "长度在 1 到 8 个字符", trigger: "blur" },
        ],
        resources: [
          { required: true, message: "请选择至少一个资源", trigger: "blur" },
        ],
      },
      itemList: [],
      newItemNodeDialog: false,
      newItemNodeForm: { item_id: null, name: null, number: 1, color: null },
      graph_zoom: 0, //地图缩放比例
      graph: null,
      data: [],
    };
  },
  mounted() {
    this.init();
    getResourceList().then(res=>{
      if(res.code=='200'){
        this.resourcesList=res.data.resource_infos
      }
    })
    getItemList().then(res=>{
      if(res.code=='200'){
        this.itemList=res.data.item_infos
      }
    })
    // getProcessByItemId(this.selectedItem.item_id).then(res=>{
    //   if(res.code=='200'){
    //     this.processList = res.data.process_infos;
    //     this.processList.forEach((item) => {
    //       this.lastIndex = Math.max(item.id, this.lastIndex);
    //     });
    //     this.lastIndex++;
    //     this.drawGraph();
    //   }  
    // })
  },
  methods: {
    saveProcess() {
      let nodeMap=new Map();
      let graphJson = this.graph.model.toJSON().cells;
      let nodes=graphJson.filter(item=>item.shape=='rect'||item.shape=='ellipse')
      let edges=graphJson.filter(item=>item.shape=='edge')

      nodes.forEach(node=>{
        if(node.shape=='rect'){
          nodeMap.set(node.id,{id:node.id,type:'0',next_id:'-1',...node.attrs.props})
        }else if(node.shape=='ellipse'){
          nodeMap.set(node.id,{id:node.id,type:'1',next_id:'-1',...node.attrs.props})
        }
      })
      edges.forEach(edge=>{
        let id=edge.source.cell.toString()
        let node=nodeMap.get(id)
        node.next_id=edge.target.cell
        nodeMap.set(id,node)
      })
      let resultList=[]
      nodeMap.forEach(item=>{
        resultList.push(item)
      })
      updateProcessByItemId({finished_item_id:this.selectedItem.id,procedure:resultList}).then(res=>{
        if(res.code=='200'){
          this.$message({message:"工序保存成功",type:"success"})
        }
      })
    },
    //处理品目节点生成
    handleNewItemNodeClick() {
      this.$refs["newItemNodeForm"].validate((valid) => {
        if (valid) {
          this.createItemNode(this.newItemNodeForm);
          this.newItemNodeDialog = false;
          this.newItemNodeForm = {
            item_id: null,
            name: null,
            number: 1,
            color: null,
          };
        }
      });
    },
    //处理添加品目中品目变化
    handleNewItemNodeItemChange(item) {
      this.newItemNodeForm.name = item.item_name;
      this.newItemNodeForm.item_id = item.id;
      this.newItemNodeForm.color = item.color;
    },
    //打开添加品目对话框
    handleNewItemNodeDialog() {
      getItemList().then((res) => {
        this.itemList = res.data.item_infos;
        this.newItemNodeDialog = true;
      });
    },
    //打开新建工序对话框
    handleNewProcessNodeDialog() {
      getResourceList().then((res) => {
        this.resourcesList = [];
        this.resourcesList=res.data.resource_infos
      });
      this.newProcessNodeForm = { name: null, resources: [], resourcesMap: [] };
      this.newProcessNodeDialog = true;
    },
    handleItemPanelNumberChange(value){
      this.graph.getCellById(this.selectedItemNode.node_id).attrs.props.number=value
    },
    handleSelectedProcessNodeResourcesMapChange(){
      let newProps={name:this.selectedProcessNode.name,resources:this.selectedProcessNode.resourcesMap}
      this.graph.getCellById(this.selectedProcessNode.node_id).attr("props", newProps);
    },
    handleSelectedProcessNodeNameChange(value){
      let node=this.graph.getCellById(this.selectedProcessNode.node_id)
      node.attr("label/text", value);
      let newProps={name:this.selectedProcessNode.name,resources:this.selectedProcessNode.resourcesMap}
      node.attr("props", newProps);
    },
    handleSelectedProcessNodeResourcesChange(values){
      values.forEach((value) => {
        if (
          this.selectedProcessNode.resourcesMap.length == 0 ||
          this.selectedProcessNode.resourcesMap.filter((item) => {
            return item.id == value;
          }).length == 0
        ) {
          let resource_code=''
          this.resourcesList.forEach(item=>{
            if(item.id==value){
              resource_code=item.resource_code
            }
          })
          this.selectedProcessNode.resourcesMap.push({
            id: value,
            resource_code:resource_code,
            number: 1,
            time: 1,
            unit: "P/M",
          });
        }
      });
      for (let i = 0; i < this.selectedProcessNode.resourcesMap.length; i++) {
        if (values.indexOf(this.selectedProcessNode.resourcesMap[i].id)==-1) {
          this.selectedProcessNode.resourcesMap.splice(i, 1);
          break;
        }
      }
      let newProps={name:this.selectedProcessNode.name,resources:this.selectedProcessNode.resourcesMap}
      this.graph.getCellById(this.selectedProcessNode.node_id).attr("props", newProps);
    },
    //处理新建工序节点中的资源变化
    handleNewProcessNodeResourcesChange(values) {
      values.forEach((value) => {
        if (
          this.newProcessNodeForm.resourcesMap.length == 0 ||
          this.newProcessNodeForm.resourcesMap.filter((item) => {
            return item.id == value;
          }).length == 0
        ) {
          let resource_code=''
          this.resourcesList.forEach(item=>{
            if(item.id==value){
              resource_code=item.resource_code
            }
          })
          this.newProcessNodeForm.resourcesMap.push({
            id: value,
            resource_code:resource_code,
            number: 1,
            time: 1,
            unit: "P/M",
          });
        }
      });
      for (let i = 0; i < this.newProcessNodeForm.resourcesMap.length; i++) {
        if (values.indexOf(this.newProcessNodeForm.resourcesMap[i].id)==-1) {
          this.newProcessNodeForm.resourcesMap.splice(i, 1);
          break;
        }
      }
    },
    //处理品目变化
    handleItemChange() {
      getProcessByItemId(this.selectedItem.id).then(res=>{
        if(res.code=='200'){
          console.log(res)
          this.processList = res.data.procedure_infos[0];
          this.drawGraph();
        }else{
          this.processList={finished_item_id:null,procedure:[]}
          this.drawGraph()
        }
      })
      // getProcessByItemId(this.selectedItem.id).then(res=> {
      //   console.log(res)
      //   this.processList = res.data.procedure_infos;
      //   this.drawGraph();
      // });
    },
    //处理新工序节点生成
    handleNewProcessNodeClick() {
      this.$refs["newProcessNodeForm"].validate((valid) => {
        if (valid) {
          this.createProcessNode(this.newProcessNodeForm);
          this.newProcessNodeDialog = false;
          this.newProcessNodeForm = { name: null, resources: [], resourcesMap: [] };
        }
      });
    },
    drawGraph() {
      this.graph.clearCells();
      this.lastIndex=0
      const data = {
        nodes: [],
        edges: [],
      };
      this.processList.procedure.forEach((process) => {
        //判断节点类型：工序、资源
        if (process.type == 0) {
          data.nodes.push({
            id: process.id,
            shape: "rect",
            attrs: {
              label: {
                text: process.name, // 文本
              },
              props: { name: process.name, resources: process.resources },
            },
          });
        } else {
          data.nodes.push({
            id: process.id,
            shape: "ellipse",
            attrs: {
              body: {
                fill: process.color, // 背景颜色
              },
              label: {
                text: process.name, // 文本
              },
              props: {
                name: process.name,
                number: process.number,
                color: process.color,
              },
            },
          });
        }
        //边生成，注意最后的节点next_id是-1
        if (process.next_id != -1) {
          data.edges.push({
            source: process.id,
            target: process.next_id,
          });
        }
        this.lastIndex=Math.max(process.id,this.lastIndex)
      });
      this.lastIndex++
      const dagreLayout = new DagreLayout({
        type: "dagre",
        rankdir: "LR",
        align: "UL",
        ranksep: 20,
        nodesep: 15,
        controlPoints: false,
      });
      const model = dagreLayout.layout(data);
      this.graph.fromJSON(model);
      this.mapZoom();
    },
    //创建工序节点
    createProcessNode(data) {
      this.graph.addNode({
        id: ++this.lastIndex + "",
        shape: "rect",
        x: 0,
        y: 300,
        attrs: {
          label: {
            text: data.name, // 文本
          },
          props: {name:data.name,resources:data.resourcesMap },
        },
      });
    },
    //创建品目节点
    createItemNode(data) {
      this.graph.addNode({
        id: ++this.lastIndex + "",
        shape: "ellipse",
        x: 0,
        y: 300,
        attrs: {
          body: {
            fill: data.color, // 背景颜色
          },
          label: {
            text: data.name, // 文本
          },
          props: { ...data },
        },
      });
    },
    
    //初始化地图
    init() {
      //创建地图
      this.graph = new Graph({
        snapline: true, //对齐线
        history: {
          enabled: true, //历史记录
          ignoreChange: true, //ignoreChange 是否忽略属性变化
        },
        panning: true, //支持平移拖拽
        container: this.$refs.graphBoard,
        height: 500,
        background: {
          color: "#ffffff", // 设置画布背景颜色
        },
        grid: {
          size: 10, // 网格大小 10px
          visible: true, // 渲染网格背景
        },
        connecting: {
          allowPort: true, //是否允许边链接到链接桩
          allowEdge: true, //是否允许边链接到另一个边
          allowNode: true, //是否允许边链接到节点（非节点上的链接桩)
          allowLoop: false, //是否允许创建循环连线，即边的起始节点和终止节点为同一节点
          allowMulti: false, //是否允许在相同的起始节点和终止之间创建多条边
          allowBlank: false, //是否允许连接到画布空白位置的点
          // 自动吸附
          snap: {
            radius: 20,
          },
        },
      });
      //加载地图数据
      this.graph.centerContent(); //画布居中
      //节点点击事件
      this.graph.on("node:click", ({ e, x, y, node, view }) => {
        if(node.shape=='rect'){
          let props=node.attrs.props
          let resources=[]
          let resourcesMap=[]
          props.resources.forEach(item=>{
            resources.push(item.id)
            resourcesMap.push(item)
          })
          this.selectedProcessNode={node_id:node.id,name:props.name,resources:resources,resourcesMap:resourcesMap}
        }else if(node.shape=='ellipse'){
          this.selectedItemNode={node_id:node.id,...node.attrs.props}
        }
        this.selectReset();
        node.attr("body/stroke", "orange");
      });
      //边点击事件
      this.graph.on("edge:click", ({ e, x, y, edge, view }) => {
        // console.log(edge)
        this.selectReset();
        edge.attr("line/stroke", "orange");
        edge.prop("labels/0", {
          attrs: {
            body: {
              stroke: "orange",
            },
          },
        });
      }),
        //节点双击事件
        this.graph.on("node:dblclick", ({ e, x, y, node, view }) => {
          this.$confirm("删除节点？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            view.cell.remove();
          });
        });
      //边双击事件
      this.graph.on("edge:dblclick", ({ e, x, y, edge, view }) => {
        this.$confirm("删除边？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          view.cell.remove();
        });
      });
    },
    //保存，获取节点等数据
    save() {
      //序列化/反序列化 数据格式
      // https://antv-x6.gitee.io/zh/docs/tutorial/intermediate/serialization
      // graph.toJSON() 方法来导出图中的节点和边
      console.log(this.graph.toJSON());
    },
    //撤销操作
    toUndo() {
      this.graph.undo();
    },
    //重做
    toRedo() {
      this.graph.redo();
      //   if (this.graph.isHistoryEnabled()) {
      //     this.graph.disableHistory()
      //   } else {
      //     this.graph.enableHistory()
      //   }
    },
    //地图放大缩小
    mapZoom(type) {
      if (type == "+") {
        this.graph.zoom(0.1);
        this.graph_zoom += 0.1;
      } else if (type == "-") {
        this.graph.zoom(-0.1);
        this.graph_zoom -= 0.1;
      } else {
        this.graph.zoom(
          this.graph_zoom <= 0 ? Math.abs(this.graph_zoom) : -this.graph_zoom
        );
        this.graph.centerContent(); //画布居中
        this.graph_zoom = 0;
      }
    },
    //选择节点，边时重置颜色
    selectReset() {
      //   this.graph.drawBackground({ color: '#fff' })
      const nodes = this.graph.getNodes();
      const edges = this.graph.getEdges();

      nodes.forEach((node) => {
        node.attr("body/stroke", "#000");
      });

      edges.forEach((edge) => {
        edge.attr("line/stroke", "black");
        edge.prop("labels/0", {
          attrs: {
            body: {
              stroke: "black",
            },
          },
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.toolbar {
  //   padding: 0 20px;
  box-sizing: border-box;
  height: 40px;
  background: white;
  box-shadow: 0 2px 6px #e1e1e1;
  position: fixed;
  right: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  .tool {
    cursor: pointer;
    width: 40px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover {
      background: #f1f1f1;
    }
  }
}
.rect {
  width: 10px;
  height: 10px;
  border: 1px solid #5a5a5a;
  //   color: #e9352f;
}
</style>
