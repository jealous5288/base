var tabpanel, param,
    taskId,
    isFirstNode,
    sort,
    flowCode,
    wiId,
    status,
    canBackTask,
    winstatus,
    sfxsbc,
    showCancel,
    isMe,
    list,
    taskList,
    taskNum,
    dataId,
    draft,
    handleType,
    flowViewTag, //是否查看流程图
    toTag,
    title,
    reloadFlag = false,   //关闭页面是否刷新
    submitName,
    saveName,
    buttons;

$(document).ready(function () {
    pageAjax();
    param = _top.winData(_top, "flowParam");
    var viewParam = winData(window, "param");
    if (viewParam) {
        flowViewTag = param.flowViewTag = viewParam.flowViewTag;
        taskId = param.taskId = viewParam.taskId;
    } else {
        taskId = param.taskId;
    }
    flowCode = param.flowCode || param.buildParam.flowCode;
    title = param.title;
    toTag = param.toTag;
    closeOpinion = param.closeOpinion;
    //获取工作流页面渲染参数
    var query = {type: param.type};
    //页面初始化请求数据
    if (taskId) {
        $.get("/workflow/instance/getTaskHandleJson",
            {
                id: taskId,
                ran: Math.random()
            },
            function (ar) {
                if (ar.success) {
                    var data = ar.data;
                    taskId = data.taskId; //任务id
                    isFirstNode = data.isFirstNode; //是否开始环节
                    sort = data.sort;
                    wiId = data.wiId;
                    status = data.taskStatus;
                    canBackTask = data.canBackTask;
                    winstatus = data.winstatus;
                    sfxsbc = data.sfxsbc;
                    handleType = data.handleType;
                    showCancel = data.showCancel;
                    isMe = data.isMe;
                    list = data.list;
                    taskList = data.taskList;
                    taskNum = data.taskNum;
                    submitName = data.submitName;
                    saveName = data.saveName;
                    buttons = data.buttons;
                    isConfirmSign(status, taskId, list);//是否弹出签收
                    createInitHtml(list, taskList, query);
                    $(".divTabs").each(function (i, item) {
                        $(item).height(document.body.offsetHeight - 100 + "px");
                    });
                    if (taskList.length > 0) {
                        $("#bottomPanel").css("display", "block");
                        $("#bottomTips").css("display", "block");
                    }
                    dataId = data.WdataId;
                    changeBtn(); //控制按钮显示/隐藏
                    // 关闭流程环节意见
                    if ($("#closeOpinion").val() == "close") {
                        $("#bottomPanel").css("display", "none");
                    }
                } else {
                    layer.alert(ar.msg);
                }
            });
    } else { //WCY 17/10/19
        $.ajax({
            url: "/workflow/instance/getTaskHandleByCode?flowCode=" + flowCode + "&r=" + Math.random(),
            type: "get",
            dataType: "json",
            async: false,
            success: function (ar) {
                if (ar.success) {
                    var data = ar.data;
                    list = data.list;
                    submitName = data.submitName;
                    saveName = data.saveName;
                    buttons = data.buttons;
                    createInitHtml(list, null, query);
                }
            }
        });
    }

    function FramePool() {
        var framePool = null;
        return function () {
            if (!framePool) {
                var frameList = _top.getFrameNameArray(window);
                framePool = [];
                for (var i = 0; i < frameList.length; i++) {
                    if (window.frames[frameList[i]] && frameList[i] != "opinionIframe") {
                        var frameObj = {
                            edit: _top.winData(frameList[i], "edit"),
                            sheetMode: _top.winData(frameList[i], "sheetMode"),
                            rwId: _top.winData(frameList[i], "rwId"),
                            npId: _top.winData(frameList[i], "npId"),
                            name: frameList[i]
                        };
                        frameObj.win = window.frames[frameList[i]];
                        //提交验证
                        frameObj.checkFunc = window.frames[frameList[i]].checkSheetSubmit;
                        //保存
                        frameObj.saveFunc = window.frames[frameList[i]].sheetSave;
                        //保存草稿
                        frameObj.saveDraftFunc = window.frames[frameList[i]].saveDraft;
                        //提交
                        frameObj.submitFunc = window.frames[frameList[i]].sheetSubmit;
                        //删除
                        frameObj.deleteFunc = window.frames[frameList[i]].sheetDelete;
                        frameObj.getOpinion = window.frames[frameList[i]].getFrameOpinion;
                        frameObj.tab = $("#" + $("#" + frameList[i]).attr("tabid"));
                        frameObj.isWebOffice = window.frames[frameList[i]].isWeboffice;
                        framePool.push(frameObj);
                    }
                }
            }
            return framePool;
        }
    }

    var getFramePool = FramePool();

    //验证
    function checkForm(framePool) {
        for (var i = 0, framePoolLength = framePool.length; i < framePoolLength; i++) {
            if (framePool[i].sheetMode != 2) { //非查看的均保存
                if (framePool[i].checkFunc) {
                    var result = framePool[i].checkFunc();
                    if (typeof(result) == "object") {
                        if (!result.flg) {
                            if (framePoolLength == 1) {
                                if (!framePool[i].isWebOffice) {  // webOfficePage页面做个性化提示
                                    alertUpOcx(result.msg || "保存验证不通过");
                                }
                            } else {
                                framePool[i].tab.click();
                                if (!framePool[i].isWebOffice) {  // webOfficePage页面做个性化提示
                                    alertUpOcx(result.msg || (framePool[i].tab.find(".tabtitle").html() + "保存验证不通过"));
                                }
                            }
                            return {flg: false};
                        }
                    } else if (!result) {
                        if (framePoolLength == 1) {
                            if (!framePool[i].isWebOffice) {  // webOfficePage页面做个性化提示
                                alertUpOcx("保存验证不通过");
                            }
                        } else {
                            framePool[i].tab.click();
                            if (!framePool[i].isWebOffice) {  // webOfficePage页面做个性化提示
                                alertUpOcx(framePool[i].tab.find(".tabtitle").html() + "保存验证不通过");
                            }
                        }
                        return {flg: false};
                    }
                }
            }
        }
        return {flg: true};
    }

    //保存
    function saveForm(framePool) {
        var result = {flg: true, msg: null};
        for (var i = 0, framePoolLength = framePool.length; i < framePoolLength; i++) {
            if (framePool[i].sheetMode != 2) {
                if (framePool[i].saveFunc) {
                    var saveResult = framePool[i].saveFunc();
                    if (framePoolLength > 1) {
                        framePool[i].tab.click();
                    }
                    if (!saveResult.flg) {
                        result.flg = false;
                        return result;
                    } else {
                        dataId = result.msg = saveResult.msg;
                    }
                }
            }
        }
        if (result.flg) {
            //保存了，需要刷新前一页面数据
            reloadFlag = true;
        }
        return result;
    }

    //提交
    function submitForm(framePool, param) {
        var result = {flg: true, msg: null};
        for (var i = 0, framePoolLength = framePool.length; i < framePoolLength; i++) {
            if (framePool[i].sheetMode != 2) {
                if (framePool[i].submitFunc) {
                    var saveResult = framePool[i].submitFunc(param);
                    if (framePoolLength > 1) {
                        framePool[i].tab.click();
                    }
                    if (!saveResult.flg) {
                        alertUpOcx(saveResult.msg ? saveResult.msg : "办理失败");
                        result.flg = false;
                        return result;
                    } else {
                        result.msg = saveResult.msg;
                    }
                }
            }
        }
        return result;
    }

    //验证并提交
    function checkAndSubmit() {
        var result = {flg: true, msg: null};
        var framePool = getFramePool();
        var checkResult = checkForm(framePool);

        if (!checkResult.flg) {
            result.flg = false;
            return result;
        }

        var submitResult = submitForm(framePool);
        if (submitResult.flg) {
            result.msg = submitResult.msg;
            return result;
        } else {
            result.flg = false;
            return result;
        }
    }

    //校验自动意见
    function checkAutoOpinion() {
        var result = true;
        var framePool = getFramePool();
        for (var i = 0; i < framePool.length; i++) {
            var obj = $(".flowEditOpinion", framePool[i].win.document);
            if (obj.length > 0) {
                if (!obj.val()) {
                    framePool[i].tab.click();
                    notNull(obj);
                    alertUpOcx("请填写审批意见");
                    return false;
                }
            }
        }
        return result
    }

    //获取自动意见
    function getAutoOpinion() {
        var framePool = getFramePool();
        var opinionArr = [];
        for (var i = 0; i < framePool.length; i++) {
            var obj = $(".flowEditOpinion", framePool[i].win.document);
            if (obj.length > 0) {
                opinionArr.push(obj.attr("npId"));
                opinionArr.push(obj.val());
            }
        }
        return opinionArr.join("##");
    }

    //保存草稿
    function tmpDataSave() {
        var framePool = getFramePool();
        var saveflg = true;
        for (var i = 0; i < framePool.length; i++) {
            if (framePool[i].sheetMode != 2) {
                if (framePool[i].saveDraftFunc) {
                    var saveResult = framePool[i].saveDraftFunc();
                    if (typeof(saveResult) === "object") {
                        saveResult = JSON.stringify(saveResult);
                    }
                    framePool[i].tab.click();
                    $.ajax({
                        type: "post",
                        url: "/workflow/instance/saveTmpData",
                        async: false,
                        data: {taskId: taskId, nodePageId: framePool[i].npId, tmpData: saveResult},
                        dataType: "json",
                        success: function (ar) {
                            if (!ar.success) {
                                saveflg = false;
                            }
                        }
                    });
                    if (!saveflg) {
                        break;
                    }
                }
            }
        }
        if (saveflg) {
            reloadFlag = true;
        }
        return saveflg;
    }

    //删除流程实例
    function deleteFlow() {
        var deleteSuccess = false;
        $.ajax({
            type: "post",
            url: "/workflow/instance/deleteWorkflowInstance",
            async: false,
            data: {taskId: taskId},
            dataType: "json",
            success: function (ar) {
                if (ar.success) {
                    deleteSuccess = true;
                }
            }
        });
        return deleteSuccess;
    }

    //删除流程数据
    function deleteWf() {
        if (deleteFlow()) {
            hideFrameOcx();
            if (_top.workFlowType == "layer") {
                closeAllWin();
                reloadPrevWin();
            } else {
                gotoLocation(toTag);
            }
            layer.alert("删除流程成功");
        } else {
            alertUpOcx("删除流程失败");
        }
    }

    //删除业务数据、流程数据
    function deleteWfAndBus() {
        var delResult;
        var canDelete = true;
        var framePool = getFramePool();
        for (var i = 0; i < framePool.length; i++) {
            if (framePool[i].deleteFunc) {
                delResult = framePool[i].deleteFunc();
                if (delResult.flg) {
                    canDelete = true;
                } else {
                    alertUpOcx(delResult.msg || "调用删除方法，删除失败");
                    return false;
                }
            } else {
                alertUpOcx("该表单没有删除方法，删除失败");
                return false;
            }
        }
        if (canDelete) {
            deleteWf();
        }
    }

    //提交 true
    function handleSubmit(opinion, agree) {
        var autoOpinion = "";

        function _taskSubmit(taskOpinion, fj_id) {
            taskOpinion = taskOpinion || opinion;
            $.ajax({
                type: "post",
                url: "/workflow/instance/handleTask",
                data: {
                    id: taskId, opinion: taskOpinion,
                    agree: agree, autoOpinion: autoOpinion,
                    fj_id: fj_id, dataId: dataId, draft: draft
                },
                success: function (ar) {
                    if (ar.success) {
                        var tipMsg;
                        if (opinion == "同意") {
                            tipMsg = "审批通过";
                        } else if (opinion == "提交") {
                            tipMsg = "提交成功";
                        } else if (opinion == "不同意") {
                            tipMsg = "退回成功";
                        } else if (opinion) {
                            tipMsg = opinion + "成功";
                        } else {
                            tipMsg = "办理完成";
                        }
                        layer.alert(tipMsg);
                        closeAllWin();
                        if (_top.workFlowType == "layer") {
                            reloadPrevWin();
                        } else {
                            window.gotoLocation(toTag);
                        }
                    } else {
                        layer.alert(ar.msg);
                    }
                }
            });
        }

        //保存验证通过时提交
        function _submit() {
            var data = (opinion == "提交" && sort == 1) ? {
                id: taskId,
                agree: agree,
                flowCode: param.flowCode || param.buildParam
            } : {id: taskId, agree: agree};
            if (_top.hasHandleSubmit) { //是否有办理页面
                $.ajax({
                    type: "post",
                    url: "/workflow/instance/getHandleData",
                    async: false,
                    data: data,
                    dataType: "json",
                    success: function (ar) {
                        if (ar.success) {
                            dataId = ar.data.data_id;
                            if (ar.data.hasDynamicUser == undefined || ar.data.hasDynamicUser) {
                                var buildParam = {
                                    id: taskId,
                                    blrList: ar.data.blrList,
                                    nodeName: ar.data.nodeName,
                                    info: ar.data.info,
                                    sfbxscfj: ar.data.sfbxscfj,
                                    agree: agree,
                                    opinion: opinion,
                                    taskNum: taskNum,
                                    sureFunc: _taskSubmit
                                };
                                openStack(window, "办理确认", "small", "/workflow/instance/handle", buildParam);
                            } else {
                                layer.alert(ar.data.msg);
                            }
                        } else {
                            layer.alert("获取流程办理页面数据出错");
                        }
                    }
                });
            } else {
                _taskSubmit();
            }
        }

        if (taskId) {
            var result = checkAndSubmit();
            if (result.flg) {
                if (_top.hasFlowAutoOpinion) {
                    if (checkAutoOpinion()) {
                        autoOpinion = getAutoOpinion();
                    } else {
                        return;
                    }
                }
                if (!dataId) {
                    dataId = result.msg;
                    draft = true;
                }
                _submit();
            }
        } else {
            var result = checkAndSubmit();
            if (result.flg) {
                $.get("/workflow/instance/startWorkflowAndSubmit",
                    {flowCode: flowCode, dataId: result.msg, opinion: opinion, title: title},
                    function (ar) {
                        if (ar.success) {
                            layer.alert("办理完成");
                            closeAllWin();
                            if (_top.workFlowType == "layer") {
                                reloadPrevWin();
                            } else {
                                window.gotoLocation(toTag);
                            }
                        } else {
                            layer.alert(ar.msg);
                        }
                    });
            }
        }
    }

    //提交
    $('#submit').click(function () {
        stopPropagation();
        handleSubmit(submitName ? submitName : "提交", true);
    });

    //退回
    $('#refuse').click(function () {
        stopPropagation();
        handleSubmit("不同意", false);
    });

    //撤回
    $("#cancel").click(function () {
        stopPropagation();
        hideFrameOcx();
        layer.confirm("确认要撤回该任务吗？", function () {
            $.post("/workflow/instance/withdraw", {id: taskId}, function (ar) {
                if (ar.success) {
                    hideFrameOcx();
                    layer.alert("撤回成功");
                    if (_top.workFlowType == "layer") {
                        reloadPrevWin();
                        closeWin();
                    } else {
                        gotoLocation(toTag);
                    }
                } else {
                    alertUpOcx(ar.msg);
                }
            });
        });
    });

    //保存
    $('#save').click(function () {
        stopPropagation();
        var framePool = getFramePool();
        if (checkForm(framePool) && saveForm(framePool)) {
            alertUpOcx("保存成功");
        }
    });

    //保存草稿
    $("#saveDraft").click(function () {
        stopPropagation();
        if (taskId) {
            if (tmpDataSave()) {
                window.gotoLocation(toTag);
                layer.alert("保存成功");
            }
        } else {
            $.get("/workflow/instance/startWorkflow", {flowCode: flowCode}, function (ar) {
                if (ar.success) {
                    taskId = ar.data.id;
                    if (tmpDataSave()) {
                        window.gotoLocation(toTag);
                        layer.alert("保存成功");
                    }
                }
            });
        }
    });

    //删除
    $('#delete').click(function () {
        stopPropagation();
        _top.layer.confirm("确定删除该条记录吗？", {icon: 3, title: '提示'}, function (index) {
            layer.close(index);
            if (dataId) {
                deleteWfAndBus();
            } else {
                deleteWf();
            }
        });
    });

    //流程图
    $("#view").click(function () {
        stopPropagation();
        var url = "/workflow/instance/workflowView?flowCode=" + flowCode;
        if (wiId)
            url += "&id=" + wiId;
        hideFrameOcx();
        openStack(window, "流程监控", ["850px", "550px"], url, null, {
            end: function () {
                showFrameOcx();
            }
        });
    });

    //关闭页面
    $('#close').click(function () {
        if (!flowViewTag) {
            window.gotoLocation(toTag);
            closeWin();
        } else {
            closeWin();
        }
    });

    //特送退回
    $("#specialBack").click(function () {
        stopPropagation();
        hideFrameOcx();
        var callBack = function () {
            closeAllWin();
            if (_top.workFlowType == "layer") {

            } else {
                window.gotoLocation(toTag);
            }
            layer.alert("办理完成");
        };
        var buildParam = {
            taskId: taskId,
            toTag: toTag,
            callBack: callBack
        };
        openStack(window, "选择特送退回环节", "small", "/workflow/instance/specialBack", buildParam);
        showFrameOcx();
    });

    $("#buttons").on("click", "button", function (event) {
        var thisEvent = event || window.event;
        var thisTarget = thisEvent.target || thisEvent.srcElement;
        var button = getButtonByCode(thisTarget.attributes.getNamedItem("code").value);
        if (button) {
            //传入参数的
            if (button.flag) {
                handleSubmit(button.name, true, button.flag);
            } else if (button.funcName) {
                //获取页面中的函数执行
                var frameList = _top.getFrameNameArray(window);
                for (var i = 0; i < frameList.length; i++) {
                    var frame = window.frames[frameList[i]];
                    if (frame && frame[button.funcName]) {
                        frame[button.funcName]();
                        return;
                    }
                }
            }
        }
    });

    //意见栏收缩
    $("#bottomTips").hover(
        function () {
            $(this).addClass("bottomTipsHover")
        },
        function () {
            $(this).removeClass("bottomTipsHover");
        }).toggle(function () {
            $("#bottomPanel").animate({"marginBottom": "0px"}, "slow");
            $(this).html("<b>点击关闭流程处理意见</b>")
        },
        function () {
            $("#bottomPanel").animate({"marginBottom": "-202px"}, "slow");
            $(this).html("<b>点击查阅流程处理意见</b>");
        });

    function hideFrameOcx() {
        var framePool = getFramePool();
        for (var i = 0; i < framePool.length; i++) {
            if (framePool[i].isWeboffice) {
                framePool[i].win.hideOcx();
            }
        }
    }

    function showFrameOcx() {
        var framePool = getFramePool();
        for (var i = 0; i < framePool.length; i++) {
            if (framePool[i].isWebOffice) {
                framePool[i].win.showOcx();
            }
        }
    }
});

