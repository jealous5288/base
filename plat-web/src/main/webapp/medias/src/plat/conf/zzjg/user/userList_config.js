//搜索部分配置
var SUserJson = {
    SUser: {
        organName: {
            tagName: "所属机构",
            disabled: true,
            ifForm: false,
            spanShow: false
        },
        organ_id: {              //机构id，隐藏字段
            display: false,
            disabled: true
        },
        user_name: {
            tagName: "用户名称",
            maxLength: 40
        }
    }
};
//规定表头
var columns = [
    {title: '用户名称', id: 'USER_NAME', width: '', align: 'center', renderer: "String"},
    {title: '登录账号', id: 'LOGIN_NAME', width: '20%', align: 'center', renderer: "String"},
    {title: '创建时间', id: 'CJSJ', width: '20%', align: 'center', renderer: "Date", format: "yyyy-MM-dd"},
    {title: '是否启用', id: 'SFYX_ST', width: '15%', align: 'center', renderer: "Boolean"}
];
//用户列表主配置
var ModelUserList_Propertys = {
    ModelName: "ModelUserList", //模型名称
    url: "getUserList?hasDelData=true",  //请求列表数据的url 已自动添加了random不需要在加randon
    columns: columns,
    searchJson: SUserJson,
    SearchModelName: "SUser",
    colSetting: [60, 160, 60, 160, 60, 160]
};
