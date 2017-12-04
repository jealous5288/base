var mainTree; //主体树对象
var organList; //机构列表对象
$(function () {
    $(".rightBox").width($(window).width() - 205);
    $(window).resize(function () {
        $(".rightBox").width($(window).width() - 205);
    });
    pageAjax();
    //实例化ztree对象
    mainTree = $.fn.zTree.init($("#tree"), config());
    //初始化尺寸
    resizeTable();
    //机构列表对象创建
    organList = new BaseGridModel(OrganList_Propertys);
    //自定义列表搜索配置
    initTableSetting(organList, columns, SOrganJson);
    //机构列表对象搜索面板生成
    organList.buildSearchView();
    //设置单双击事件
    organList.set("onRowDblClick", onRowDblClick);
    //渲染列表
    organList.render();
    //恢复或停用
    $("#delOrAble").click(function () {
            var obj = organList.getSelect();//获取选中行的数据
            if (obj == null || obj == undefined || obj[0] == null) {
                layer.msg("请选择一条待恢复/停用的数据", {icon: 0});
            } else {
                if (obj[0].SFKHF == "1") {
                    layer.confirm("确定要恢复所选记录吗？", function (index) {
                        delOrAbleOrgan(obj[0].ID, 1);
                        layer.close(index);
                    });
                } else {
                    layer.confirm("确定要停用所选记录吗？", function (index) {
                        delOrAbleOrgan(obj[0].ID, 2);
                        layer.close(index);
                    });
                }
            }
        }
    );
    //删除
    $("#del").click(function () {
        var obj = organList.getSelect();//获取选中行的数据
        if (obj == null || obj == undefined || obj[0] == null) {
            layer.msg("请选择一条待删除的数据", {icon: 0});
            return false;
        } else {
            isOrganGlxx(obj[0].ID);
        }
    });
    //新增
    $("#add").click(function () {
        var sjbmid = organList.getSearchModel().get("parent_org");
        var sjbmmc = $.getEle("SOrgan", "parent_name").val();
        addOrgan(sjbmid, sjbmmc);
    });
    //修改
    $("#edit").click(function () {
        var row = organList.getSelect();
        if (row.length > 0) {
            if (row[0].SFKHF == 1) {
                layer.alert("该数据已停用，不可修改");
                return false;
            }
            openStack(window, "修改机构", "medium", "/organ/organEdit?type=xg&id=" + row[0].ID);
        } else {
            layer.alert("请选择一条待修改的数据");
        }
    });
});

//双击事件
function onRowDblClick(rowIndex, rowData, isSelected, event) {
    openStack(window, "查看机构信息", "medium", "/organ/organEdit?type=ck&id=" + rowData.ID);
}

//列表刷新全局接口
function reloadTable(param) {
    if (param) {
        organList.set("postData", param);
    }
    organList.reloadGrid();
}

//删除或恢复机构
function delOrAbleOrgan(id, type, newOrganId) {
    $.ajax({
        type: "post",
        url: "/organ/delOrAbleOrgan",
        data: {organId: id, type: type, newOrganId: newOrganId},
        dataType: "json",
        success: function (ar) {
            if (ar.success) {
                layer.alert("操作成功");
                reLoadPartentNode();
                reloadTable();
            } else {
                layer.alert(ar.msg);
            }
        }
    });
}

//查看组织关联信息
function isOrganGlxx(id) {
    $.ajax({
        type: "post",
        url: "/organ/organGlxx",
        data: {id: id, hasDelData: true},
        dataType: "json",
        success: function (ar) {
            if (ar.success) {             //设置为弹出层，显示关联数据
                if (ar.data.organ.length == 0 && (ar.data.user.length == 0)) {
                    if (_top.isPostExist && ar.data.post.length > 0) {
                        confirmCascadeOrgan(id, ar.data);
                        return false;
                    }
                    if (ar.data.role.length > 0) {
                        openStack(window, "机构关联信息", "medium", "/organ/organLinkList?func=isDel&id=" + id, ar.data);
                        return false;
                    }
                    layer.confirm("确定要删除所选记录吗？", function (index) {
                        delOrAbleOrgan(id, 0);   //0删除
                        layer.close(index);
                    });
                } else {
                    confirmCascadeOrgan(id, ar.data);
                }
            } else {
                layer.alert(ar.msg);
            }
        }
    });
}

function confirmCascadeOrgan(id, data) {
    if (_top.deleteCascadeOrgan) {
        openStack(window, "机构关联信息", "medium", "/organ/organLinkList?func=isDel&id=" + id + "&isNewOrgan=true", data);
    } else {
        var str = "";
        if (data.organ.length > 0) {
            str += "机构，";
        }
        if (data.post.length > 0) {
            str += "岗位，";
        }
        if (data.user.length > 0) {
            str += "用户，";
        }
        str = str.substring(0, str.length - 1);
        layer.alert("该机构下有" + str + "，不可删除");
    }
}