//创建初始化页面Html
function createInitHtml(sheet, task, buildParam) {
    if (task && task.length > 0) {
        var tbodyHtml = "";
        for (var i = 0; i < task.length; i++) {
            var opinion = task[i].pageOpinion || task[i].opinion;
            tbodyHtml += "<tr><td title=" + task[i].handler + ">" + task[i].handler + "</td>" +
                "<td title=" + opinion + " >" +
                getSubStr(opinion, 5000) + "</td><td title=" + task[i].handleDate + ">" + task[i].handleDate + "</td><td title=" + task[i].fjs + " onclick=\"lookAttachment('" + task[i].fj_id + "')\" style=\"cursor: pointer;\"><a>" + task[i].fjs + "</a></td></tr>";
        }
        var doc;
        if (window.frames["opinionIframe"].document) {
            doc = window.frames["opinionIframe"].document;      // IE
        } else {
            doc = window.frames["opinionIframe"].contentDocument;       // chrome,firefox
        }
        $(doc).find("#tbody").html(tbodyHtml);
    }

    var items = [];
    if (sheet && sheet.length > 0) {
        if (sheet.length == 1) {
            sheet[0].buildParam = buildParam;
            var fname = _top.addFrameWin(null, window, sheet[0]);
            var url = sheet[0].url + "?";
            if (buildParam) {
                for (key in buildParam) {
                    url += "&type=" + buildParam[key] || decode(buildParam[key].trim());
                }
            }
            var ifarmeHtml = '<iframe src="' + RX.handlePath(url) + '" id="' + fname + '" name="' + fname + '" tabid="' + 'sheet_' + sheet[0].sId + '" width="100%" height="100%" frameborder="0"></iframe>';
            $("#center-tab").append(ifarmeHtml);
        } else {
            for (var i = 0; i < sheet.length; i++) {
                var item = {};
                item.id = 'sheet_' + sheet[i].sId;
                item.title = sheet[i].name;
                var url = sheet[i].url + "?";
                sheet[i].buildParam = buildParam;
                if (buildParam) {
                    for (key in buildParam) {
                        url += "&type=" + buildParam[key] || decode(buildParam[key].trim());
                    }
                }
                var fname = _top.addFrameWin(null, window, sheet[i]);
                item.html = '<iframe src="' + RX.handlePath(url) + '" id="' + fname + '" name="' + fname + '" tabid="' + item.id + '" width="100%" height="100%" frameborder="0"></iframe>';
                item.closable = false;
                items.push(item);
            }
            tabpanel = new TabPanel({
                renderTo: 'center-tab',
                //border:'none',
                widthResizable: true,
                heightResizable: true,
                active: 0,
                jbStyle: true,
                fullTab: true,
                //maxLength : 150,
                items: items,
                tabWidth: 150
            });
        }
    }
    resizeSheetList();
    if (sheet.length > 1) {
        tabpanel.resize();
    }
    $(window).resize(function () {
        resizeSheetList();
        if (sheet.length > 1) {
            tabpanel.resize();
        }
    })
}

