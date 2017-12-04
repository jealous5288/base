//搜索部分配置
var SRuleJson = {
    SRule: {
        RULE_NAME: {
            tagName: "规则名称",
            maxLength: 50
        },
        GZLX: {
            type: "dict",
            dictConfig: {
                dictCode: "GZLX"
            },
            tagName: "规则类型"
        }
    }
};
//配置动态加载属性
var ModelRuleList_Propertys = {
    ModelName: "ModelRuleList", //模型名称
    url: "/rule/getAuthRuleList",  //请求列表数据的url 已自动添加了random不需要在加random
    limit: 10,            //分页页码
    searchJson: SRuleJson,
    SearchModelName: "SRule"
};
//规定表头
var columns = [
    {title: '规则名称', id: 'RULE_NAME', width: '100', align: 'center', renderer: "String"},
    {title: '规则类型', id: 'GZLX', width: '100', align: 'center', renderer: "String"},
    {title: '实现方式', id: 'SXFS', width: '100', align: 'center', renderer: "String"},
    {
        title: '最后修改时间',
        id: 'XGSJ',
        width: '50',
        align: 'center',
        renderer: "Date",
        format: "yyyy-MM-dd"
    }

];
