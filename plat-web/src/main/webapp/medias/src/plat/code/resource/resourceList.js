var modelResourceList;         //资源列表对象
$(function () {
    //异步提示注册
    pageAjax();
    //初始化尺寸
    resizeTable();
    createResourceTree();
    //列表模型
    modelResourceList = new BaseGridModel(ModelResourceList_Propertys);
    //设置列表搜索区
    modelResourceList.buildSearchView();
    //设置双击事件
    if (!modelResourceList.get("mulchose")) {
        modelResourceList.set("onRowDblClick", function onRowDblClick(rowIndex, rowData, isSelected, event) {
            openStack(window, "查看" + getTypeName(rowData.TYPE), "medium", "/resource/resourceEdit?resourceType=" + rowData.TYPE + "&type=ck&id=" + rowData.ID);
        });
    }
    //渲染列表
    modelResourceList.render();
    //新增
    $("#add").click(function () {
        var sm = modelResourceList.getSearchModel(), url = "/resource/resourceTypeSelect";
        if (sm.get("parentId")) {
            url += "?parentId=" + sm.get("parentId") + "&parentName=" + encode(sm.get("parentName")) + "&parentType=" + sm.get("parentType");
        }
        openStack(window, "选择资源类型", "medium", url);
    });
    //修改
    $("#edit").click(function () {
        var row = modelResourceList.getSelect();
        if (row && row.length == 1) {
            openStack(window, "修改" + getTypeName(row[0].TYPE), "medium", "/resource/resourceEdit?resourceType=" + row[0].TYPE + "&type=xg&id=" + row[0].ID);
        } else {
            layer.alert("请选择一条待修改的数据");
        }
    });
    //删除
    $("#del").click(function () {
        var obj = modelResourceList.getSelect();//获取选中行的数据
        if (obj == null || obj.length != 1) {
            layer.alert("请选择一条待删除的数据");
        } else {
            var isParent = (obj[0].UTYPE == 1);
            layer.confirm("确定要删除所选记录吗？", function (index) {
                layer.close(index);
                $.ajax({
                    type: "post",
                    url: "/resource/delResource",
                    data: {id: obj[0].ID},
                    async: false,
                    success: function (ar) {
                        if (ar.success) {
                            var sm = modelResourceList.getSearchModel();
                            sm.setValue("parentId", "");
                            sm.setValue("parentName", "");
                            sm.setValue("parentType", "");
                            reloadTable();
                            createResourceTree();
                        } else {
                            layer.alert(ar.msg);
                        }
                    }
                });
            });
        }
    });
});

function createResourceTree() {
    $.ajax({
        url: "/resource/getRoleResourceTreeData",
        type: 'post',
        data: {treeHide: false},
        success: function (ar) {
            tree = $.fn.zTree.init($("#tree"), {
                data: {
                    simpleData: {
                        enable: true,
                        idKey: "id",
                        pIdKey: "pid",
                        rootPId: 0
                    }
                },
                callback: {
                    onClick: zTreeOnClick
                }
            }, ar);
        }
    })
}

function zTreeOnClick(event, treeId, treeNode) {
    $.getEle("SResource", "parentName").val(treeNode.name);
    modelResourceList.getSearchModel().setValue("parentId", treeNode.id);
    modelResourceList.getSearchModel().setValue("parentType", treeNode.type);
    //var param = [
    //    {zdName: "parentId", value:  treeNode.id}
    //];
    reloadTable();
}

//列表刷新全局接口
function reloadTable(param) {
    modelResourceList.reloadGrid(param);
}

function getTypeName(code) {
    var name = "";
    $.each(resourceDict, function (i, t) {
        if (t.code == code) {
            name = t.value;
            return false;
        }
    });
    return name;
}

