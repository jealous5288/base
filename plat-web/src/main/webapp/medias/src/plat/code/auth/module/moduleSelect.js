var modelModuleList;                          //模块列表对象
var modelName = GetQueryString("modelName");
var func = GetQueryString("func");        //回调函数
var ids = GetQueryString("ids");
$(function () {
    //初始化尺寸
    resizeTable();
    //列表模型
    modelModuleList = new BaseGridModel(ModelModuleList_Propertys);
    var mulchoseFlag = GetQueryString("mulchoseFlag");     //是否单选的标志
    if (!mulchoseFlag) {
        //是否多选
        modelModuleList.set("mulchose", true);
        //是否使用checkbox
        modelModuleList.set("checkbox", true);
    }
    modelModuleList.buildSearchView();
    if (mulchoseFlag) {
        //设置单双击事件
        modelModuleList.set("onRowDblClick", onRowDblClick);
    }
    //渲染列表
    modelModuleList.render();
    getSelected();
    //确认
    $("#confirm").click(function () {
        selectItem();
    });

});

//设置存在的id为选中状态
function getSelected() {
    if (ids) {
        var selectArr = ids.split(",");
        modelModuleList.setSelect(selectArr);
    }
}

//双击事件
function onRowDblClick(rowIndex, rowData, isSelected, event) {
    selectItem();
}

function selectItem() {
    var sel = modelModuleList.getSelect();
    if (sel.length > 0) {
        var ids = "";
        var names = "";
        for (var i = 0; i < sel.length; i++) {
            ids += sel[i].ID + ",";
            names += sel[i].MODULE_NAME + ",";
        }
        ids = ids.substring(0, ids.length - 1);
        names = names.substring(0, names.length - 1);
        var evalFunc = eval("getPrevWin()." + func);
        result = evalFunc(ids, names, modelName);
        if (result || typeof(result) == "undefined") {
            closeLayer(window);
        }
    } else {
        layer.alert("请选择一条数据");
    }
}


