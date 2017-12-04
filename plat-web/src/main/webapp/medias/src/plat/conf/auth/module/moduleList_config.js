//搜索部分配置
var SModuleJson = {
    SModule: {
        moduleName: {
            tagName: "模块名称",
            maxLength: 50
        },
        moduleCode: {
            tagName: "模块编码",
            maxLength: 20
        }
    }
};
//规定表头
var columns = [
    {title: '模块名称', id: 'MODULE_NAME', width: '200', align: 'center', renderer: "String"},
    {title: '模块编码', id: 'MODULE_CODE', width: '100', align: 'center', renderer: "String"},
    {title: '关联页面', id: 'PAGENAMES', width: '300', align: 'center', renderer: "String"},
    {title: '拥有功能权限数目', id: 'AUTHCT', width: '100', align: 'center', renderer: "String"},
    {
        title: '修改时间',
        id: 'XGSJ',
        width: '',
        align: 'center',
        renderer: "Date",
        format: "yyyy-MM-dd"
    }
];
//模块列表主配置
var ModelModuleList_Propertys = {
    ModelName: "ModelModuleList", //模型名称
    url: "/module/getModuleList",
    columns: columns,
    searchJson: SModuleJson,
    SearchModelName: "SModule"
};
