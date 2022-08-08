<template>
  <basic-container>
    <p-table :option="option" :tableData="data"> </p-table>
  </basic-container>
</template>

<script>
import pTable from "@/utils/CURD/p-table/p-table";
export default {
  name: "document",
  components: {
    pTable,
  },
  data() {
    return {
      option: {
        height: "auto",
        calcHeight: 30,
        border: true,
        index: true,
        addBtn: false,
        refreshBtn: false,
        searchBtn: false,
        menu: false,
        treeLazy: true,
        expandAll: true,
        column: [
          {
            label: "属性/方法",
            prop: "attribute",
            width: 300,
          },
          {
            label: "类型",
            prop: "type",
            width: 100,
          },
          {
            label: "用途/解释",
            prop: "usedBy",
            overHidden: true,
          },
          {
            label: "默认值/参数",
            prop: "defaultValue",
            overHidden: true,
          },
          {
            label: "可选值",
            prop: "options",
            overHidden: true,
          },
        ],
      },
      data: [
        {
          attribute: "form",
          type: "Object",
          defaultValue: "{}",
          usedBy: "增/改/查的表单数据源",
          children: [],
        },
        {
          attribute: "query",
          type: "Object",
          defaultValue: "{}",
          usedBy: "搜索栏的表单数据源,需要使用:query.sync的方式绑定",
        },
        {
          attribute: "tableData",
          type: "Array",
          defaultValue: "[]",
          usedBy: "表格数据源",
        },

        {
          attribute: "page",
          type: "Object",
          defaultValue:
            "{total: 0, pagerCount: 7,currentPage: 1, pageSize: 10, pageSizes: [10, 20, 30, 40, 50, 100],layout:'total,sizes,prev, pager, next, jumper',background: true,}",
          usedBy:
            "分页器配置的数据,total为总页数;currentPage为页数;pageSize为页码;pagerCount为超过多少条隐藏;pageSizes为每页显示个数选择器的选项设置;background为是否为分页按钮添加背景色",
          children: [],
        },
        {
          attribute: "loading",
          type: "Boolean",
          defaultValue: "false",
          usedBy: "表格加载状态",
          children: [],
        },
        {
          attribute: "permission",
          type: "Object",
          defaultValue:
            "{addBtn: true,delBtn: true,editBtn: true,viewBtn: true,}",
          usedBy: "增删查改按钮的权限，如不传入默认增删查改都有权限",
        },
        {
          attribute: ":beforeOpen",
          type: "Function",
          defaultValue: "done, type",
          usedBy:
            "打开表单弹窗前的回调，done为打开弹窗的回调，type为打开弹窗的类型",
        },
        {
          attribute: ":sortBy",
          type: "Function",
          defaultValue: "String/Array/Function(row, index)",
          usedBy:
            "指定数据按照哪个属性进行排序，仅当 sortable 设置为 true 且没有设置 sort-method 的时候有效。如果 sort-by 为数组，则先按照第 1 个属性排序，如果第 1 个相等，再按照第 2 个排序，以此类推",
        },
        {
          attribute: ":sortOrders",
          type: "Array",
          defaultValue: "['ascending', 'descending', null]",
          options:
            "数组中的元素需为以下三者之一：ascending 表示升序，descending 表示降序，null 表示还原为原始顺序",
        },
        {
          attribute: ":sortMethod",
          type: "Function",
          defaultValue: "-",
          usedBy:
            "对数据进行排序的时候使用的方法，仅当 sortable 设置为 true 的时候有效，需返回一个数字，和 Array.sort 表现一致",
        },
        {
          attribute: ":spanMethod",
          type: "Function",
          defaultValue: "Function({ row, column, rowIndex, columnIndex })",
          usedBy: "合并行或列的计算方法",
        },
        {
          attribute: ":summaryMethod",
          type: "Function",
          defaultValue: "Function({ columns, data })",
          usedBy: "自定义的合计计算方法,",
        },
        {
          attribute: ":on-filtered",
          type: "Function",
          defaultValue: "-",
          usedBy: "列显隐操作后的回调",
        },
        {
          attribute: "@on-load",
          type: "Function",
          defaultValue: "page, params",
          usedBy: "page为分页器的数据，params为搜索栏表单的数据",
        },
        {
          attribute: "@row-save",
          type: "Function",
          defaultValue: "form,done",
          usedBy:
            "新增类型表单弹窗保存后的回调，form为表单数据，done为关闭弹窗回调",
        },
        {
          attribute: "@row-update",
          type: "Function",
          defaultValue: "form,done",
          usedBy:
            "编辑类型表单弹窗保存后的回调，form为表单数据，done为关闭弹窗回调",
        },
        {
          attribute: "@row-delete",
          type: "Function",
          defaultValue: "row",
          usedBy: "row为当前行数据",
        },
        {
          attribute: "@search-change",
          type: "Function",
          defaultValue: "params, done",
          usedBy:
            "params为搜索栏表单返回的数据，done为停止搜索表单的禁用状态的回调",
        },
        {
          attribute: "@search-reset",
          type: "Function",
          defaultValue: "-",
          usedBy: "搜索表单重置后的回调",
        },
        {
          attribute: "@selection-change",
          type: "Function",
          defaultValue: "rows",
          usedBy: "rows为选中的数据数组",
        },
        {
          attribute: "@current-change",
          type: "Function",
          defaultValue: "currentPage",
          usedBy: "currentPage为选中的页码",
        },
        {
          attribute: "@size-change",
          type: "Function",
          defaultValue: "pageSize",
          usedBy: "pageSize为选中的页数",
        },
        {
          attribute: "@refresh-change",
          type: "Function",
          defaultValue: "refreshChange",
          usedBy: "点击刷新按钮回调",
        },
        {
          attribute: "@sort-change",
          type: "Function",
          defaultValue: "val",
          usedBy: "排序回调",
        },
        {
          attribute: "@row-click",
          type: "Function",
          defaultValue: "row, event",
          usedBy: "当某一行被点击时会触发该事件",
        },
        {
          attribute: "@row-dblclick",
          type: "Function",
          defaultValue: "row, event, column",
          usedBy: "当某一行被双击击时会触发该事件",
        },
        {
          attribute: "slot",
          usedBy: "插槽",
          children: [
            {
              attribute: "表格",
              usedBy: "与表格相关的插槽",
              children: [
                {
                  attribute: "表格字段插槽",
                  defaultValue: "row/index",
                  usedBy: "插槽名为对应的字段名",
                },
                {
                  attribute: "tableHeader",
                  defaultValue: "-",
                  usedBy: "表格头部预留的插槽，位于搜索栏和表头之间",
                },
                {
                  attribute: "tableFooter",
                  defaultValue: "-",
                  usedBy: "表格底部预留的插槽，位于表格底部与分页器之间",
                },
                {
                  attribute: "muneLeft",
                  defaultValue: "-",
                  usedBy: "表格上方操作栏左边的插槽",
                },
                {
                  attribute: "muneRight",
                  defaultValue: "-",
                  usedBy: "表格上方操作栏右边的插槽",
                },
                {
                  attribute: "expand",
                  defaultValue: "-",
                  usedBy: "开启行展开后，预留展示内容的插槽",
                },
                {
                  attribute: "menuBtn",
                  defaultValue: "row/index",
                  usedBy: "操作栏的插槽，位于操作按钮后面",
                },
                {
                  attribute: "empty",
                  defaultValue: "-",
                  usedBy: "表格空数据的插槽",
                },
              ],
            },
            {
              attribute: "表单",
              usedBy: "与表单相关的插槽",
              children: [
                {
                  attribute: "表单字段插槽",
                  defaultValue: "size/disabled",
                  usedBy: "插槽名为字段名+Form的格式",
                },
                {
                  attribute: "menuForm",
                  defaultValue: "size/disabled",
                  usedBy: "表单操作按钮预留的插槽",
                },
              ],
            },
            {
              attribute: "搜索栏",
              usedBy: "与搜索栏相关的插槽",
              children: [
                {
                  attribute: "搜索表单字段插槽",
                  defaultValue: "size/disabled",
                  usedBy: "插槽名为字段名+Search的格式",
                },
              ],
            },
            {
              attribute: "分页器",
              usedBy: "与分页器相关的插槽",
              children: [
                {
                  attribute: "page",
                  defaultValue: "-",
                  usedBy: "位于分页器左侧的插槽",
                },
              ],
            },
          ],
        },
        {
          attribute: "option",
          type: "Object",
          defaultValue: "",
          usedBy: "表格配置",
          children: [
            {
              attribute: "size",
              type: "String",
              defaultValue: "small",
              options: "medium / small / mini",
              usedBy: "表格样式尺寸",
            },
            {
              attribute: "labelWidth",
              type: "String | Number",
              defaultValue: "90",
              usedBy: "表单域标签的宽度",
            },
            {
              attribute: "labelPosition",
              type: "String",
              defaultValue: "left",
              options: "left / right / top",
              usedBy: "表单域标签的位置",
            },
            {
              attribute: "labelSuffix",
              type: "String",
              defaultValue: ":",
              usedBy: "表单域标签的后缀",
            },
            {
              attribute: "searchLabelSuffix",
              type: "String",
              defaultValue: ":",
              usedBy: "搜索栏表单域标签的后缀",
            },
            {
              attribute: "detail",
              type: "Boolean",
              defaultValue: "false",
              usedBy: "表单弹窗是否为详情模式",
            },
            {
              attribute: "index",
              type: "Boolean",
              defaultValue: "true",
              usedBy: "是否显示下标栏",
            },
            {
              attribute: "selection",
              type: "Boolean",
              defaultValue: "true",
              usedBy: "是否显示多选",
            },
            {
              attribute: "expand",
              type: "Boolean",
              defaultValue: "false",
              usedBy: "是否开启行展开（配合expand插槽显示内容）",
            },
            {
              attribute: "border",
              type: "Boolean",
              defaultValue: "true",
              usedBy: "是否带有纵向边框",
            },
            {
              attribute: "stripe",
              type: "Boolean",
              defaultValue: "false",
              usedBy: "是否为斑马纹表格",
            },

            {
              attribute: "height",
              type: "String | Number",
              defaultValue: "auto",
              usedBy:
                "表格高度,如传入‘auto’为计算得出的铺满可视区高度，传入指定高度即为指定高度",
            },
            {
              attribute: "maxHeight",
              type: "Number",
              defaultValue: "-",
              usedBy: "表格的最高高度",
            },
            {
              attribute: "calcHeight",
              type: "Number",
              defaultValue: "-",
              usedBy: "表格距离页面底部的距离",
            },
            {
              attribute: "headerAlign",
              type: "String",
              defaultValue: "center",
              options: "left / center /right",
              usedBy: "表头对齐方式",
            },
            {
              attribute: "columnAlign",
              type: "String",
              defaultValue: "center",
              options: "left / center /right",
              usedBy: "行内容对齐方式",
            },
            {
              attribute: "menu",
              type: "Boolean",
              defaultValue: "true",
              usedBy: "是否显示操作栏",
            },
            {
              attribute: "menuWidth",
              type: "Number",
              defaultValue: 120,
              usedBy: "操作栏宽度",
            },
            {
              attribute: "addBtn",
              type: "Boolean",
              defaultValue: "true",
              usedBy: "是否显示新增按钮",
            },
            {
              attribute: "delBtn",
              type: "Boolean",
              defaultValue: "true",
              usedBy: "是否显示删除按钮",
            },
            {
              attribute: "viewBtn",
              type: "Boolean",
              defaultValue: "true",
              usedBy: "是否显示查看按钮",
            },
            {
              attribute: "editBtn",
              type: "Boolean",
              defaultValue: "true",
              usedBy: "是否显示编辑按钮",
            },
            {
              attribute: "refreshBtn",
              type: "Boolean",
              defaultValue: "true",
              usedBy: "是否显示刷新按钮",
            },
            {
              attribute: "filterBtn",
              type: "Boolean",
              defaultValue: "false",
              usedBy: "是否显示列显隐按钮",
            },
            {
              attribute: "searchBtn",
              type: "Boolean",
              defaultValue: "true",
              usedBy: "是否显示搜索按钮",
            },
            {
              attribute: "fit",
              type: "Boolean",
              defaultValue: "true",
              usedBy: "列的宽度是否自撑开",
            },
            {
              attribute: "showHeader",
              type: "Boolean",
              defaultValue: "true",
              usedBy: "是否显示表头",
            },
            {
              attribute: "highlightCurrentRow",
              type: "Boolean",
              defaultValue: "false",
              usedBy: "是否要高亮当前行",
            },
            {
              attribute: "cellClassName",
              type: "Function | String",
              defaultValue:
                "Function({row, column, rowIndex, columnIndex})/String",
              usedBy:
                "单元格的 className 的回调方法，也可以使用字符串为所有单元格设置一个固定的 className。",
            },
            {
              attribute: "rowKey",
              type: "String",
              defaultValue: "id",
              usedBy: "行数据的 Key，用来优化 Table 的渲染；",
            },
            {
              attribute: "treeProps",
              type: "Object",
              defaultValue:
                "{ hasChildren: 'hasChildren', children: 'children' }",
              usedBy: "渲染嵌套数据(树表格)的配置选项",
            },
            {
              attribute: "treeLazy",
              type: "Boolean",
              defaultValue: "false",
              usedBy: "是否懒加载子节点数据",
            },
            {
              attribute: "emptyText",
              type: "String",
              defaultValue: "暂无数据",
              usedBy: "表格空数据时文字提示",
            },
            {
              attribute: "sumColumnList",
              type: "Array",
              defaultValue: "-",
              options: "{label: '',name: '', type: '',decimals: 2,}",
              usedBy:
                "属性配置需要计算的表格列配置,label为自定义前缀；name为字段对应的prop值，type有sum合计/ avg平均 /统计count;decimals为小数点后几位，默认2位",
            },
            {
              attribute: "column",
              type: "Array",
              defaultValue: "-",
              usedBy: "字段的配置数组",
              children: [
                {
                  attribute: "公共属性",
                  children: [
                    {
                      attribute: "label",
                      type: "String",
                      defaultValue: "-",
                      usedBy: "标题名称",
                    },
                    {
                      attribute: "prop",
                      type: "String",
                      defaultValue: "-",
                      usedBy: "列字段名称（必须保持唯一）",
                    },
                    {
                      attribute: "type",
                      type: "String",
                      defaultValue: "input",
                      options:
                        "input | textarea | password | number|radio | checkbox | select | cascader | switch | time | datetime | datetimerange | upload",
                      usedBy: "字段对应展示的组件类型",
                    },
                    {
                      attribute: "component",
                      type: "String",
                      defaultValue: "-",
                      usedBy:
                        "自定义组件的名字,可配合params对象属性传入绑定参数",
                    },
                    {
                      attribute: "params",
                      type: "Object",
                      defaultValue: "-",
                      usedBy:
                        "当使用自定义组件时可通过该属性传入绑定参数，配合component使用",
                    },
                    {
                      attribute: "children",
                      type: "Array",
                      defaultValue: "-",
                      usedBy:
                        "传入children即视为开启复杂表头，传入数组内容与配置字段一致，复杂表头对应的字段在表单里会从复杂表头字段下标开始插入",
                    },
                    {
                      attribute: "props",
                      type: "Object",
                      defaultValue:
                        "{label:'label',value:'value',children:'children'}",
                      usedBy: "参数配置项",
                    },
                    {
                      attribute: "rules",
                      type: "Array",
                      defaultValue: "-",
                      usedBy: "同elementui的表单校验规则",
                    },
                    {
                      attribute: "placeholder",
                      type: "String",
                      defaultValue: "请选择/请输入${Label}",
                      usedBy:
                        "提示语,如果在rules里有传入提示语，会默认用第一个提示语，如果没有配置rules，默认为请选择/请输入${Label}",
                    },
                    {
                      attribute: "order",
                      type: "Number",
                      defaultValue: "-",
                      usedBy: "更改字段表单排序，数值越大越靠前",
                    },
                    {
                      attribute: "size",
                      type: "String",
                      defaultValue: "small",
                      options: "medium / small / mini",
                      usedBy: "当前字段组件的大小",
                    },
                    {
                      attribute: "labelWidth",
                      type: "String | Number",
                      defaultValue: "90",
                      usedBy: "单字段的表单域标签的宽度",
                    },
                    {
                      attribute: "span",
                      type: "Number",
                      defaultValue: "12",
                      usedBy: "栅格占据的列数",
                    },
                    {
                      attribute: "offset",
                      type: "Number",
                      defaultValue: "0",
                      usedBy: "栅格左侧的间隔格数",
                    },
                    {
                      attribute: "push",
                      type: "Number",
                      defaultValue: "0",
                      usedBy: "栅格向右移动格数",
                    },
                    {
                      attribute: "pull",
                      type: "Number",
                      defaultValue: "0",
                      usedBy: "栅格向左移动格数",
                    },
                    {
                      attribute: "detail",
                      type: "Boolean",
                      defaultValue: "false",
                      usedBy: "该字段在表单是否为详情",
                    },
                    {
                      attribute: "addDetail",
                      type: "Boolean",
                      defaultValue: "false",
                      usedBy: "该字段在表单为新增时是否为详情",
                    },
                    {
                      attribute: "editDetail",
                      type: "Boolean",
                      defaultValue: "false",
                      usedBy: "该字段在表单为编辑时是否为详情",
                    },
                    {
                      attribute: "display",
                      type: "Boolean",
                      defaultValue: "true",
                      usedBy: "该字段在表单是否显示",
                    },
                    {
                      attribute: "addDisplay",
                      type: "Boolean",
                      defaultValue: "true",
                      usedBy: "该字段在表单为新增时是否显示",
                    },
                    {
                      attribute: "editDisplay",
                      type: "Boolean",
                      defaultValue: "true",
                      usedBy: "该字段在表单为编辑时是否显示",
                    },
                    {
                      attribute: "disabled",
                      type: "Boolean",
                      defaultValue: "false",
                      usedBy: "该字段在表单是否禁用",
                    },
                    {
                      attribute: "addDisabled",
                      type: "Boolean",
                      defaultValue: "false",
                      usedBy: "该字段在表单为新增时是否禁用",
                    },
                    {
                      attribute: "editDisabled",
                      type: "Boolean",
                      defaultValue: "false",
                      usedBy: "该字段在表单为编辑时是否禁用",
                    },
                    {
                      attribute: "fixed",
                      type: "Boolean",
                      defaultValue: "false",
                      usedBy: "是否固定列",
                    },
                    {
                      attribute: "dataType",
                      type: "String",
                      defaultValue: "-",
                      options: "string | number | array",
                      usedBy: "表单字段初始化时你要的数据类型",
                    },
                    {
                      attribute: "value",
                      type: "any",
                      defaultValue: "-",
                      usedBy: "表单初始化的时你想要赋的默认值",
                    },
                    {
                      attribute: "dicData",
                      type: "Array",
                      defaultValue: "-",
                      usedBy: "数据源",
                    },
                    {
                      attribute: "sortable",
                      type: "Boolean",
                      defaultValue: "false",
                      usedBy: "是否开启排序",
                    },
                    {
                      attribute: "showSummary",
                      type: "Boolean",
                      defaultValue: "false",
                      usedBy: "是否开启合计",
                    },
                    {
                      attribute: "search",
                      type: "Boolean",
                      defaultValue: "false",
                      usedBy: "该字段是否开启搜索",
                    },
                    {
                      attribute: "searchOrder",
                      type: "Number",
                      defaultValue: "-",
                      usedBy: "更改搜索字段表单排序，数值越大越靠前",
                    },
                    {
                      attribute: "searchSize",
                      type: "String",
                      defaultValue: "small",
                      options: "medium / small / mini",
                      usedBy: "搜索栏的当前字段组件的大小",
                    },
                    {
                      attribute: "searchSpan",
                      type: "Number",
                      defaultValue: "6",
                      usedBy: "搜索栏的栅格占据的列数",
                    },
                    {
                      attribute: "searchOffset",
                      type: "Number",
                      defaultValue: "0",
                      usedBy: "搜索栏的栅格左侧的间隔格数",
                    },
                    {
                      attribute: "searchPush",
                      type: "Number",
                      defaultValue: "0",
                      usedBy: "搜索栏的栅格向右移动格数",
                    },
                    {
                      attribute: "searchPull",
                      type: "Number",
                      defaultValue: "0",
                      usedBy: "搜索栏的栅格向左移动格数",
                    },
                    {
                      attribute: "searchLabelWidth",
                      type: "String | Number",
                      defaultValue: "90",
                      usedBy: "搜索栏当前字段的表单域标签的宽度",
                    },
                    {
                      attribute: "searchPlaceholder",
                      type: "String",
                      defaultValue: "请选择/请输入${Label}",
                      usedBy:
                        "提示语,如果在rules里有传入提示语，会默认用第一个提示语，如果没有配置rules，默认为请选择/请输入${Label}",
                    },
                    {
                      attribute: "searchValue",
                      type: "any",
                      defaultValue: "-",
                      usedBy: "搜索栏表单初始化的时你想要赋的默认值",
                    },
                  ],
                },
                {
                  attribute: "input",
                  usedBy: "输入框",
                  children: [
                    {
                      attribute: "maxlength",
                      type: "Number",
                      defaultValue: "-",
                      usedBy: "原生属性，最大输入长度",
                    },
                    {
                      attribute: "minlength",
                      type: "Number",
                      defaultValue: "-",
                      usedBy: "原生属性，最小输入长度",
                    },
                  ],
                },
                {
                  attribute: "textarea",
                  usedBy: "文本域",
                  children: [
                    {
                      attribute: "rows",
                      type: "Number",
                      defaultValue: "3",
                      usedBy: "文本域高度",
                    },
                    {
                      attribute: "autosize",
                      type: "Boolean | Object",
                      defaultValue: false,
                      usedBy: "自适应内容高度",
                    },
                    {
                      attribute: "minRows",
                      type: "Number",
                      defaultValue: "-",
                      usedBy: "文本域最低高度",
                    },
                    {
                      attribute: "maxRows",
                      type: "Number",
                      defaultValue: "-",
                      usedBy: "文本域最高高度",
                    },
                    {
                      attribute: "showWordLimit",
                      type: "Boolean",
                      defaultValue: "false",
                      usedBy: "是否显示输入字数统计",
                    },
                    {
                      attribute: "maxlength",
                      type: "Number",
                      defaultValue: "-",
                      usedBy: "原生属性，最大输入长度",
                    },
                    {
                      attribute: "minlength",
                      type: "Number",
                      defaultValue: "-",
                      usedBy: "原生属性，最小输入长度",
                    },
                  ],
                },
                {
                  attribute: "password",
                  usedBy: "密码输入框",
                },
                {
                  attribute: "number",
                  usedBy: "数字输入框",
                  children: [
                    {
                      attribute: "min",
                      type: "Number",
                      defaultValue: "-Infinity",
                      usedBy: "设置计数器允许的最小值",
                    },
                    {
                      attribute: "max",
                      type: "Number",
                      defaultValue: "Infinity",
                      usedBy: "设置计数器允许的最大值",
                    },
                    {
                      attribute: "precision",
                      type: "Number",
                      defaultValue: "2",
                      usedBy: "数值精度",
                    },
                  ],
                },
                {
                  attribute: "radio",
                  usedBy: "单选框",
                  children: [
                    {
                      attribute: "lableValueName",
                      type: "String",
                      defaultValue: "-",
                      usedBy: "指定选择的值对应的中文值的键名，不传不处理",
                    },
                    {
                      attribute: "border",
                      type: "Boolean",
                      defaultValue: "false",
                      usedBy: "是否显示边框",
                    },
                    {
                      attribute: "showType",
                      type: "String",
                      defaultValue: "-",
                      options: "button",
                      usedBy: "单选框是否为按钮样式",
                    },
                  ],
                },
                {
                  attribute: "checkbox",
                  usedBy: "多选框",
                  children: [
                    {
                      attribute: "min",
                      type: "Number",
                      defaultValue: "-",
                      usedBy: "可被勾选的 checkbox 的最小数量",
                    },
                    {
                      attribute: "max",
                      type: "Number",
                      defaultValue: "-",
                      usedBy: "可被勾选的 checkbox 的最大数量",
                    },
                  ],
                },
                {
                  attribute: "select",
                  usedBy: "下拉框",
                  children: [
                    {
                      attribute: "lableValueName",
                      type: "String",
                      defaultValue: "-",
                      usedBy: "指定选择的值对应的中文值的键名，不传不处理",
                    },
                    {
                      attribute: "filterable",
                      type: "Boolean",
                      defaultValue: "false",
                      usedBy: "是否可搜索",
                    },
                    {
                      attribute: "filterMethod",
                      type: "Function",
                      defaultValue: "-",
                      usedBy: "自定义搜索方法",
                    },
                    {
                      attribute: "remote",
                      type: "Boolean",
                      defaultValue: "false",
                      usedBy: "是否为远程搜索",
                    },
                    {
                      attribute: "remoteMethod",
                      type: "Function",
                      defaultValue: "-",
                      usedBy: "远程搜索方法",
                    },
                    {
                      attribute: "loading",
                      type: "Boolean",
                      defaultValue: "false",
                      usedBy: "是否正在从远程获取数据",
                    },
                    {
                      attribute: "allowCreate",
                      type: "Boolean",
                      defaultValue: "false",
                      usedBy: "是否允许用户创建新条目，需配合 filterable 使用",
                    },
                    {
                      attribute: "multiple",
                      type: "Boolean",
                      defaultValue: "false",
                      usedBy: "是否为多选",
                    },
                    {
                      attribute: "multipleLimit",
                      type: "Number",
                      defaultValue: "0",
                      usedBy: "多选时用户最多可以选择的项目数，为 0 则不限制",
                    },
                    {
                      attribute: "collapseTags",
                      type: "Boolean",
                      defaultValue: "false",
                      usedBy: "多选时是否将选中值按文字的形式展示",
                    },
                  ],
                },
                {
                  attribute: "cascader",
                  usedBy: "级联选择器",
                  children: [
                    {
                      attribute: "filterable",
                      type: "Boolean",
                      defaultValue: "false",
                      usedBy: "是否可搜索",
                    },
                    {
                      attribute: "filterMethod",
                      type: "Function",
                      defaultValue: "function(node, keyword)",
                      usedBy:
                        "自定义搜索逻辑；第一个参数是节点node，第二个参数是搜索关键词keyword，通过返回布尔值表示是否命中",
                    },
                    {
                      attribute: "collapseTags",
                      type: "Boolean",
                      defaultValue: "false",
                      usedBy: "多选模式下是否折叠Tag",
                    },
                    {
                      attribute: "separator",
                      type: "String",
                      defaultValue: "/",
                      usedBy: "选项分隔符",
                    },
                    {
                      attribute: "showAllLevels",
                      type: "Boolean",
                      defaultValue: "true",
                      usedBy: "输入框中是否显示选中值的完整路径",
                    },
                    {
                      attribute: "multiple",
                      type: "Boolean",
                      defaultValue: "false",
                      usedBy: "是否为多选",
                    },
                    {
                      attribute: "expandTrigger",
                      type: "String",
                      defaultValue: "click",
                      options: "click | hover",
                      usedBy: "次级菜单的展开方式",
                    },
                    {
                      attribute: "checkStrictly",
                      type: "Boolean",
                      defaultValue: "false",
                      usedBy: "是否严格的遵守父子节点不互相关联",
                    },
                    {
                      attribute: "lazy",
                      type: "Boolean",
                      defaultValue: "false",
                      usedBy: "是否动态加载子节点，需与 lazyLoad 方法结合使用",
                    },
                    {
                      attribute: "lazyLoad",
                      type: "Function",
                      defaultValue: "function(node, resolve)",
                      usedBy:
                        "node为当前点击的节点，resolve为数据加载完成的回调(必须调用)",
                    },
                  ],
                },
                {
                  attribute: "switch",
                  usedBy: "开关",
                  children: [
                    {
                      attribute: "activeColor",
                      type: "String",
                      defaultValue: "#409EFF",
                      usedBy: "switch 打开时的背景色",
                    },
                    {
                      attribute: "inactiveColor",
                      type: "String",
                      defaultValue: "#C0CCDA",
                      usedBy: "switch 关闭时的背景色",
                    },
                    {
                      attribute: "activeValue",
                      type: "String",
                      defaultValue: "true",
                      options: "boolean / string / number",
                      usedBy: "switch 打开时的值",
                    },
                    {
                      attribute: "inactiveValue",
                      type: "String",
                      defaultValue: "false",
                      options: "boolean / string / number",
                      usedBy: "switch 关闭时的值",
                    },
                  ],
                },
                {
                  attribute: "time",
                  usedBy: "时间选择器",
                  children: [
                    {
                      attribute: "valueFormat",
                      type: "String",
                      defaultValue: "yyyy-MM-dd HH:mm:ss",
                      usedBy: "绑定值的格式",
                    },
                    {
                      attribute: "format",
                      type: "String",
                      defaultValue: "yyyy-MM-dd HH:mm:ss",
                      usedBy: "绑定值的格式",
                    },
                    {
                      attribute: "isRange",
                      type: "Boolean",
                      defaultValue: "false",
                      usedBy: "是否为时间范围选择",
                    },
                    {
                      attribute: "arrowControl",
                      type: "Boolean",
                      defaultValue: "false",
                      usedBy: "是否使用箭头进行时间选择",
                    },
                    {
                      attribute: "rangeSeparator",
                      type: "String",
                      defaultValue: "至",
                      usedBy: "选择范围时的分隔符",
                    },
                    {
                      attribute: "startPlaceholder",
                      type: "String",
                      defaultValue: "开始时间",
                      usedBy: "范围选择时开始日期的占位内容",
                    },
                    {
                      attribute: "endPlaceholder",
                      type: "String",
                      defaultValue: "结束时间",
                      usedBy: "范围选择时结束日期的占位内容",
                    },
                    {
                      attribute: "props",
                      type: "Object",
                      defaultValue: "同elementUI的pickerOptions",
                    },
                  ],
                },
                {
                  attribute: "datetime",
                  usedBy: "日期时间选择器",
                  children: [
                    {
                      attribute: "valueFormat",
                      type: "String",
                      defaultValue: "yyyy-MM-dd HH:mm:ss",
                      usedBy: "绑定值的格式",
                    },
                    {
                      attribute: "format",
                      type: "String",
                      defaultValue: "yyyy-MM-dd HH:mm:ss",
                      usedBy: "绑定值的格式",
                    },
                    {
                      attribute: "defaultTime",
                      type: "String",
                      defaultValue: "12:00:00",
                      usedBy: "选中日期后的默认具体时刻",
                    },
                    {
                      attribute: "props",
                      type: "Object",
                      defaultValue: "今天 | 昨天 | 一周前",
                      usedBy: "快捷选项,同elementUI的pickerOptions",
                    },
                  ],
                },
                {
                  attribute: "datetimerange",
                  usedBy: "日期时间范围选择器",
                  children: [
                    {
                      attribute: "valueFormat",
                      type: "String",
                      defaultValue: "yyyy-MM-dd HH:mm:ss",
                      usedBy: "绑定值的格式",
                    },
                    {
                      attribute: "format",
                      type: "String",
                      defaultValue: "yyyy-MM-dd HH:mm:ss",
                      usedBy: "绑定值的格式",
                    },
                    {
                      attribute: "rangeSeparator",
                      type: "String",
                      defaultValue: "至",
                      usedBy: "选择范围时的分隔符",
                    },
                    {
                      attribute: "defaultTime",
                      type: "String",
                      defaultValue: "12:00:00",
                      usedBy: "选中日期后的默认具体时刻",
                    },
                    {
                      attribute: "props",
                      type: "Object",
                      defaultValue: "最近一周 | 最近一个月 | 最近三个月",
                      usedBy: "快捷选项,同elementUI的pickerOptions",
                    },
                  ],
                },
                {
                  attribute: "upload",
                  usedBy: "上传",
                  children: [
                    {
                      attribute: "action",
                      type: "String",
                      defaultValue: "#",
                      usedBy: "资源上传的地址",
                    },
                    {
                      attribute: "limit",
                      type: "Number",
                      defaultValue: "10",
                      usedBy: "最大允许上传个数",
                    },
                    {
                      attribute: "multiple",
                      type: "Boolean",
                      defaultValue: "false",
                      usedBy: "是否为多选",
                    },
                    {
                      attribute: "drag",
                      type: "Boolean",
                      defaultValue: "false",
                      usedBy: "是否启用拖拽上传",
                    },
                    {
                      attribute: "autoUpload",
                      type: "Boolean",
                      defaultValue: "true",
                      usedBy: "是否在选取文件后立即进行上传",
                    },
                    {
                      attribute: "listType",
                      type: "String",
                      defaultValue: "text",
                      options: "text/picture-img/picture-card",
                    },
                    {
                      attribute: "data",
                      type: "Object",
                      defaultValue: "-",
                      usedBy: "上传时附带的额外参数",
                    },
                    {
                      attribute: "headers",
                      type: "Object",
                      defaultValue: "-",
                      usedBy: "设置上传时的请求头",
                    },
                    {
                      attribute: "propsHttp",
                      type: "Object",
                      defaultValue: "{}",
                      usedBy: "上传时的配置",
                      children: [
                        {
                          attribute: "domain",
                          type: "String",
                          defaultValue: "-",
                          usedBy: "文件资源前缀，如域名前缀等，不需要不要传",
                        },
                        {
                          attribute: "res",
                          type: "String",
                          defaultValue: "-",
                          usedBy:
                            "结构体的层次，例如返回data:{url:'',name:''},则res配置为data",
                        },
                        {
                          attribute: "url",
                          type: "String",
                          defaultValue: "-",
                          usedBy: "上传服务器后返回资源的对应字段",
                        },
                        {
                          attribute: "name",
                          type: "String",
                          defaultValue: "-",
                          usedBy: "上传服务器后返回资源的名字对应字段",
                        },
                        {
                          attribute: "fileName",
                          type: "String",
                          defaultValue: "file",
                          usedBy: "上传文件流时的名称",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };
  },
  created() {
    this.dealWithData(this.data);
  },
  methods: {
    dealWithData(list) {
      list.forEach((item) => {
        item.id = Math.random();
        if (item.children && item.children.length) {
          this.dealWithData(item.children);
        }
      });
    },
  },
};
</script>