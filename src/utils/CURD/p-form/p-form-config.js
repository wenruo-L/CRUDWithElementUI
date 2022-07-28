export default {
    // 组件名前缀
    key_component_name: "el-",
    // 大小
    size: "small",
    // labelWidth大小
    labelWidth: 90,
    labelSuffix: ':',
    muneAlign: 'center',
    // 提交按钮
    submitBtn: true,
    submitText: '保 存',
    submitText__search: '搜 索',
    // 重置按钮
    resetBtn: false,
    resetText: '重 置',
    // 取消按钮  
    // 注：重置和取消按钮的功能并不冲突，但一般是二选一显示，取消一般适用于表单弹窗，可以应用与关闭表单弹窗
    cancelBtn: true,
    cancelText: '取 消',
    // 操作按钮的span大小
    muneSpan: 24,
    searchMuneSpan: 24,
    // 是否为详情模式 该模式一般适用于查看详情
    detail: true,
    // 对齐方式
    labelPosition: 'left',
    //每个字段默认的span大小
    span: 12,
    searchSpan: 6,
    // 只读
    readonly: false,
    // 用于下拉框，单选，多选，级联等的label，value值选择
    props: {
        label: 'label',
        value: 'value',
        children: 'children'
    },
    // 栅格左侧的间隔格数
    offset: 0,
    // 栅格向右移动格数
    push: 0,
    // 栅格向左移动格数
    pull: 0,
    // 组件设置相关================================
    precision: 2,
    // select 作为 value 唯一标识的键名，绑定值为对象类型时必填
    valueKey: 'value',
    // 日期时间选择器快捷选项
    datetimePickerOptions: {
        shortcuts: [{
            text: '今天',
            onClick(picker) {
                picker.$emit('pick', new Date());
            }
        }, {
            text: '昨天',
            onClick(picker) {
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24);
                picker.$emit('pick', date);
            }
        }, {
            text: '一周前',
            onClick(picker) {
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', date);
            }
        }]
    },
    // 日期时间区间选择器快捷选项
    datetimerangePickerOptions: {
        shortcuts: [{
            text: '最近一周',
            onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
            }
        }, {
            text: '最近一个月',
            onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
            }
        }, {
            text: '最近三个月',
            onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit('pick', [start, end]);
            }
        }]
    },
    // upload 限制文件大小，单位M
    fileSize: 10,
    // upload 限制文件个数
    limit: 100,
    // upload 上传文件类型限制
    fileType: {
        img: /\.(gif|jpg|jpeg|png|GIF|JPG|PNG)/,
        video: /\.(swf|avi|flv|mpg|rm|mov|wav|asf|3gp|mkv|rmvb|ogg|mp4)/
    },
}