//增加机构
function addOrgan(sjbmid, sjbmmc) {
    var url = "/organ/organEdit?type=xz&sjbmid=" + sjbmid + "&sjbmmc=" + encodeURI(encodeURI(sjbmmc));
    openStack(window, "新增机构", "medium", url);
}

//弹出关联信息回调函数
function isDel(id, newOrganId) {
    delOrAbleOrgan(id, 0, newOrganId);
}

//zTree的配置
function config() {
    var url = "/tree/organTree?type=1&hasTop=false&hasDelData=true";
    var setting = {
        data: {
            simpleData: {
                enable: true,
                idKey: "handleId",
                pIdKey: "pId",
                rootPId: 0
            }
        },
        async: {
            enable: true, type: "post", url: url,
            autoParam: ["id", "lx"]
        },
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

//刷新树父节点方法
function reLoadPartentNode() {
    mainTree = $.fn.zTree.init($("#tree"), config());
    firstAsyncSuccessFlag = 0; //设置标志位为0
}

//树节点单击事件
function zTreeOnClick(event, treeId, treeNode) {
    if (treeNode.id == 0) {
        $.getEle("SOrgan", "parent_name").val("");
        organList.getSearchModel().setValue("parent_org", "");
        organList.set("postData", null);
        reloadTable();
    } else {
        $.getEle("SOrgan", "parent_name").val(treeNode.name);
        organList.getSearchModel().setValue("parent_org", treeNode.id);
        var param = [
            {zdName: "parent_org", value: treeNode.id}
        ];
        reloadTable(param);
    }
}

//设置节点样式
function setFontCss(treeId, treeNode) {
    if (treeNode.sfkhf == "1") {
        return {color: "red"};
    }
    return null;
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

//在树节点后添加按钮事件
function addHoverDom(treeId, treeNode) {
    var sObj = $("#" + treeNode.tId + "_span");
    if (treeNode.editNameFlag || $("#addBtn_" + treeNode.id).length > 0 || $("#stopBtn_" + treeNode.id).length > 0
        || $("#ableBtn_" + treeNode.id).length > 0 || $("#editBtn_" + treeNode.id).length > 0) return;
    if (treeNode.sfyx_st == 1) {
        var addStr = "<span class='button add' id='addBtn_" + treeNode.id
            + "' title='新增' onfocus='this.blur();'></span>";
        sObj.append(addStr);
        var btn = $("#addBtn_" + treeNode.id);
        var organId = treeNode.id;
        var organName = "";
        if (organId) {
            organName = treeNode.name
        } else {
            organId = null;
        }
        if (btn) {
            btn.bind("click", function () {
                addOrgan(organId, organName);
            });
        }
    }
    if (treeNode.id != 0) {       //如果不是  顶级"机构"
        if (treeNode.sfkhf == 1) {      //恢复
            var ableStr = "<span class='button recover' id='ableBtn_" + treeNode.id
                + "' title='恢复' onfocus='this.blur();'></span>";
            sObj.append(ableStr);
            var ableBtn = $("#ableBtn_" + treeNode.id);
            if (ableBtn) {
                ableBtn.bind("click", function () {
                    layer.confirm("确定要恢复所选记录吗？", function (index) {
                        delOrAbleOrgan(treeNode.id, 1);
                        layer.close(index);
                    });
                });
            }
        } else {  //停用
            var stopStr = "<span class='button stop' id='stopBtn_" + treeNode.id
                + "' title='停用' onfocus='this.blur();'></span>";
            sObj.append(stopStr);
            var stopBtn = $("#stopBtn_" + treeNode.id);
            if (stopBtn) {
                stopBtn.bind("click", function () {
                    layer.confirm("确定要停用所选记录吗？", function (index) {
                        delOrAbleOrgan(treeNode.id, 2);
                        layer.close(index);
                    });
                });
            }
            var editStr = "<span class='button edit' id='editBtn_" + treeNode.id
                + "' title='修改' onfocus='this.blur();'></span>";
            sObj.append(editStr);
            var editBtn = $("#editBtn_" + treeNode.id);
            if (editBtn) {
                editBtn.bind("click", function () {
                    openStack(window, "修改机构", "medium", "/organ/organEdit?type=xg&id=" + treeNode.id);
                });
            }
        }
    }
}

//移除事件
function removeHoverDom(treeId, treeNode) {
    $("#addBtn_" + treeNode.id).unbind().remove();
    $("#stopBtn_" + treeNode.id).unbind().remove();
    $("#ableBtn_" + treeNode.id).unbind().remove();
    $("#editBtn_" + treeNode.id).unbind().remove();
}


