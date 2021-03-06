var modelDictList;
var buttons;
$(function () {
    pageAjax();
    //初始化table尺寸
    resizeTable();
    //初始化buttongroup
    //按钮区配置
    //默认显示
    //个性控制的，比如组织机构中，点击删除的数据是恢复，点击未删除的数据是删除等.....
    var buttonArr = [
        {
            id: "add",
            name: "新增",
            icon: "&#xe62a;",
            onClick: add              //可以是方法引用，也可以是方法字符串名称
        },
        {
            id: "edit",
            name: "修改",
            icon: "&#xe605;",
            onClick: "edit"
        },
        {
            id: "del",
            name: "删除",
            icon: "&#xe606;",
            onClick: "del"
        },
        {
            id: "allJspath",
            name: "生成所有字典",
            icon: "&#xe62a;",
            onClick: "allJspath"
        }
    ];
    //存在默认配置
    var buttonsJson = {
        tag: "._rx_grid_control",
        tpl: null,
        param: {},
        title: null,
        buttons: buttonArr,
        beforeInit: function (param) {
            return true
        },
        onInit: function (param) {
        }
    };
    buttons = RX.button.init($("#text"), buttonsJson);

    //列表模型
    modelDictList = new BaseGridModel(ModelDictList_Propertys);
    new initTableSetting(modelDictList, columns, SDictJson);
    modelDictList.buildSearchView();
    //设置双击事件
    modelDictList.set("onRowDblClick", onRowDblClick);
    //渲染列表
    modelDictList.render();

    ////新增
    //$("#add").click(function () {
    //    var url = "/dict/dictEdit?type=xz";
    //    openStack(window, "新增字典", "medium", url);
    //});
    //
    ////修改
    //$("#edit").click(function () {
    //    var rowData = modelDictList.getSelect();//获取选中行的数据
    //    if (rowData && rowData.length == 1) {
    //        var url = "/dict/dictEdit?type=xg&dictId=" + rowData[0].ID;
    //        openStack(window, "修改字典", "medium", url);
    //    } else {
    //        layer.alert("请选择一条待修改的数据");
    //    }
    //});
    //var date1 = new Date();
    //var date2;
    //var flag = true;
    ////while(flag){
    ////    date2 = new Date();
    ////    if(date2 - date1 > 10000){
    ////        flag = false;
    ////    }
    ////}
    //
    ////删除
    //$("#del").click(function () {
    //    var rowData = modelDictList.getSelect();//获取选中行的数据
    //    if (rowData.length > 0) {
    //        layer.confirm("确定要删除所选记录吗？", function (index) {
    //            $.ajax({
    //                type: "post",
    //                url: "/dict/deleteDict?dictId=" + rowData[0].ID,
    //                async: false,
    //                success: function (ar) {
    //                    if (ar.success) {
    //                        layer.alert("删除成功");
    //                        reloadTable();
    //                    } else {
    //                        layer.alert(ar.msg);
    //                    }
    //                }
    //            });
    //            layer.close(index);
    //        });
    //    } else {
    //        layer.alert("请选择一条待删除的数据");
    //    }
    //});
    //
    ////重新生成所有字典文件
    //$("#allJspath").click(function () {
    //    $.ajax({
    //        type: "get",
    //        url: "/jscache/allJspath?random=" + Math.random(),
    //        async: false,
    //        success: function (ar) {
    //            if (ar.success) {
    //                layer.alert("生成成功");
    //            } else {
    //                layer.alert(ar.msg);
    //            }
    //        }
    //    });
    //})
});

//noinspection JSUnusedLocalSymbols
function onRowDblClick(rowIndex, rowData, isSelected, event) {   //此处未使用的参数不能省略
    openStack(window, "查看字典", "medium", "/dict/dictEdit?type=ck&dictId=" + rowData.ID);
}

function reloadTable(param) {
    modelDictList.reloadGrid(param);
}

//新增
function add() {
    var url = "/dict/dictEdit?type=xz";
    openStack(window, "新增字典", "medium", url);
}

//修改
function edit() {
    var rowData = modelDictList.getSelect();//获取选中行的数据
    if (rowData && rowData.length == 1) {
        var url = "/dict/dictEdit?type=xg&dictId=" + rowData[0].ID;
        openStack(window, "修改字典", "medium", url);
    } else {
        layer.alert("请选择一条待修改的数据");
    }
}

//删除
function del() {
    var rowData = modelDictList.getSelect();//获取选中行的数据
    if (rowData.length > 0) {
        layer.confirm("确定要删除所选记录吗？", function (index) {
            $.ajax({
                type: "post",
                url: "/dict/deleteDict?dictId=" + rowData[0].ID,
                async: false,
                success: function (ar) {
                    if (ar.success) {
                        layer.alert("删除成功");
                        reloadTable();
                    } else {
                        layer.alert(ar.msg);
                    }
                }
            });
            layer.close(index);
        });
    } else {
        layer.alert("请选择一条待删除的数据");
    }
}

//生成字典项
function allJspath() {
    $.ajax({
        type: "get",
        url: "/jscache/allJspath?random=" + Math.random(),
        async: false,
        success: function (ar) {
            if (ar.success) {
                layer.alert("生成成功");
            } else {
                layer.alert(ar.msg);
            }
        }
    });
}



