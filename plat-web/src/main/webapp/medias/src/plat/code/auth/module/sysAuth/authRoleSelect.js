var modelAuthRoleList;      //模块列表对象
var func = GetQueryString("func");
var ids = GetQueryString("ids");
var names = decodeURI(decodeURI(GetQueryString("names")));
var codes = GetQueryString("codes");
var type = GetQueryString("type");  //从模块设计进入
$(function () {
    //初始化尺寸
    resizeTable();
    //模块列表对象创建
    modelAuthRoleList = new BaseGridModel(ModelAuthRoleList_Propertys);
    //设置过滤项
    modelAuthRoleList.set("dischose", true);
    modelAuthRoleList.set("disObject", {name: (names ? names.split(",") : []), code: (codes ? codes.split(",") : [])});
    //模块列表对象搜索面板生成
    modelAuthRoleList.buildSearchView();
    //渲染列表
    modelAuthRoleList.render();
    //确认
    $("#confirm").click(function () {
        var sel = modelAuthRoleList.getSelect();
        var selArray = [];
        for (var i = 0; i < sel.length; i++) {
            if (type) {
                selArray.push(sel[i].ID);
            } else {
                selArray.push({
                    id: null,
                    name: sel[i].NAME,
                    code: sel[i].CODE,
                    description: sel[i].DESCRIPTION,
                    moduleId: null,
                    authroleId: sel[i].ID,
                    type: 1,
                    sfyx_st: "VALID"
                });
            }
        }
        var evalFunc = eval("getPrevWin()." + func);
        result = evalFunc(selArray);
        if (result || typeof(result) == "undefined") {
            closeLayer(window);
        }
    });
});

//列表刷新全局接口
function reloadTable(param) {
    if (param) {
        modelAuthRoleList.set("postData", param);
    }
    modelAuthRoleList.reloadGrid(param);
}
