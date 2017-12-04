var mainTree;    //ztree
var modelUserList;  //用户列表对象
$(function () {

    //打开加载中标志
    pageAjax();
    //实例化ztree
    mainTree = $.fn.zTree.init($("#tree"), config());
    //初始化尺寸
    resizeTable();
    //实例化用户列表
    modelUserList = new BaseGridModel(ModelUserList_Propertys);
    // 用户列表对象搜索面板生成
    modelUserList.buildSearchView();
    //设置双击事件
    modelUserList.set("onRowDblClick", onRowDblClick);
    //渲染列表
    modelUserList.render();
    //新增用户
    $("#add").click(function () {
        //当前机构树所选机构
        var organId = modelUserList.getSearchModel().get("organ_id");
        var organName;
        if (organId && organId != -1) {
            organName = $.getEle("SUser", "organName").val();
        }
        var url = "/user/userEdit?type=xz&mrjgid=" + organId + "&organName=" + encodeURI(encodeURI(organName));
        openStack(window, "新增用户", "medium", url);
    });
    //修改用户
    $("#edit").click(function () {
        var row = modelUserList.getSelect();
        if (row.length > 0) {
            openStack(window, "修改用户", "medium", "/user/userEdit?type=xg&id=" + row[0].ID);
        } else {
            layer.alert("请选择一条待修改的数据");
        }
    });
    //生效或停用
    $("#delOrAble").click(function () {
        var obj = modelUserList.getSelect();//获取选中行的数据
        if (obj == null || obj == undefined || obj[0] == null) {
            layer.msg("请选择一条待恢复/停用的数据", {icon: 0});
        } else {
            if (obj[0].SFKHF == "1") {
                layer.confirm("确定要恢复所选记录吗？", function (index) {
                    delOrAbleUser(obj[0].ID, 1);
                    layer.close(index);
                });
            } else {
                layer.confirm("确定要停用所选记录吗？", function (index) {
                    delOrAbleUser(obj[0].ID, 2);
                    layer.close(index);
                });
            }
        }
    });
    //删除
    $("#delete").click(function () {
        var obj = modelUserList.getSelect();//获取选中行的数据
        if (obj == null || obj == undefined || obj[0] == null) {
            layer.msg("请选择一条待删除的数据", {icon: 0});
        } else {
            isUserGlxx(obj[0].ID);
        }
    });
});

//双击事件
function onRowDblClick(rowIndex, rowData, isSelected, event) {
    openStack(window, "查看用户", "medium", "/user/userEdit?type=ck&id=" + rowData.ID);
}

//刷新全局接口
function reloadTable(param) {
    if (param) {
        modelUserList.set("postData", param);
    }
    modelUserList.reloadGrid();
}

//用户关联信息
function isUserGlxx(id) {
    $.ajax({
        type: "post",
        data: {id: id},
        url: "/user/userGlxx",
        dataType: "json",
        success: function (ar) {
            if (ar.success) {
                if (ar.data.role.length > 0) {
                    openStack(window, "用户关联信息", "medium", "/organ/organLinkList?func=isDel&id=" + id, ar.data);
                    return false;
                } else {
                    layer.confirm("确定要删除所选记录吗？", function (index) {
                        delOrAbleUser(id, 0);   //0删除
                        layer.close(index);
                    });
                }
            } else {
                layer.alert(ar.msg);
            }
        }
    });
}

//删除
function isDel() {
    delOrAbleUser(id, 0);   //0删除
}

//删除或恢复
function delOrAbleUser(id, type) {   //0删除，1恢复
    $.ajax({
        type: "post",
        url: "/user/delOrAbleUser",
        data: {userId: id, type: type},
        dataType: "json",
        success: function (ar) {
            if (ar.success) {
                layer.alert("操作成功");
                reloadTable();
            } else {
                layer.alert(ar.msg);
            }
        }
    });
}


//异步加载树默认展开节点
var firstAsyncSuccessFlag = 0;

function zTreeOnAsyncSuccess(event, treeId, msg) {
    if (firstAsyncSuccessFlag == 0) {
        try {
            //调用默认展开第一个结点
            var nodes = mainTree.getNodes();
            mainTree.expandNode(nodes[0], true);
            firstAsyncSuccessFlag = 1;
            closeLoading();
        } catch (err) {
        }
    }
}

//zTree配置
function config() {
    var url = "/tree/organTree?type=1&hasTop=false&hasDelData=true";      //type=1机构树，hasTop是否有顶级机构
    var setting = {
        data: {
            simpleData: {
                enable: true,
                idKey: "handleId",
                pIdKey: "pId",
                rootPId: 0
            }
        },
        async: {enable: true, type: "post", url: url, autoParam: ["id", "lx"]},
        view: {
            selectedMulti: false,
            fontCss: setFontCss
        },
        callback: {
            onClick: zTreeOnClick,
            onAsyncSuccess: zTreeOnAsyncSuccess
        }
    };
    if (!(!-[1,] && !window.XMLHttpRequest)) {         //不是IE6
        setting.view.addHoverDom = addHoverDom;
        setting.view.removeHoverDom = removeHoverDom;
    } else {
        setting.view.expandSpeed = "";
    }
    return setting;
}

//设置节点样式
function setFontCss(treeId, treeNode) {
    if (treeNode.sfkhf == "1") {
        return {color: "red"};
    }
}

//ztree节点点击事件
function zTreeOnClick(event, treeId, treeNode) {
    var param;
    if (treeNode.id == 0) {              //后台可以做处理，机构id为0是查全部
        $.getEle("SUser", "organName").val("");
        modelUserList.getSearchModel().setValue("organ_id", "");
        modelUserList.set("postData", null);
    } else if (treeNode.id == -1) {           //无组织-用户节点
        $.getEle("SUser", "organName").val(treeNode.name);
        modelUserList.getSearchModel().setValue("organ_id", treeNode.id);
        param = [
            {zdName: "organ_id", value: treeNode.id}
        ];
    } else {
        $.getEle("SUser", "organName").val(treeNode.name);
        modelUserList.getSearchModel().setValue("organ_id", treeNode.id);
        param = [
            {zdName: "organ_id", value: treeNode.id}
        ];
    }
    reloadTable(param);
}

//在树节点后添加按钮事件
function addHoverDom(treeId, treeNode) {
    if (treeNode.id != 0 && treeNode.sfkhf != "1" && treeNode.id != -1) {
        var sObj = $("#" + treeNode.tId + "_span");
        if (treeNode.editNameFlag || $("#addBtn_" + treeNode.id).length > 0) return;
        var addStr = "<span class='button add' id='addBtn_" + treeNode.id
            + "' title='新增' onfocus='this.blur();'></span>";
        sObj.append(addStr);
        var btn = $("#addBtn_" + treeNode.id);
        if (btn) {
            btn.bind("click", function () {  //getParrentOrgan
                var organName = treeNode.name;
                var organId = treeNode.id;
                var url = "/user/userEdit?type=xz&organId=" + organId + "&organName=" + encodeURI(encodeURI(organName));
                openStack(window, "新增用户", "medium", url);
            });
        }
    }
}

//移除树节点后添加按钮的事件
function removeHoverDom(treeId, treeNode) {
    $("#addBtn_" + treeNode.id).unbind().remove();
}

