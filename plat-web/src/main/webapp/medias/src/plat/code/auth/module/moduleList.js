var modelModuleList;      //模块列表对象
$(function () {
    pageAjax();
    //初始化尺寸
    resizeTable();
    //模块列表对象创建
    modelModuleList = new BaseGridModel(ModelModuleList_Propertys);
    //自定义列表搜索配置
    initTableSetting(modelModuleList, columns, SModuleJson);
    //模块列表对象搜索面板生成
    modelModuleList.buildSearchView();
    //设置双击事件
    modelModuleList.set("onRowDblClick", onRowDblClick);
    //渲染列表
    modelModuleList.render();
    //新增
    $("#add").click(function () {
        openStack(window, "新增模块", "medium", "/module/moduleEdit?type=xz");
    });
    //修改
    $("#edit").click(function () {
        var row = modelModuleList.getSelect();
        if (row.length > 0) {
            openStack(window, "修改模块", "medium", "/module/moduleEdit?type=xg&id=" + row[0].ID);
        } else {
            layer.alert("请选择一条待修改的数据");
        }
    });
    //删除
    $("#del").click(function () {
        var obj = modelModuleList.getSelect();//获取选中行的数据
        if (obj == null || obj == undefined || obj[0] == null) {
            layer.alert("请选择一条待删除的数据");
        } else {
            if (isdel(obj[0].ID)) {
                layer.confirm("确定要删除所选记录吗？", function (index) {
                    $.ajax({
                        type: "post",
                        url: "/module/deleteModule?moduleId=" + obj[0].ID,
                        async: false,
                        success: function (ar) {
                            if (ar.success) {
                                reloadTable();
                                layer.alert("删除成功");
                            } else {
                                layer.alert(ar.msg);
                            }
                        }
                    });
                    layer.close(index);
                });
            }
        }
    });
    //维护系统功能权限
    $("#maintain").click(function () {
        openStack(window, "维护系统功能权限", "medium", "/authRole/authRoleList");
    });
});

//双击事件函数
function onRowDblClick(rowIndex, rowData, isSelected, event) {
    openStack(window, "查看模块", "medium", "/module/moduleEdit?type=ck&id=" + rowData.ID);
}

//列表刷新全局接口
function reloadTable(param) {
    if (param) {
        modelModuleList.set("postData", param);
    }
    modelModuleList.reloadGrid(param);
}

//删除前置验证   判断在不在其它地方使用
function isdel(id) {
    var flag = false;
    $.ajax({
        type: "post",
        url: "/module/getNamesByModuleId",
        data: {id: id},
        async: false,
        success: function (ar) {
            if (ar.success) {
                flag = true;
            } else {
                openStack(window, "该模块在以下要素中使用,不可删除", "small", "/message/commonMsg", ar.data);
            }
        }
    });
    return flag;
}
