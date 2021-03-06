var func = GetQueryString("func");
var typeFlag = GetQueryString("typeFlag");//是系统权限编辑还是个性权限编辑
var id = GetQueryString("id");
var modelName = GetQueryString("modelName");
var moduleId = GetQueryString("moduleId");
$(function () {
    //初始化尺寸
    resizeForm();
    //操作类型标志位
    var type = GetQueryString("type");
    //依据参数确定选择的状态配置
    var stateJson;
    if (type == "xz") {
        stateJson = XzState;
    } else if (type == "xg") {
        stateJson = XzState;
    } else if (type == "ck") {
        stateJson = CkState;
        $(".w_button_box").hide();
    }
    //声明模块系统功能权限
    var ModelAuthRole = DetailModel.extend({
        className: "ModelAuthRole",
        initJson: ModelAuthRoleJson,
        stateJson: stateJson
    });
    var authRole = {};   //供初始化的group数据对象
    if (id) {
        $.ajax({
            type: "get",
            url: "/authRole/getAuthRoleById?authRoleId=" + id + "&random=" + Math.random(),
            async: false,
            success: function (ar) {
                if (ar.success) {
                    authRole = eval(ar.data);
                } else {
                    layer.alert(ar.msg);
                }
            }
        });
    }
    //依据初值创建主model实例
    var modelAuthRole = new ModelAuthRole(authRole);
    if (type == "xz") {
        if (typeFlag) {
            modelAuthRole.set("type", 2);       //2为个性权限
        } else {
            modelAuthRole.set("type", 1);       //1为系统权限
        }
    }
    modelAuthRole.render();
    $("#save").click(function () {
        if (modelAuthRole.ruleValidate()) {
            if (typeFlag) {       //个性功能权限维护
                var nameArray = getPrevWin().getSelAuthRoleNames(id);
                var name = $.getEle("ModelAuthRole", "name").val();
                for (var i = 0; i < nameArray.length; i++) {       //检查名称
                    if (name == nameArray[i]) {
                        layer.alert("该权限名称已存在");
                        return;
                    }
                }
                var code = $.getEle("ModelAuthRole", "code").val();
                var codeArray = getPrevWin().getSelAuthRoleCodes(id);
                for (var i = 0; i < codeArray.length; i++) {          //检查编码
                    if (code == codeArray[i]) {
                        layer.alert("该权限编码已存在");
                        return;
                    }
                }
            }
            $.ajax({
                type: "post",
                url: "/authRole/saveAuthRole",
                data: {sysAuthRole: modelAuthRole.getJson(), moduleId: moduleId},
                dataType: "json",
                success: function (ar) {
                    if (ar.success) {
                        if (func) {
                            var selArray = [];
                            selArray.push({
                                id: id,
                                name: modelAuthRole.get("name"),
                                code: modelAuthRole.get("code"),
                                description: modelAuthRole.get("description"),
                                moduleId: null,
                                authroleId: ar.data,
                                type: 2,
                                sfyx_st: "VALID"
                            });
                            var evalFunc = eval("getPrevWin()." + func);
                            result = evalFunc(selArray, modelName);
                            if (result || typeof(result) == "undefined") {
                                closeWin();
                            }
                        } else {
                            layer.alert("保存成功");
                            reloadPrevWin();
                            closeWin();
                        }
                    } else {
                        layer.alert(ar.msg);
                    }
                }
            });
        }
    });
});
