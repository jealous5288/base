//操作类型标志位
var type = GetQueryString("type");
var roleId = GetQueryString("roleId");
$(function () {
    //初始化尺寸
    resizeForm();
    pageAjax();

    if (type != "ck") {
        $("#save").show();
    }

    //获取初值
    var role = {};   //供初始化的角色数据对象
    if (roleId) {
        $.ajax({
            type: "get",
            url: "/role/getRoleById?id=" + roleId + "&random=" + Math.random(),
            async: false,
            success: function (ar) {
                if (ar.success) {
                    role = ar.data;
                } else {
                    layer.alert(ar.msg);
                }
            }
        });
    }
    var resultBack;
    if (roleId) {
        $.ajax({
            type: "post",
            url: "/role/getGlxxByRole",
            data: {roleId: roleId},
            success: function (ar) {
                if (ar.success) {
                    resultBack = roleZzjg(ar.data.organs, ar.data.inUsers, ar.data.outUsers);
                } else {
                    layer.alert(ar.msg);
                }
            }
        });
    }
    $("#save").click(function () {
        //获取关联要素
        var saveParam = {};
        saveParam = resultBack.getSaveNodes();
        $.ajax({
            type: "post",
            url: "/role/saveRoleGlxx",
            data: {
                roleId: roleId, organsAddSelf: saveParam.organsAddSelf,
                organsAddDown: saveParam.organsAddDown,
                organsDelSelf: saveParam.organsDelSelf,
                organsDelDown: saveParam.organsDelDown,
                usersAddSelf: saveParam.usersAddSelf,
                usersDelSelf: saveParam.usersDelSelf,
                usersTurnSelf: saveParam.usersTurnSelf
            },
            success: function (ar) {
                if (ar.success) {
                    layer.alert("保存成功！");
                    closeWin();
                } else {
                    layer.alert(ar.msg);
                }
            }
        });
    });

    //关闭
    $("#close").click(function () {
        closeWin();
    });
});