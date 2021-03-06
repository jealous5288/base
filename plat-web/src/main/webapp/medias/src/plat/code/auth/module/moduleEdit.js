var authTableView;       //模块权限view
var ModelAuthRole;     //模块权限model
var modelModule;
var AuthRoleCollection;
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
    //声明模块功能权限
    ModelAuthRole = DetailModel.extend({
        className: "ModelAuthRole",
        initJson: ModelModuleJson,
        stateJson: stateJson,
        state: type,
        setModelName: function () {
            this.set("ModelName", "ModelAuthRole" + (++modelIndex));
        }
    });
    //创建动态表单块集合collection类（1对多关系必须创建），创建关联模块权限
    AuthRoleCollection = Backbone.Collection.extend({
        model: ModelAuthRole
    });
    //模块model
    var ModelModule = DetailModel.extend({
        className: "ModelModule",
        initJson: ModelModuleJson,
        stateJson: stateJson,
        state: type,
        relations: [
            {
                type: Backbone.HasMany,
                key: 'sysGlbModuleAuthRoleList',
                relatedModel: ModelAuthRole,
                collectionType: AuthRoleCollection
            }
        ]
    });
    //获取初值
    var id = GetQueryString("id");
    var module = {};   //供初始化的group数据对象
    if (id) {
        $.ajax({
            type: "get",
            url: "/module/getModuleById?moduleId=" + id + "&random=" + Math.random(),
            async: false,
            success: function (ar) {
                if (ar.success) {
                    module = eval(ar.data);
                } else {
                    layer.alert(ar.msg);
                }
            }
        });
    }
    //依据初值创建主model实例
    modelModule = new ModelModule(module);
    modelModule.render();
    //创建动态列表行view类
    var AuthTrView = BaseElementView.extend({
        canCheck: true,
        tagName: 'tr',
        className: 'rx-grid-tr',
        renderEditMode: function () {    //实现渲染接口
            var html = "";
            html += "<td style='text-align:center'>" + this.index + "</td>";
            html += "<td style='text-align:center' ><input type='text' class='i_text' data-property='name' data-model='" + this.model.get("ModelName") + "'/>" + "</td>" +
                "<td style='text-align:center' ><input type='text' class='i_text' data-property='code' data-model='" + this.model.get("ModelName") + "'/>" + "</td>" +
                "<td style='text-align:center'><input type='text' class='i_text' data-property='description' data-model='" + this.model.get("ModelName") + "'/>" + "</td>";
            if (type != "ck") {
                if (this.model.get("type") == 2) {
                    html += "<td style='text-align:center'><a href='javascript:void(0);'  " +
                        " onclick=editAuthRole('" + this.model.get("ModelName") + "','" + this.model.get("authroleId") + "')>修改</a>" + "</td>";
                } else {
                    html += "<td></td>";
                }
            }
            $(this.el).html(html);
        }
    });
    //创建动态列表主体view类
    var AuthTableView = BaseTableView.extend({
        mulChose: false,
        getControlHtml: function () { //实现控制区域渲染接口
            var controlstr = "<div class='page_title'>" +
                "<h1>模块包含功能权限</h1>";
            if (type != "ck") {
                controlstr += "<ul class='action_button' style='float: right;margin: 0 5px 0 0;'>" +
                    "<li><a class='add'>新增</a></li>" +
                    "<li><a class='deleteItems'>删除</a></li>" +
                    "<li><a class='selSysAuth'>选择系统权限</a></li>" +
                    "</ul>" +
                    "</div>";
            }
            return controlstr;
        },
        events: {
            'click .add': 'add',
            'click .selSysAuth': 'selSysAuth',
            'click .deleteItems': 'deleteItems'
        },
        getTheadHtml: function () {  //实现表头区域渲染接口
            var theads = "<thead>";
            theads += "<th style='width:10%'>序号</th>" +
                "<th style='width:25%'>权限名称</th>  " +
                "<th style='width:25%'>权限编码</th>  " +
                "<th>描述</th>";
            if (type == "ck") {
                theads += "</thead>";
            } else {
                theads += "<th>操作</th>" +
                    "</thead>";
            }
            return theads;
        },
        getNewModel: function () { //实现接口，以关联创建的model
            return new ModelAuthRole();
        },
        getNewTrView: function (item, mode, display, index, parent) {  //实现接口，以关联创建的行view
            return new AuthTrView({
                model: item,
                renderCallback: mode,
                display: display,
                index: index,
                parentView: parent
            });
        },
        add: function () {
            openStack(window, "新增功能权限", "small", "/authRole/authRoleEdit?type=xz&func=selModuleSysAuthCallback&typeFlag=1");
        },
        addNewItem: function (model) {
            var view = this;
            view.collection.push(model);
            view.index++;
            $(this.el).append(
                view.getNewTrView(model, 'renderEditMode', true, view.index, view).render().el
            );
            model.render();
        },
        selSysAuth: function () { //选择系统功能权限
            openStack(window, "选择系统功能权限", "medium", "/authRole/authRoleSelect?" +
                "func=selModuleSysAuthCallback&names=" + encodeURI(encodeURI(getSelAuthRoleNames())) + "&codes=" + getSelAuthRoleCodes());
        }

    });
    //实例动态列表主view
    authTableView = new AuthTableView({
        collection: modelModule.get("sysGlbModuleAuthRoleList"),
        el: $("#authList")
    });
    authTableView.render();
    $("#save").click(function () {
        if (modelModule.ruleValidate()) {
            $.ajax({
                type: "post",
                url: "/module/saveModule",
                data: {sysModule: modelModule.getJson()},
                dataType: "json",
                success: function (ar) {
                    if (ar.success) {
                        layer.alert("保存成功");
                        reloadPrevWin();
                        closeWin();
                    } else {
                        layer.alert(ar.msg);
                    }
                }
            });
        }
    });
});

