<template>
  <div id="app">
    <basic-container>
      <!-- 表单测试 -->
      <!-- <span style="color: red">这里是父组件的form：{{ form }}</span>
      <el-button type="primary" @click="changeFormValue"
        >改变form的值</el-button
      >
      <test-model v-model="form"></test-model> -->
      <!-- from：{{ form }} -->
      <!-- <p-form
        ref="form"
        :option="formOption"
        v-model="form"
        @submitForm="submit"
      >
        <template v-slot:timeForm="{ size, disabled }">
          <el-input
            value="坏了,我成插槽了"
            :size="size"
            :disabled="disabled"
            placeholder=""
          ></el-input>
        </template>
      </p-form> -->
      <!-- 表格测试 -->
      <!-- 
        <pTable :crudOption="option" :tableData="data"></pTable> -->
      <!-- crud测试 -->
      <Crud
        ref="crud"
        v-model="form"
        :page="page"
        :loading="loading"
        :crudOption="option"
        :before-open="beforeOpen"
        :tableData="data"
        @refresh-change="refreshChange"
        @row-save="submit"
        @row-update="submit"
        @row-delete="rowDelete"
        @current-change="currentChange"
        @size-change="sizeChange"
        @on-load="onLoad"
      >
        <!-- 顶部插槽测试 -->
        <template slot="muneLeft">
          <el-button type="primary" size="small">左边的测试按钮</el-button>
        </template>
        <template slot="muneRight">
          <el-button type="primary" size="small">右边的测试按钮</el-button>
        </template>
        <!-- 表格插槽测试 -->
        <template slot="name" slot-scope="{ row, index }"
          >{{ index }}{{ row.name }}
        </template>
        <template slot="menuBtn" slot-scope="{ row, index }">
          <el-button
            type="text"
            size="mini"
            icon="el-icon-check"
            @click="test(row, index)"
          >
            测试
          </el-button>
        </template>
        <!-- 表单插槽测试 -->
        <template slot="sexForm">
          <div>用插槽告诉你我的性别</div>
        </template>
      </Crud>
    </basic-container>
  </div>
</template>