//是否弹出签收框
function isConfirmSign(status, taskId, sheet) {
    if (status == "待办") {
        if (_top.isWorkflowSign) {
            var warn = "签收确认";
            var webOfficeTag = false;
            for (var i = 0; i < sheet.length; i++) {
                if (sheet[i].url.toString().indexOf("webofficePage") >= 0 || sheet[i].url.toString().indexOf("htqdEdit") >= 0) {
                    webOfficeTag = true;
                }
            }
            if (webOfficeTag) {
                if (confirm(warn)) {
                    $.post("/workflow/instance/signTask", {id: taskId}, function (data) {
                    });
                } else {
                    closeAllWin();
                }
            } else {
                var i = _top.layer.confirm(warn, function () {
                    $.post("/workflow/instance/signTask", {id: taskId}, function (data) {
                        var mainwin = getPrevReloadWin();
                        if (mainwin != null && mainwin != undefined) {
                            mainwin.reloadTable();
                        }
                        layer.close(i);
                    });
                }, function () {
                    layer.close(i);
                    closeAllWin();
                });
            }
        } else {
            $.post("/workflow/instance/signTask", {id: taskId}, function (data) {
            });
        }
    }
}

//控制按钮显示/隐藏
function changeBtn() {
    if (!flowViewTag) {
        $("#view").show(); //流程图按钮显示
        if (isFirstNode && winstatus == "5" && isMe) {
            $("#delete").show();
        }
        if (status != "已办" && status != "被撤回" && status != "被退回") {
            addButton(buttons, 1);
            if (handleType == "EDIT") {
                if (submitName) {
                    document.getElementById("subSpan").innerText = submitName;
                }
                $("#submit").show();
            } else if (handleType == "EXAMINE") {
                if (submitName) {
                    document.getElementById("accSpan").innerText = submitName;
                }
                $("#accept").show();
                if (sort != 1)
                    $("#refuse").show();
            }
            if (sfxsbc == "1") {
                if (saveName) {
                    document.getElementById("saveSpan").innerText = saveName;
                }
                $("#save").show();
                $("#saveDraft").show();
            }
        } else if (status == "已办") {
            //添加已办状态显示的节点和所有状态下的节点
            addButton(buttons, 2);
        } else {
            addButton(buttons);
        }
        if (canBackTask && sort != 1) {
            //$("#specialBack").show();
        }
        if (showCancel) {
            $("#cancel").show();
        }
        if (winstatus == "0") {
            $("#accept").hide();
            $("#refuse").hide();
            $("#submit").hide();
            $("#save").hide();
            $("#saveDraft").hide();
            //$("#specialBack").hide();
            $("#delete").hide();
            $("#ldjc").hide();
        }
        if (param.buildParam && param.buildParam.type == "bg") {
            $("#delete").hide();
        }
    }
}

