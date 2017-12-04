var modelTeacher,
    param = _top.winData(window);   //工作流相关参数
var id;
$(function () {
    //初始化尺寸
    resizeForm();

    var type = GetQueryString("type");
    var stateJson = ckStateJson;
    if (type === "xz") {
        stateJson = xzStateJson;
    }
    var ModelTeacher = DetailModel.extend({
        className: "ModelTeacher",
        initJson: ModelTeacherJson,
        stateJson: stateJson
    });

    var teacher;
    id = param.WdataId;
    if (param.tmpData) {
        teacher = JSON.parse(param.tmpData);
    } else if (id) {
        $.ajax({
            type: "get",
            url: "/teacher/getTeacher?id=" + id + "&random=" + Math.random(),
            async: false,
            success: function (ar) {
                if (ar.success) {
                    teacher = eval(ar.data);
                } else {
                    _top.layer.alert(ar.msg);
                }
            }
        });
    }
    modelTeacher = new ModelTeacher(teacher);
    modelTeacher.render();
    //保存方法
    $("#save").click(function () {
        if (modelTeacher.ruleValidate()) {
            $.ajax({
                type: "post",
                url: "/teacher/saveTeacher",
                data: {teacher: modelTeacher.getJson()},
                dataType: "json",
                success: function (ar) {
                    if (ar.success) {
                        id = ar.data;
                        //reloadPrevWin();
                        //layer.closeAll();
                    } else {
                        layer.alert(ar.msg);
                    }
                }
            });
        }
    });
});

//工作流表单验证
function checkSheetSubmit() {
    return modelTeacher.ruleValidate();
}

//工作流表单保存
function sheetSubmit() {
    var saveResult = {};
    saveResult.msg = "";
    saveResult.flg = false;
    $.ajax({
        type: "post",
        url: "/teacher/saveTeacher",
        async: false,
        data: {teacher: modelTeacher.getJson(), param: JSON.stringify(param)},
        dataType: "json",
        success: function (ar) {
            if (ar.success) {
                id = ar.data;
                modelTeacher.set("id", ar.data);
                saveResult.msg = id;
                saveResult.flg = true;
            } else {
                modelTeacher.set("id", ar.data);
                saveResult.msg = ar.msg;
                saveResult.flg = false;
            }
        }
    });
    return saveResult;
}

//草稿
function saveDraft() {
    return modelTeacher.getAllJson();
}

//保存
function sheetSave() {
    //var saveResult = {};
    //saveResult.msg = "";
    //saveResult.flg = false;
    //$.ajax({
    //    type: "post",
    //    url: "/test/saveTeacher",
    //    async: false,
    //    data: {teacher: modelTeacher.getJson(), param: JSON.stringify(param)},
    //    dataType: "json",
    //    success: function (ar) {
    //        if (ar.success) {
    //            id = ar.data;
    //            modelTeacher.set("id", ar.data);
    //            saveResult.msg = "";
    //            saveResult.flg = true;
    //        } else {
    //            modelTeacher.set("id", ar.data);
    //            saveResult.msg = ar.msg;
    //            saveResult.flg = false;
    //        }
    //    }
    //});
    //return saveResult;
    return {flg: true, msg: ""};
}

//工作流表单删除
function sheetDelete() {
    var result = {msg: "", flg: false};
    if (id) {
        $.ajax({
            type: "post",
            url: "/teacher/delTeacher",
            async: false,
            data: {id: id},
            dataType: "json",
            success: function (ar) {
                if (ar.success) {
                    result.flg = true;
                } else {
                    result.msg = ar.msg;
                    result.flg = false;
                }
            }
        });
    } else {
        result.flag = true;
    }
    return result;
}