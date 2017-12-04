//搜索部分配置
var SRoleJson = {
    SRole: {
        roleName: {
            tagName: "角色名称",
            canClear: true,
            maxLength: 50
        },
        roleCode: {
            tagName: "角色编码",
            canClear: true,
            maxLength: 20
        },
        roleType: {
            type: "dict",
            dictConfig: {
                dictCode: "JSLX"
            },
            tagName: "角色类型",
            canClear: true,
            maxLength: 50
        }
    }
};
//规定表头
var columns = [
    {title: '角色名称', id: 'ROLE_NAME', width: '20%', align: 'center', renderer: "String"},
    {title: '角色编码', id: 'ROLE_CODE', width: '15%', align: 'center', renderer: "String"},
    {title: '角色类型', id: 'ROLE_TYPE_NAME', width: '18%', align: 'center', renderer: "String"},
    {
        title: '最后修改时间',
        id: 'XGSJ',
        width: '15%',
        align: 'center',
        renderer: "Date",
        format: "yyyy-MM-dd"
    }
];
//角色列表主配置
var ModelRoleList_Propertys = {
    ModelName: "ModelRoleList", //模型名称
    url: "/role/getRoleList",  //请求列表数据的url 已自动添加了random不需要在加random
    columns: columns,
    searchJson: SRoleJson,
    SearchModelName: "SRole"
};
