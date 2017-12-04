var modelRuleList;         //规则列表对象
$(function () {
    //初始化尺寸
    resizeTable();
    //列表模型
    modelRuleList = new BaseGridModel(ModelRuleList_Propertys);
    //设置表头
    modelRuleList.set("columns", columns);
    initTableSetting(modelRuleList, columns, SRuleJson);
    modelRuleList.buildSearchView();
    //设置双击事件
    modelRuleList.set("onRowDblClick", onRowDblClick);
    //渲染列表
    modelRuleList.render();
    //新增
    $("#add").click(function () {
        openStack(window, "新增规则", "medium", "/rule/authRuleEdit?type=xz");
    });
    //修改
    $("#edit").click(function () {
        var row = modelRuleList.getSelect();
        if (row.length > 0) {
            openStack(window, "修改规则", "medium", "/rule/authRuleEdit?type=xg&id=" + row[0].ID);
        } else {
            layer.msg("请选择一条待修改的数据", {icon: 0});
        }
    });
    //删除
    $("#del").click(function () {
        var obj = modelRuleList.getSelect();//获取选中行的数据
        if (obj == null || obj == undefined || obj[0] == null) {
            layer.alert("请选择一条待删除的数据");
        } else {
            if (isdel(obj[0].ID)) {
                layer.confirm("确定要删除所选记录吗？", function (index) {
                    $.ajax({
                        type: "post",
                        url: "/rule/delAuthRule",
                        data: {authRuleId: obj[0].ID},
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
});

//双击事件函数
function onRowDblClick(rowIndex, rowData, isSelected, event) {
    openStack(window, "查看规则", "medium", "/rule/authRuleEdit?type=ck&id=" + rowData.ID);
}

//列表刷新全局接口
function reloadTable(param) {
    if (param) {
        modelRuleList.set("postData", param);
    }
    modelRuleList.reloadGrid(param);
}

//删除前置验证 判断在不在其它地方使用
function isdel(id) {
    var flag = false;
    $.ajax({
        type: "post",
        url: "/rule/getRoleNameByRuleId",
        data: {id: id},
        async: false,
        success: function (ar) {
            if (ar.success) {
                flag = true;
            } else {
                openStack(window, "该规则在以下要素中使用,不可删除", "small", "/message/commonMsg", ar.data);
            }
        }
    });
    return flag;
}

