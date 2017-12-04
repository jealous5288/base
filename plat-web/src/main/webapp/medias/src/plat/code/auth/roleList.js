var modelRoleList;       //角色列表对象
$(function () {
    pageAjax();
    //初始化尺寸
    resizeTable();
    //角色列表对象创建
    modelRoleList = new BaseGridModel(ModelRoleList_Propertys);
    //自定义列表搜索配置
    initTableSetting(modelRoleList, columns, SRoleJson);
    //用户列表对象搜索面板生成
    modelRoleList.buildSearchView();
    //设置双击事件
    modelRoleList.set("onRowDblClick", onRowDblClick);
    //渲染列表
    modelRoleList.render();
    //新增
    $("#add").click(function () {
        var url = "/role/roleEdit?type=xz";
        openStack(window, "新增角色", "medium", url);
    });
    //修改
    $("#edit").click(function () {
        var row = modelRoleList.getSelect();
        if (row.length > 0) {
            var url = "/role/roleEdit?type=xg&id=" + row[0].ID;
            openStack(window, "修改角色", "medium", url);
        } else {
            layer.alert("请选择一条待修改的数据");
        }
    });
    //删除
    $("#del").click(function () {
        var obj = modelRoleList.getSelect();//获取选中行的数据
        if (obj == null || obj == undefined || obj[0] == null) {
            layer.alert("请选择一条待删除的数据");
        } else {
            layer.confirm("确定要删除所选记录吗？", function (index) {
                $.ajax({
                    type: "post",
                    url: "/role/deleteRole?id=" + obj[0].ID,
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

    $("#resource").click(function () {
        var obj = modelRoleList.getSelect();//获取选中行的数据
        if (obj == null || obj == undefined || obj[0] == null) {
            layer.alert("未选择角色");
        } else if (obj[0].ROLE_TYPE != "1") {
            layer.alert("非系统角色，不可关联资源");
        } else {
            openStack(window, "设置角色资源", "tree", "/resource/roleResourceTreeSelect?roleId=" + obj[0].ID);
        }
    });
});

//双击事件函数
function onRowDblClick(rowIndex, rowData, isSelected, event) {
    openStack(window, "查看角色", "medium", "/role/roleEdit?type=ck&id=" + rowData.ID);
}

//列表刷新全局接口
function reloadTable(param) {
    if (param == null) {
        modelRoleList.set("postData", null);
    }
    modelRoleList.reloadGrid(param);
}

//关联要素回调函数
function glysSelectCallback(modelName, glys, gl_id, glType) {
    var gl_type;
    if (glType == "jg") {
        gl_type = 2;
    } else if (glType == "gw") {
        gl_type = 1;
    } else {
        gl_type = 3;
    }
    modelRoleList.getSearchModel().setValue("glys", glys);             //为搜索项赋值
    modelRoleList.getSearchModel().setValue("gl_id", gl_id);
    modelRoleList.getSearchModel().setValue("glType", gl_type);
}