<script>
// import pTable from "@/utils/CURD/p-table";
// import testModel from "@/components/testComponents/test-model";
const pickerOptions = {
  shortcuts: [
    {
      text: "今天",
      onClick(picker) {
        picker.$emit("pick", new Date());
      },
    },
  ],
};
export default {
  name: "app",
  components: {
    // pTable,
    // testModel,
  },
  data() {
    return {
      componentsName: "el-upload",
      loading: true,
      form: {},
      formOption: {
        size: "small",
        detail: true,
        labelWidth: 120,
        column: [
          {
            label: "姓名",
            prop: "name",
            slot: true,
            disabled: true,
            span: 24,
            rules: [
              {
                required: false,
                message: "请输入姓名好吗？",
                trigger: "blur",
              },
            ],
          },
          {
            label: "姓名1",
            prop: "name1",
            rules: [
              {
                required: true,
                message: "请输入姓名好吗？",
                trigger: "blur",
              },
            ],
          },
          {
            label: "专门用来消失的",
            prop: "useDisplay",
            display: false,
            labelWidth: 120,
          },
          {
            label: "密码框",
            prop: "password",
            type: "password",
          },
          {
            label: "性别",
            prop: "sex",
            type: "select",
            filterable: true,
            dataType: "number",
            value: 1,
            dicData: [
              {
                label: "男",
                value: 1,
              },
              {
                label: "女",
                value: 0,
              },
              {
                label: "谢尔比",
                value: 2,
              },
            ],
          },
          {
            label: "下拉框但远程搜索",
            prop: "selectRemote",
            props: {
              label: "label",
              value: "key",
            },
            labelWidth: 140,
            type: "select",
            multiple: true,
            allowCreate: true,
            dicData: [],
            filterable: true,
            remote: true,
            remoteMethod: (val) => {
              this.selectRemoteMethod(val);
            },
            loading: false,
          },

          {
            label: "年龄",
            prop: "age",
            type: "number",
            min: 1,
            max: 150,
            rules: [
              {
                required: true,
                message: "请输入年龄",
                trigger: "blur",
              },
            ],
          },
          {
            label: "单选框但按钮",
            prop: "radio",
            labelWidth: 120,
            type: "radio",
            showType: "button",
            // disabled: true,
            value: 1,
            dicData: [
              {
                label: "选项1",
                value: 1,
              },
              {
                label: "选项2",
                value: 2,
              },
            ],
          },
          {
            label: "多选框",
            prop: "checkbox",
            type: "checkbox",
            dataType: "array",
            value: [2],
            dicData: [
              {
                label: "选项1",
                value: 1,
              },
              {
                label: "选项2",
                value: 2,
              },
            ],
          },
          {
            label: "级联选择器",
            prop: "cascader",
            type: "cascader",
            filterable: true,
            multiple: true,
            dicData: [
              {
                value: "zhinan",
                label: "指南",
                children: [
                  {
                    value: "shejiyuanze",
                    label: "设计原则",
                    children: [
                      {
                        value: "yizhi",
                        label: "一致",
                      },
                      {
                        value: "fankui",
                        label: "反馈",
                      },
                      {
                        value: "xiaolv",
                        label: "效率",
                      },
                      {
                        value: "kekong",
                        label: "可控",
                      },
                    ],
                  },
                  {
                    value: "daohang",
                    label: "导航",
                    children: [
                      {
                        value: "cexiangdaohang",
                        label: "侧向导航",
                      },
                      {
                        value: "dingbudaohang",
                        label: "顶部导航",
                      },
                    ],
                  },
                ],
              },
              {
                value: "zujian",
                label: "组件",
                children: [
                  {
                    value: "basic",
                    label: "Basic",
                    children: [
                      {
                        value: "layout",
                        label: "Layout 布局",
                      },
                      {
                        value: "color",
                        label: "Color 色彩",
                      },
                      {
                        value: "typography",
                        label: "Typography 字体",
                      },
                      {
                        value: "icon",
                        label: "Icon 图标",
                      },
                      {
                        value: "button",
                        label: "Button 按钮",
                      },
                    ],
                  },
                  {
                    value: "form",
                    label: "Form",
                    children: [
                      {
                        value: "radio",
                        label: "Radio 单选框",
                      },
                      {
                        value: "checkbox",
                        label: "Checkbox 多选框",
                      },
                      {
                        value: "input",
                        label: "Input 输入框",
                      },
                      {
                        value: "input-number",
                        label: "InputNumber 计数器",
                      },
                      {
                        value: "select",
                        label: "Select 选择器",
                      },
                      {
                        value: "cascader",
                        label: "Cascader 级联选择器",
                      },
                      {
                        value: "switch",
                        label: "Switch 开关",
                      },
                      {
                        value: "slider",
                        label: "Slider 滑块",
                      },
                      {
                        value: "time-picker",
                        label: "TimePicker 时间选择器",
                      },
                      {
                        value: "date-picker",
                        label: "DatePicker 日期选择器",
                      },
                      {
                        value: "datetime-picker",
                        label: "DateTimePicker 日期时间选择器",
                      },
                      {
                        value: "upload",
                        label: "Upload 上传",
                      },
                      {
                        value: "rate",
                        label: "Rate 评分",
                      },
                      {
                        value: "form",
                        label: "Form 表单",
                      },
                    ],
                  },
                  {
                    value: "data",
                    label: "Data",
                    children: [
                      {
                        value: "table",
                        label: "Table 表格",
                      },
                      {
                        value: "tag",
                        label: "Tag 标签",
                      },
                      {
                        value: "progress",
                        label: "Progress 进度条",
                      },
                      {
                        value: "tree",
                        label: "Tree 树形控件",
                      },
                      {
                        value: "pagination",
                        label: "Pagination 分页",
                      },
                      {
                        value: "badge",
                        label: "Badge 标记",
                      },
                    ],
                  },
                  {
                    value: "notice",
                    label: "Notice",
                    children: [
                      {
                        value: "alert",
                        label: "Alert 警告",
                      },
                      {
                        value: "loading",
                        label: "Loading 加载",
                      },
                      {
                        value: "message",
                        label: "Message 消息提示",
                      },
                      {
                        value: "message-box",
                        label: "MessageBox 弹框",
                      },
                      {
                        value: "notification",
                        label: "Notification 通知",
                      },
                    ],
                  },
                  {
                    value: "navigation",
                    label: "Navigation",
                    children: [
                      {
                        value: "menu",
                        label: "NavMenu 导航菜单",
                      },
                      {
                        value: "tabs",
                        label: "Tabs 标签页",
                      },
                      {
                        value: "breadcrumb",
                        label: "Breadcrumb 面包屑",
                      },
                      {
                        value: "dropdown",
                        label: "Dropdown 下拉菜单",
                      },
                      {
                        value: "steps",
                        label: "Steps 步骤条",
                      },
                    ],
                  },
                  {
                    value: "others",
                    label: "Others",
                    children: [
                      {
                        value: "dialog",
                        label: "Dialog 对话框",
                      },
                      {
                        value: "tooltip",
                        label: "Tooltip 文字提示",
                      },
                      {
                        value: "popover",
                        label: "Popover 弹出框",
                      },
                      {
                        value: "card",
                        label: "Card 卡片",
                      },
                      {
                        value: "carousel",
                        label: "Carousel 走马灯",
                      },
                      {
                        value: "collapse",
                        label: "Collapse 折叠面板",
                      },
                    ],
                  },
                ],
              },
              {
                value: "ziyuan",
                label: "资源",
                children: [
                  {
                    value: "axure",
                    label: "Axure Components",
                  },
                  {
                    value: "sketch",
                    label: "Sketch Templates",
                  },
                  {
                    value: "jiaohu",
                    label: "组件交互文档",
                  },
                ],
              },
            ],
          },
          // {
          //   label: "开关",
          //   prop: "switch",
          //   type: "switch",
          //   span: 6,
          //   props: {
          //     // activeColor: "#13ce66",
          //     // inactiveColor: "#ff4949",
          //     activeValue: "100",
          //     inactiveValue: "0",
          //   },
          // },
          {
            label: "时间选择器",
            prop: "time",
            type: "time",
            formSlot: true,
            props: {
              start: "08:30",
              step: "00:15",
              end: "18:30",
            },
          },
          {
            label: "时间选择器2",
            prop: "time2",
            type: "time",
            dataType: "time",
          },
          {
            label: "日期时间选择器",
            prop: "datetime",
            type: "datetime",
            needOptions: true,
            props: pickerOptions,
          },
          {
            label: "日期时间区间",
            prop: "datetimerangetest",
            type: "datetimerange",
            dataType: "array",
            needOptions: true,
          },
          {
            label: "上传",
            prop: "upload",
            type: "upload",
            listType: "text",
            dataType: "array",
            propsHttp: {
              imgDomain: "http://www.liulongbin.top:3006", //图片前缀，如果需要的话
              res: "response", //结构体的层次，例如返回data:{url:'',name:''},则res配置为data
              url: "url", //上传服务器后返回图片的对应字段
              name: "", //上传服务器后返回图片的对应名字
              fileName: "", //上传文件流时的名称,
              data: {}, //上传文件流时附带的参数
              headers: {}, //上传文件流时附带的请求头
            },
            action: "http://www.liulongbin.top:3006/api/upload/avatar",

            limit: 3,
            fileSize: 2, //文件大小限制,单位M
            fileType: "jpg/jpeg/mp4", //逗号分隔
          },
        ],
      },
      option: {
        menuWidth: 300,
        height: "auto",
        calcHeight: 60,
        tip: false,
        searchShow: true,
        searchMenuSpan: 6,
        border: true,
        index: true,
        viewBtn: true,
        selection: true,
        dialogClickModal: false,
        treeLazy: true,
        column: [
          {
            label: "姓名",
            prop: "name",
            fixed: true,
            slot: true,
            disabled: true,
            span: 24,
            rules: [
              {
                required: false,
                message: "请输入姓名好吗？",
                trigger: "blur",
              },
            ],
          },
          {
            label: "性别",
            prop: "sex",
            type: "select",
            filterable: true,
            dataType: "number",
            formslot: true,
            value: 1,
            dicData: [
              {
                label: "男",
                value: 1,
              },
              {
                label: "女",
                value: 0,
              },
              {
                label: "谢尔比",
                value: 2,
              },
            ],
          },
          {
            label: "我是多选的下拉框喔",
            prop: "selectButMultiple",
            type: "select",
            multiple: true,
            filterable: true,
            dataType: "number",
            value: [1, 0],
            dicData: [
              {
                label: "男",
                value: 1,
              },
              {
                label: "女",
                value: 0,
              },
              {
                label: "谢尔比",
                value: 2,
              },
            ],
          },
          {
            label: "专门用来消失的",
            prop: "useDisplay",
            display: false,
            hide: true,
            labelWidth: 120,
          },
          {
            label: "年龄",
            prop: "age",
            type: "number",
            rules: [
              {
                required: true,
                message: "请输入年龄",
                trigger: "blur",
              },
            ],
          },
          {
            label: "单纯的单选框",
            prop: "isRadio",
            type: "radio",
            dicData: [
              {
                label: "选项1",
                value: 1,
              },
              {
                label: "选项2",
                value: 2,
              },
            ],
          },
          {
            label: "单选框但按钮",
            prop: "radio",
            labelWidth: 120,
            type: "radio",
            showType: "button",
            value: 1,
            dicData: [
              {
                label: "选项1",
                value: 1,
              },
              {
                label: "选项2",
                value: 2,
              },
            ],
          },
          {
            label: "多选框",
            prop: "checkbox",
            type: "checkbox",
            dataType: "array",
            value: [2],
            dicData: [
              {
                label: "选项1",
                value: 1,
              },
              {
                label: "选项2",
                value: 2,
              },
            ],
          },
          {
            label: "级联选择器",
            prop: "cascader",
            type: "cascader",
            filterable: true,
            multiple: true,
            dicData: [
              {
                value: "zhinan",
                label: "指南",
                children: [
                  {
                    value: "shejiyuanze",
                    label: "设计原则",
                    children: [
                      {
                        value: "yizhi",
                        label: "一致",
                      },
                      {
                        value: "fankui",
                        label: "反馈",
                      },
                      {
                        value: "xiaolv",
                        label: "效率",
                      },
                      {
                        value: "kekong",
                        label: "可控",
                      },
                    ],
                  },
                  {
                    value: "daohang",
                    label: "导航",
                    children: [
                      {
                        value: "cexiangdaohang",
                        label: "侧向导航",
                      },
                      {
                        value: "dingbudaohang",
                        label: "顶部导航",
                      },
                    ],
                  },
                ],
              },
              {
                value: "zujian",
                label: "组件",
                children: [
                  {
                    value: "basic",
                    label: "Basic",
                    children: [
                      {
                        value: "layout",
                        label: "Layout 布局",
                      },
                      {
                        value: "color",
                        label: "Color 色彩",
                      },
                      {
                        value: "typography",
                        label: "Typography 字体",
                      },
                      {
                        value: "icon",
                        label: "Icon 图标",
                      },
                      {
                        value: "button",
                        label: "Button 按钮",
                      },
                    ],
                  },
                  {
                    value: "form",
                    label: "Form",
                    children: [
                      {
                        value: "radio",
                        label: "Radio 单选框",
                      },
                      {
                        value: "checkbox",
                        label: "Checkbox 多选框",
                      },
                      {
                        value: "input",
                        label: "Input 输入框",
                      },
                      {
                        value: "input-number",
                        label: "InputNumber 计数器",
                      },
                      {
                        value: "select",
                        label: "Select 选择器",
                      },
                      {
                        value: "cascader",
                        label: "Cascader 级联选择器",
                      },
                      {
                        value: "switch",
                        label: "Switch 开关",
                      },
                      {
                        value: "slider",
                        label: "Slider 滑块",
                      },
                      {
                        value: "time-picker",
                        label: "TimePicker 时间选择器",
                      },
                      {
                        value: "date-picker",
                        label: "DatePicker 日期选择器",
                      },
                      {
                        value: "datetime-picker",
                        label: "DateTimePicker 日期时间选择器",
                      },
                      {
                        value: "upload",
                        label: "Upload 上传",
                      },
                      {
                        value: "rate",
                        label: "Rate 评分",
                      },
                      {
                        value: "form",
                        label: "Form 表单",
                      },
                    ],
                  },
                  {
                    value: "data",
                    label: "Data",
                    children: [
                      {
                        value: "table",
                        label: "Table 表格",
                      },
                      {
                        value: "tag",
                        label: "Tag 标签",
                      },
                      {
                        value: "progress",
                        label: "Progress 进度条",
                      },
                      {
                        value: "tree",
                        label: "Tree 树形控件",
                      },
                      {
                        value: "pagination",
                        label: "Pagination 分页",
                      },
                      {
                        value: "badge",
                        label: "Badge 标记",
                      },
                    ],
                  },
                  {
                    value: "notice",
                    label: "Notice",
                    children: [
                      {
                        value: "alert",
                        label: "Alert 警告",
                      },
                      {
                        value: "loading",
                        label: "Loading 加载",
                      },
                      {
                        value: "message",
                        label: "Message 消息提示",
                      },
                      {
                        value: "message-box",
                        label: "MessageBox 弹框",
                      },
                      {
                        value: "notification",
                        label: "Notification 通知",
                      },
                    ],
                  },
                  {
                    value: "navigation",
                    label: "Navigation",
                    children: [
                      {
                        value: "menu",
                        label: "NavMenu 导航菜单",
                      },
                      {
                        value: "tabs",
                        label: "Tabs 标签页",
                      },
                      {
                        value: "breadcrumb",
                        label: "Breadcrumb 面包屑",
                      },
                      {
                        value: "dropdown",
                        label: "Dropdown 下拉菜单",
                      },
                      {
                        value: "steps",
                        label: "Steps 步骤条",
                      },
                    ],
                  },
                  {
                    value: "others",
                    label: "Others",
                    children: [
                      {
                        value: "dialog",
                        label: "Dialog 对话框",
                      },
                      {
                        value: "tooltip",
                        label: "Tooltip 文字提示",
                      },
                      {
                        value: "popover",
                        label: "Popover 弹出框",
                      },
                      {
                        value: "card",
                        label: "Card 卡片",
                      },
                      {
                        value: "carousel",
                        label: "Carousel 走马灯",
                      },
                      {
                        value: "collapse",
                        label: "Collapse 折叠面板",
                      },
                    ],
                  },
                ],
              },
              {
                value: "ziyuan",
                label: "资源",
                children: [
                  {
                    value: "axure",
                    label: "Axure Components",
                  },
                  {
                    value: "sketch",
                    label: "Sketch Templates",
                  },
                  {
                    value: "jiaohu",
                    label: "组件交互文档",
                  },
                ],
              },
            ],
          },
          {
            label: "上传",
            prop: "upload",
            type: "upload",
            hide: true,
            listType: "text",
            dataType: "array",
            propsHttp: {
              imgDomain: "http://www.liulongbin.top:3006", //图片前缀，如果需要的话
              res: "response", //结构体的层次，例如返回data:{url:'',name:''},则res配置为data
              url: "url", //上传服务器后返回图片的对应字段
              name: "", //上传服务器后返回图片的对应名字
              fileName: "", //上传文件流时的名称,
              data: {}, //上传文件流时附带的参数
              headers: {}, //上传文件流时附带的请求头
            },
            action: "http://www.liulongbin.top:3006/api/upload/avatar",

            limit: 3,
            fileSize: 2, //文件大小限制,单位M
            fileType: "jpg/jpeg/mp4", //逗号分隔
          },
        ],
      },
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      statesList: [],
      states: [
        "Alabama",
        "Alaska",
        "Arizona",
        "Arkansas",
        "California",
        "Colorado",
        "Connecticut",
        "Delaware",
        "Florida",
        "Georgia",
        "Hawaii",
        "Idaho",
        "Illinois",
        "Indiana",
        "Iowa",
        "Kansas",
        "Kentucky",
        "Louisiana",
        "Maine",
        "Maryland",
        "Massachusetts",
        "Michigan",
        "Minnesota",
        "Mississippi",
        "Missouri",
        "Montana",
        "Nebraska",
        "Nevada",
        "New Hampshire",
        "New Jersey",
        "New Mexico",
        "New York",
        "North Carolina",
        "North Dakota",
        "Ohio",
        "Oklahoma",
        "Oregon",
        "Pennsylvania",
        "Rhode Island",
        "South Carolina",
        "South Dakota",
        "Tennessee",
        "Texas",
        "Utah",
        "Vermont",
        "Virginia",
        "Washington",
        "West Virginia",
        "Wisconsin",
        "Wyoming",
      ],
      data: [],
    };
  },
  computed: {
    useDisplayCrudIndex() {
      let index = this.option.column.findIndex((item) => {
        return item.prop == "useDisplay";
      });
      return index;
    },
    useDisplayIndex() {
      let index = this.formOption.column.findIndex((item) => {
        return item.prop == "useDisplay";
      });
      return index;
    },
    sexIndex() {
      return this.formOption.column.findIndex((item) => {
        return item.prop == "sex";
      });
    },
    selectRemoteIndex() {
      return this.formOption.column.findIndex((item) => {
        return item.prop == "selectRemote";
      });
    },
  },
  created() {
    // this.getFormData()
  },

  mounted() {},
  beforeDestroy() {
    // this.$destroy("pForm");
  },
  methods: {
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    rowDelete(row) {
      this.$confirm("你还真敢删我啊?", {
        confirmButtonText: "试试就逝世",
        cancelButtonText: "开玩笑的",
        type: "warning",
      })
        .then(() => {
          console.log("无事发生", row);
        })
        .then(() => {
          this.getListData(this.page);
          this.$message({
            type: "success",
            message: "操作成功!",
          });
        });
    },
    beforeOpen(done, type) {
      // 详情、编辑时你想做的事
      if (["edit", "view"].includes(type)) {
        // 模拟一个请求详情
        setTimeout(() => {
          this.form = {
            id: "123721738723",
            name: `我是详情的name`,
            sex: 0,
            useDisplay: "辣鸡数据",
            age: 24,
            isRadio: 1,
            radio: 1,
            checkbox: [1],
            selectButMultiple: [0, 1],
            cascader: [["zujian", "basic", "layout"]],
            upload: [
              {
                name: "http://www.liulongbin.top:3006/uploads/1658131824528_ba6bdfa4bd5643ceb17212dfe5a5eae4.jpg",
                url: "http://www.liulongbin.top:3006/uploads/1658131824528_ba6bdfa4bd5643ceb17212dfe5a5eae4.jpg",
              },
            ],
          };
        }, 1000);
      } else {
        // 新增时你想做的事
        this.form = {
          name: "我就想在新增的时候给name搞个默认值",
        };
      }
      done();
    },
    onLoad(page, params = {}) {
      console.log("onload", page);
      console.log("params", params);
      if (this.data.length != 0) {
        this.data = [];
      }
      for (let i = 0; i < 10; i++) {
        this.data.push({
          id: i + 1,
          name: `姓名${i + 1}`,
          sex: i % 2 == 0 ? 0 : 1,
          useDisplay: "辣鸡数据",
          age: i < 5 ? i + 20 : i + 10,
          isRadio: 1,
          radio: 1,
          selectButMultiple: [0, 1],
          checkbox: [1],
          cascader: ["zhinan", "shejiyuanze", "yizhi"],
          children: [],
        });
      }
      for (let i = 1; i < 50; i++) {
        this.data[1].children.push({
          id: i + 20,
          name: `姓名${i + 20}`,
          sex: i % 2 == 0 ? 0 : 1,
          selectButMultiple: [0, 1],
          useDisplay: "辣鸡数据",
          age: i < 20 ? i + 10 : i - 10,
          isRadio: 2,
          radio: 2,
          checkbox: [1, 2],
          cascader: ["zujian", "basic", "layout"],
        });
      }
      setTimeout(() => {
        this.loading = false;
        this.page.total = 233;
      }, 700);
      setTimeout(() => {
        this.option.column[this.useDisplayCrudIndex].display = true;
      }, 1000);
    },
    getFormData() {
      console.log("this.$refs.form   app", this.$refs.form);
      this.statesList = this.states.map((item) => {
        return { key: item, label: item };
      });
      this.formOption.column[this.selectRemoteIndex].dicData = this.statesList;
      setTimeout(() => {
        this.formOption.column[this.useDisplayIndex].display = true;
        this.formOption.column[this.sexIndex].dicData.push({
          label: "不告诉你哼",
          value: 3,
        });
      }, 1000);
    },
    clearForm() {
      this.form = {};
    },
    submit(form, done) {
      console.log("submit  表单提交了", form);
      setTimeout(() => {
        // 模拟请求，1秒后停止禁用，清除缓存和初始化表格
        this.form = {};
        done();
      }, 1000);
    },
    changeFormName() {
      this.form.name1 = "我是从父组件修改的姓名1";
    },
    changeFormValue() {
      this.form.age = 18;
    },
    selectRemoteMethod(key) {
      if (key === "") return;
      let options = [];
      this.formOption.column[this.selectRemoteIndex].loading = true;
      setTimeout(() => {
        if (key != "") {
          options = this.formOption.column[
            this.selectRemoteIndex
          ].dicData.filter((item) => {
            return item.label.toLowerCase().indexOf(key.toLowerCase()) > -1;
          });
          this.formOption.column[this.selectRemoteIndex].dicData = options;
          this.formOption.column[this.selectRemoteIndex].loading = false;
        }
      }, 1000);
    },
    refreshChange() {
      console.log("刷新");
      this.loading = true;
      this.getListData();
      this.loading = false;
    },
    test(row, index) {
      console.log("test  row", row);
      console.log("test  index", index);
      alert("你点了测试对吧,数据是" + JSON.stringify(row));
    },
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  height: 100%;
  text-align: left;
}
</style>
