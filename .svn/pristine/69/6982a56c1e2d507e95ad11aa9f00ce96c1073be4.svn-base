var modelAuthRoleList;      //模块列表对象
$(function () {
    //初始化尺寸
    resizeTable();
    //模块列表对象创建
    modelAuthRoleList = new BaseGridModel(ModelAuthRoleList_Propertys);
    //模块列表对象搜索面板生成
    modelAuthRoleList.buildSearchView();
    //设置双击事件
    modelAuthRoleList.set("onRowDblClick", onRowDblClick);
    //渲染列表
    modelAuthRoleList.render();
    //新增
    $("#add").click(function () {
        openStack(window, "新增系统功能权限", "small", "/authRole/authRoleEdit?type=xz");
    });
    //修改
    $("#edit").click(function () {
        var row = modelAuthRoleList.getSelect();
        if (row.length > 0) {
            openStack(window, "修改系统功能权限", "small", "/authRole/authRoleEdit?type=xg&id=" + row[0].ID);
        } else {
            layer.alert("请选择一条待修改的数据");
        }
    });
    //删除
    $("#del").click(function () {
        var obj = modelAuthRoleList.getSelect();//获取选中行的数据
        if (obj == null || obj == undefined || obj[0] == null) {
            layer.alert("请选择一条待删除的数据");
        } else {
            layer.confirm("确定要删除所选记录吗？", function (index) {
                $.ajax({
                    type: "post",
                    url: "/authRole/delOrAbleAuthRole?authRoleId=" + obj[0].ID + "&type=0",
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
    });
});

//双击事件函数
function onRowDblClick(rowIndex, rowData, isSelected, event) {
    openStack(window, "查看系统功能权限", "small", "/authRole/authRoleEdit?type=ck&id=" + rowData.ID);
}

//列表刷新全局接口
function reloadTable(param) {
    if (param) {
        modelAuthRoleList.set("postData", param);
    }
    modelAuthRoleList.reloadGrid(param);
}