//增加个性按钮
function addButton(gxbuttons, flag) {
    var addHtml = [];
    for (var i = 0, maxLength = gxbuttons.length; i < maxLength; i++) {
        var button = gxbuttons[i];
        if (!flag || (!button.isShowInHandle || button.isShowInHandle == flag || button.isShowInHandle == "3")) {
            addHtml.push('<button class="btn"  id="' + button.code + '" code="' + button.code + '"');
            if (button.isShowInHandle == "3") {
                //业务控制
                addHtml.push(' style="display:none" ');
            }
            addHtml.push(' >');
            addHtml.push('<i  class="iconfont ">' + (button.icon ? button.icon : "") + '</i>');
            addHtml.push(button.name);
            addHtml.push("</button>");
        }
    }
    $("#accept").after(addHtml.join(""));
}

//显示button
function showDiyButton(buttonCode) {
    if (buttonCode) {
        if (typeof  buttonCode == String) {
            $("#" + buttonCode).show();
        } else if (buttonCode instanceof Array) {
            for (var i = 0, maxLength = buttonCode.length; i < maxLength; i++) {
                $("#" + buttonCode[i]).show();
            }
        }
    }
}

//从buttons获取button
function getButtonByCode(code) {
    for (var i = 0, maxLength = buttons.length; i < maxLength; i++) {
        if (buttons[i].code == code) {
            return buttons[i];
        }
    }
}

