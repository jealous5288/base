//搜索部分配置
var SOrganJson = {
    SOrgan: {
        parent_name: {
            tagName: "上级机构",
            disabled: true,
            ifForm: false,
            spanShow: false
        },
        organ_name: {
            tagName: "机构名称",
            maxLength: 40
        },
        full_name: {
            tagName: "机构全称",
            maxLength: 40
        },
        organ_code: {
            tagName: "机构编码",
            maxLength: 40
        },
        parent_org: {       //上级机构id  隐藏字段
            display: false,
            disabled: true
        }
    }
};
//规定表头
var columns = [
    {title: '机构名称', id: 'ORGAN_NAME', width: '130', align: 'center', renderer: "String"},
    {title: '机构全称', id: 'FULL_NAME', width: '', align: 'center', renderer: "String"},
    {title: '机构编码', id: 'ORGAN_CODE', width: '130', align: 'center', renderer: "String"},
    {title: '上级机构', id: 'SJ_ORGAN', width: '250', align: 'center', renderer: "String"},
    {
        title: '是否启用', id: 'SFYX_ST', width: '100', align: 'center', renderer: "Boolean"
    }
];
//机构列表主配置
var OrganList_Propertys = {
    ModelName: "OrganList", //模型名称
    url: "getOrganList?hasDelData=true",  //请求列表数据的url 已自动添加了random不需要在加random
    columns: columns,
    searchJson: SOrganJson,
    SearchModelName: "SOrgan"
};
