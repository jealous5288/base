var ModelConfig;
var modelConfig;          //配置权限对象
var type = GetQueryString("type");
$(function () {
    //异步提示注册
    pageAjax();
    //初始化尺寸
    resizeForm();
    var stateJson;
    if (type === "xz") {
        stateJson = xzStateJson;
    } else if (type === "xg") {
        stateJson = xgStateJson;

    } else if (type === "ck") {
        stateJson = ckStateJson;
        $(".w_button_box").hide();
    }
    ModelConfig = DetailModel.extend({
        className: "ModelConfig",
        initJson: ModelConfigJson,
        stateJson: stateJson
    });
    var id = GetQueryString("id");
    if (id) {
        $.ajax({
            type: "get",
            url: "/config/getConfigById?id=" + id + "&r=" + Math.random(),
            success: function (ar) {
                if (ar.success) {
                    renderForm(ar.data);
                } else {
                    layer.alert(ar.msg);
                }
            }
        });
    } else {
        renderForm();
    }

    $("#save").click(function () {
        if (modelConfig.ruleValidate()) {
            $.ajax({
                type: "post",
                url: "/config/saveConfig",
                data: {config: modelConfig.getJson()},
                dataType: "json",
                success: function (ar) {
                    if (ar.success) {
                        reloadPrevWin();
                        closeWin();
                        layer.alert("保存成功");
                    } else {
                        layer.alert(ar.msg);
                    }
                }
            });
        }
    });
});

function renderForm(data) {
    if (data && data.levels == "2") {
        $("#projectTr").show();
    }
    modelConfig = new ModelConfig(data);
    modelConfig.render();
    if (modelConfig.get("levels") != "2") {
        $.getEle("ModelConfig", "projectName").addClass("hideElement");
    }
}

function levelChange(model) {
    var level = $.getEle("ModelConfig", "levels").val();
    if (level == "2") {
        $("#projectTr").show();
        $.getEle("ModelConfig", "projectName").removeClass("hideElement");
    } else {
        $("#projectTr").hide();
        $.getEle("ModelConfig", "projectName").addClass("hideElement");
    }

}

function selectAppCallback(id, name, code) {
    modelConfig.setValue("projectId", id);
    modelConfig.setValue("projectName", name);
}

//关闭页面
function cancelCheck() {
    if (modelConfig.changeValidate()) {
        layer.confirm("页面已修改，确认关闭吗", function (index) {
            layer.close(index);
            closeWin();
        });
        return false;
    }
    return true;
}