//选择关联页面回调函数
function pageSelectCallback(ids, names) {
    $.getEle("ModelModule", "pageIds").val(ids);
    $.getEle("ModelModule", "pageNames").val(names);
}

//验重
function checkIsRepet(modelName, name) {
    var models = authTableView.collection.models;
    for (var i = 0; i < models.length; i++) {
        if (models[i].get("ModelName") == modelName) continue;
        if (models[i].get("name") == name && models[i].get("sfyx_st") == "VALID") {
            return false;
        }
    }
    return true;
}

//取消
function cancelCheck() {
    if (modelModule.changeValidate()) {
        layer.confirm("页面已修改，确认关闭吗", function (index) {
            layer.close(index);
            closeWin();
        });
        return false;
    }
    return true;
}

//选择系统功能权限回调函数
function selModuleSysAuthCallback(selArray) {
    for (var i = 0; i < selArray.length; i++) {
        authTableView.collection.add(new ModelAuthRole(selArray[i]));
    }
    authTableView.render();
}

//获取已选择的系统权限name,id是排除项
function getSelAuthRoleNames(id) {
    var models = authTableView.collection.models;
    var names = [];
    for (var i = 0; i < models.length; i++) {
        if (models[i].get("sfyx_st") != "UNVALID") {
            if (models[i].get("authroleId") == id) {
                continue;
            }
            names.push(models[i].get("name"));
        }
    }
    return names;
}

//获取已选择的系统权限Code,id是排除项
function getSelAuthRoleCodes(id) {
    var models = authTableView.collection.models;
    var codes = [];
    if (id) {
        for (var i = 0; i < models.length; i++) {
            if (models[i].get("sfyx_st") != "UNVALID") {
                if (models[i].get("authroleId") == id) {
                    continue;
                }
                codes.push(models[i].get("code"));
            }
        }
    } else {
        for (var i = 0; i < models.length; i++) {
            if (models[i].get("sfyx_st") != "UNVALID") {
                codes.push(models[i].get("code"));
            }
        }
    }
    return codes;
}

//修改权限
function editAuthRole(modelName, id) {
    openStack(window, "修改功能权限", "small", "/authRole/authRoleEdit?type=xg&func=editCallback&typeFlag=1&id=" + id + "&modelName=" + modelName);
}

//修改回调
function editCallback(selArray, modelName) {
    authTableView.collection.get(modelName).set("name", selArray[0].name);
    authTableView.collection.get(modelName).set("code", selArray[0].code);
    authTableView.collection.get(modelName).set("description", selArray[0].description);
    authTableView.render();
}

//
function checkPage() {
    var ids = $.getEle("ModelModule", "pageIds").val();
    if (ids) {
        return "&ids=" + ids;
    } else {
        return true;
    }
}
