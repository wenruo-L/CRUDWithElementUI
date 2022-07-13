export default {
    // table ============================
    //大小
    size: 'small',
    //是否显示菜单
    menu: true,
    // 菜单宽度
    menuWidth: 120,
    // 新增按钮
    addBtn: true,
    // 查看按钮
    viewBtn: true,
    // 删除按钮
    delBtn: true,
    // 编辑按钮
    editBtn: true,
    // 刷新按钮
    refreshBtn: true,
    // 展开/关闭搜索按钮
    searchBtn: true,
    // 内容过长是否悬浮显示
    overHidden: true,
    //  tree table =========================
    // 树表格需要的row-key
    rowKey: 'id',
    // 树表格需要的参数
    treeProps: {
        children: 'children',
        hasChildren: 'hasChildren'
    },
    // 树表格是否为懒加载
    treeLazy: false,
    //  column ================================
    // 表头对齐方式
    headerAlign: 'center',
    // 表格内容对齐方式
    columnAlign: 'left',
    // 列是否隐藏
    hide: false,
    //  其他
    // 首次加载表格是否折叠搜索栏
    showSearch: true
}