var modelRole;                 //角色对象
var wfTag = GetQueryString("wfTag");    //工作流跳转标志，只可编辑业务角色和系统角色
var type = GetQueryString("type");    //标志位
var id = GetQueryString("id");    //标志位
var glysFlag = id ? true : false;
$(function () {
    //初始化尺寸
    resizeForm();
    pageAjax();
    //操作类型标志位
    var type = GetQueryString("type");
    //项目页面跳转配置对象标志
    var projectModelName = GetQueryString("projectModelName");
    //依据参数确定选择的状态配置
    var stateJson;
    if (type == "xz") {
        $("#save").show();
        stateJson = XzState;
    } else if (type == "xg") {
        $("#save").show();
        stateJson = XzState;
        ModelRoleJson.ModelRole.roleType.disabled = true;
        ModelRoleJson.ModelRole.roleCode.disabled = true;
    } else if (type == "ck") {
        stateJson = CkState;
    }
    if (wfTag == "1") {
        ModelRoleJson.ModelRole.roleType.dictConfig.pcode = 2;
    }

    //角色类声明
    var ModelRole = DetailModel.extend({
        className: "ModelRole",
        initJson: ModelRoleJson,
        stateJson: stateJson,
        state: type
    });

    //获取初值
    var role = {};   //供初始化的角色数据对象
    var roleType;
    if (id) {
        $.ajax({
            type: "get",
            url: "/role/getRoleById?id=" + id + "&random=" + Math.random(),
            async: false,
            success: function (ar) {
                if (ar.success) {
                    role = ar.data;
                } else {
                    layer.alert(ar.msg);
                }
            }
        });
        $.ajax({
            type: "post",
            url: "/auth/getAuthRoleListByRoleId",
            data: {roleId: id},
            async: false,
            success: function (ar) {
                if (ar.success) {
                    role.pageAuthRoleList = ar.data;
                }
            }
        });
        roleType = parseInt(role.roleType);    //获取角色类型，隐藏规则页面
    } else if (projectModelName) {
        role = JSON.parse(winData(window, "param").roleJson);
        id = role.id;
        roleType = parseInt(role.roleType);    //获取角色类型，隐藏规则页面
    }

    if (roleType) {
        changeRule(roleType);
        $("#chooseOrgan").show();
    }

    //依据初值创建主model实例
    modelRole = new ModelRole(role);
    //角色渲染
    modelRole.render();

    //保存
    $("#save").click(function () {
        if (modelRole.ruleValidate()) {
            if (projectModelName) {          //TODO:需要抽出单独页面实现该功能
                getPrevWin().setRoleUser(projectModelName, JSON.stringify(modelRole.getAllJson()));
                closeWin();
                return;
            }
            $.ajax({
                type: "post",
                url: "/role/saveRole",
                data: {sysRole: modelRole.getJson()},
                dataType: "json",
                success: function (ar) {
                    if (ar.success) {
                        id = ar.data;
                        modelRole.setValue("id", id);
                        if (wfTag == "1") {
                            var func = GetQueryString("func");
                            if (func) {
                                var callback = eval("getPrevWin()." + func);
                                callback(ar.data, modelRole.get("roleName"), modelRole.get("roleCode"), modelRole.get("roleType"));
                            }
                        }
                        if (glysFlag) {
                            reloadPrevWin();
                            closeWin();
                        } else {
                            glysFlag = true;
                            layer.confirm("保存成功，是否进行关联设置？",
                                function (index) {
                                    reloadPrevWin();
                                    gotoChooseOrgan();
                                    layer.close(index);
                                },
                                function (index) {
                                    layer.close(index);
                                    reloadPrevWin();
                                    closeWin();
                                }
                            );
                        }
                    } else {
                        layer.alert(ar.msg);
                    }
                }
            });
        }
    });

    //关联设置
    $("#chooseOrgan").click(function () {
        gotoChooseOrgan();
    });

    //关闭
    $("#close").click(function () {
        closeWin();
    });
});

function gotoChooseOrgan() {
    var roleType = $.getEle("ModelRole", "roleType").val();
    if (roleType == 1 || roleType == 2) {
        openStack(window, "关联设置", ['800px', '650px'], "/role/chooseOrgan?&type=" + type + "&roleId=" + id);
    } else if (roleType == 3) {
        openStack(window, "关联设置", "medium", "/role/chooseRule?&type=" + type + "&roleId=" + id);
    } else {
        layer.alert("请先选择角色类型");

    }
}

//取消
function cancelCheck() {
    // if (modelRole.changeValidate()) {
    //     layer.confirm("页面已修改，确认关闭吗", function (index) {
    //         layer.close(index);
    //         closeWin();
    //     });
    //     return false;
    // }
    return true;
}

//根据角色类型显示规则,并清空相关数据
function changeRule(roleType) {
    roleType = roleType || $.getEle("ModelRole", "roleType").val();
    if (roleType == 1) {            //系统角色
        $("._sysrole").show();
    } else {
        $("._sysrole").hide();
    }
}