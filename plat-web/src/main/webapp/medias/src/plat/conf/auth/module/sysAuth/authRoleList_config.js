//搜索部分配置
var SAuthRoleJson = {
    SAuthRole: {
        authRoleName: {
            tagName: "权限名称",
            maxLength: 50
        },
        authRoleCode: {
            tagName: "权限编码",
            maxLength: 20
        }
    }
};
//规定表头
var columns = [
    {title: '权限名称', id: 'NAME', width: '200', align: 'center', renderer: "String"},
    {title: '权限编码', id: 'CODE', width: '200', align: 'center', renderer: "String"},
    {title: '简介', id: 'DESCRIPTION', width: '', align: 'center', renderer: "String"}
];
//模块列表主配置
var ModelAuthRoleList_Propertys = {
    ModelName: "ModelAuthRoleList", //模型名称
    url: "/authRole/getAuthRoleList",
    columns: columns,
    searchJson: SAuthRoleJson,
    SearchModelName: "SAuthRole",
    limit: 9
};
