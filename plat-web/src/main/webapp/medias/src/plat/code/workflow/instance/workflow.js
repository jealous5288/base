/**
 * obj {...}
 * @param obj{flowCode,type,toTag,title}
 */
function confirmWorkflowStart(obj) {
    if (obj) {
        obj.toTag = obj.toTag || getToTagUrl(window);
        openWorkflow("/workflow/instance/taskHandle", obj.title, obj);
    }
}

//通过流程编码和业务数据ID办理流程,参数（数据ID，流程编码，标题，个性化参）
function handleWorkflowByCodeAndDataId(dataId, flowCode, title, par, toTag) {
    $.ajax({
        type: "post",
        url: "/workflow/instance/getNewestTaskId",
        data: {flowCode: flowCode, dataId: dataId},
        async: false,
        success: function (ar) {
            if (ar.success) {
                var taskId = ar.data;
                if (taskId) {
                    handleWorkflow(taskId, title, par, toTag);
                }
            } else {
                _top.layer.alert(ar.msg);
            }
        }
    });
}

//通过流程实例ID办理流程,参数（流程实例ID，标题，个性化参数）
function handleWorkflowByWiId(wiId, title, par, toTag) {
    if (!toTag) {
        toTag = getToTagUrl(window);
    }
    $.ajax({
        type: "post",
        url: "/workflow/instance/getNewestTaskIdByWiId",
        data: {wiId: wiId},
        async: false,
        success: function (ar) {
            if (ar.success) {
                var taskId = ar.data;
                if (taskId) {
                    handleWorkflow(taskId, title, par, toTag);
                }
            } else {
                _top.layer.alert(ar.msg);
            }
        }
    });
}

//通过任务ID办理流程
function handleWorkflow(id, title, buildParam, toTag) {
    if (!toTag) {
        toTag = getToTagUrl(window);
    }
    var par = {};
    par.buildParam = buildParam || {};
    par.taskId = id;
    par.toTag = toTag;
    openWorkflow("/workflow/instance/taskHandle", title, par);
}

var targetWin = null;

//流程办理
function openWorkflow(url, title, par) {
    _top.winData(_top, "flowParam", par);
    //工作流弹出风格
    if (_top.getWorkflowType() == "layer") {
        _top.layer.open({
            type: 2, // 代表iframe
            closeBtn: 1,
            title: title,
            maxmin: true,
            parentWin: window,
            area: ["1000px", "640px"],
            content: RX.handlePath(url),
            success: function (layero, index) {
                var iframeWin = _top.window[layero.find('iframe')[0]['name']];
                _top.pushStackWin(iframeWin, window);
                if (window.successCallback) {
                    window.successCallback();
                }
            },
            end: function () {
                // flushWorkflowInstance(data);
                if (typeof(reloadIndex) != "undefined") {
                    if (typeof(eval(reloadIndex)) == "function")  //回调首页刷新
                        reloadIndex();
                }
                _top.closeLayerWin();
            },
            cancel: function () {
                var cwin = _top.getUpperestWin();
                if (cwin != null) {
                    if (cwin.cancelCheck) {
                        if (!cwin.cancelCheck()) {
                            return false;
                        }
                    }
                }
                return true;
            }
        });
    } else {
        if (targetWin) {
            _top._gotoLocation(targetWin, url);
        } else {
            _top._gotoLocation(findWorkflowFrameWin(), url);
        }
    }
}

//查看流程图
function showStatus(id, title, buildParam) { //缺少title参数报错，已添加  wcy17/2/24
    var url = "/workflow/instance/workflowView?id=" + id;
    _top.openStack(window, title, ["850px", "550px"], url, buildParam);
}

var baseOpinionView;

function buildAutoOpinion(oid, param) {
    RX.load({
        module: "opinionView",
        callback: function () {
            baseOpinionView = new OpinionView({
                collection: new OpinionCollection,
                el: $("#" + oid),
                wiId: param.wId,
                npId: param.npId,
                spId: param.spId,
                lookflg: param.lookflg
            });
            baseOpinionView.render();
        }
    })
}

function getFrameOpinion() {
    if (baseOpinionView) {
        var obj = $(".flowEditOpinion");
        if (obj.length > 0) {
            {
                return {npId: obj.attr("npId"), opinion: obj.val()};
            }
        }
    }
}