function resizeSheetList() {
    $("#sheetlist").height($(window).height() - $(".title2").outerHeight() - 40);
    var twidth = $(".title2").width();
    $("#sheetlist").width(twidth);
    $("#bottomTips").width(twidth).show();
    $("#bottomPanel").width(twidth).show();
}

function isWorkSpace() {
    return true;
}

function cancelCheck() {
    if (!$("#submit").is(":hidden")) {
        var closeTag = true;
        var framesList = window.frames;
        for (var i = 0; i < frames.length; i++) {
            if (framesList[i].cancelCheck) {
                if (!framesList[i].cancelCheck()) {
                    closeTag = false;
                }
            }
        }
        if (!closeTag) {
            _top.layer.confirm("页面已修改，确认关闭吗", function (index) {
                var findex = _top.layer.getFrameIndex(window.name);
                _top.layer.close(index);
                _top.layer.close(findex);
            });
            return false;
        }
    }
    //刷新页面
    if (_top.workFlowType == "layer" && reloadFlag) {
        //1、是layer风格的，2、保存了通过了
        var mainwin = getPrevReloadWin();
        if (mainwin != null && mainwin != undefined) {
            mainwin.reloadTable();
        }
    }
    return true;
}

function alertUpOcx(msg, func) {
    hideFrameOcx();
    _top.layer.alert(msg, function (index) {
        _top.layer.close(index);
        showFrameOcx();
        if (typeof(func) == "Function") {
            func();
        }
    });
}

//获取子窗口window，index--tab顺序
window.getFrameWindow = function (index) {
    var framePool = getFramePool();
    if (framePool.length > index) {
        return framePool[index].win;
    }
    return null;
};
