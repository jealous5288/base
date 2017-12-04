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
    {title: '模块名称', id: 'MODULE_NAME', width: '180', align: 'center', renderer: "String"},
    {title: '模块编码', id: 'MODULE_CODE', width: '180', align: 'center', renderer: "String"},
    {title: '页面名称', id: 'NAME', width: '180', align: 'center', renderer: "String"},
    {title: '拥有功能权限数目', id: 'AUTHCT', width: '', align: 'center', renderer: "String"}
];
//配置动态加载属性
var ModelModuleList_Propertys = {
    ModelName: "ModelModuleList", //模型名称
    url: "/module/getModuleList",  //请求列表数据的url 已自动添加了random不需要在加random
    columns: columns,
    searchJson: SModuleJson,
    SearchModelName: "SModule",
    limit: 9
};
