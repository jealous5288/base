var modelTeacherList;
$(function () {

    //初始化尺寸
    resizeTable();

    pageAjax();
    var columns = [
        {title: '名称', id: 'TITLE', width: '160', align: 'center', renderer: "String"},
        {title: '流程状态', id: 'STATUS', width: '160', align: 'center', renderer: "String"},
        {title: '最后办理人', id: 'USER_NAME', width: '160', align: 'center', renderer: "String"},
        {title: '最后修改时间', id: 'XGSJ', width: '160', align: 'center', renderer: "Date", format: "yyyy-MM-dd HH:mm"}
    ];

    var SModelTeacherJson = {
        SModelTeacher: {
            name: {        //主键ID
                type: "normal",
                tagName: "姓名",
                maxLength: 20
            }
        }
    };
    //配置动态加载属性
    var ModelHtbaList_Propertys = {
        ModelName: "ModelTeacherList", //模型名称
        SearchModelName: "SModelTeacher",
        columns: columns,         //表头
        searchJson: SModelTeacherJson,
        url: "/teacher/getTeacherList",  //请求列表数据的url 已自动添加了random不需要在加random
        mulchose: true, //是否多选
        allPageChose: true //是否开启全页选择，未完全实现
    };

    //创建列表模型类
    modelTeacherList = new BaseGridModel(ModelHtbaList_Propertys);

    initTableSetting(modelTeacherList);

    modelTeacherList.buildSearchView();

    //设置双击事件
    modelTeacherList.set("onRowDblClick", function onRowDblClick(rowIndex, rowData, isSelected, event) {
        handleWorkflowByWiId(rowData.WF_INS_ID, "请假流程", {flowCode: "QJLC"}); //办理流程
    });

    //渲染页面
    modelTeacherList.render();

    $("#startFlow").click(function () {
        confirmWorkflowStart({title: "测试请假流程111", flowCode: "QJLC", type: "xz"});
    })
});

/**
 * 载入数据表格
 * @param param
 */
function reloadTable(param) {
    modelTeacherList.reloadGrid(param);
}