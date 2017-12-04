var func = GetQueryString("func");
var type = GetQueryString("type");
var modelName = GetQueryString("modelName");
var pageAuthTableView;
var PageAuthCollection;
var pageAuthCollection;
var pageTableView;
var ModelGlbRolePageAuthRole;
var ModelPageAuthCollection;
var ModelPage;
$(function () {
    //初始化尺寸
    resizeForm();
    var stateJson;
    if (type == "xz") {
        stateJson = XzState;
    } else if (type == "xg") {
        stateJson = XgState;
    } else if (type == "ck") {
        stateJson = CkState;
        $(".w_button_box").hide();
    }
    //页面类声明
    var ModelMain = DetailModel.extend({
        className: "ModelMain",
        initJson: ModelMainJson,
        stateJson: stateJson
    });
    //角色与页面功能权限类声明
    ModelGlbRolePageAuthRole = DetailModel.extend({
        className: "ModelGlbRolePageAuthRole",
        initJson: ModelGlbRoleAuthRoleJson,
        stateJson: stateJson,
        state: type,
        setModelName: function () {
            this.set("ModelName", "ModelGlbRolePageAuthRole" + (++modelIndex));
        }
    });
    //页面功能权限集合
    ModelPageAuthCollection = Backbone.Collection.extend({
        model: ModelGlbRolePageAuthRole
    });

    //页面类声明
    ModelPage = DetailModel.extend({
        className: "ModelPage",
        initJson: ModelGlbRoleAuthRoleJson,
        stateJson: stateJson,
        state: type,
        setModelName: function () {
            this.set("ModelName", "ModelPage" + (++modelIndex));
        },
        relations: [
            {
                type: Backbone.HasMany,
                key: 'authRoleList',
                relatedModel: ModelGlbRolePageAuthRole,
                collectionType: ModelPageAuthCollection
            }
        ]
    });
    //页面集合
    var PageCollection = Backbone.Collection.extend({
        model: ModelPage,
        getJson: function () {
            var json = "[";
            $.each(this.models, function (i, model) {
                json += model.getJson() + ",";
            });
            if (json.length > 1) {
                json = json.substring(0, json.length - 1);
            }
            json += "]";
            return json;
        }
    });
    //创建页面动态列表主体view类
    var PageTableView = BaseTableView.extend({
        getControlHtml: function () { //实现控制区域渲染接口
            var controlstr = "<div class='page_title'>" +
                "<h1>已关联的页面</h1></div>";
            return controlstr;
        },
        getTheadHtml: function () {  //实现表头区域渲染接口
            return "";
        },
        getNewModel: function () { //实现接口，以关联创建的model
            return new ModelPage();
        },
        render: function (isOpen) {
            var view = this;
            this.index = 0;
            $(this.el).empty();
            //渲染控制区域，放入table的caption中
            $(this.el).append(view.getControlHtml());  //渲染标题和控制区域
            var table = $('<table  cellpadding="0" cellspacing="0" border="0" class="list"></table>');
            $(table).append(view.getTheadHtml());

            $(this.el).append("<tbody></tbody>");
            view.reRender(isOpen);
            view.modelRender();
        },
        reRender: function () {
            var view = this;
            var tbody = $(this.el).children("tbody");
            $(tbody).empty();
            var i = 0;
            var j = 0;
            var html = "<tr>";
            var flag = true;
            $.each(this.collection.models, function (index, model) {
                if (view.isHasAuth(model)) {
                    if (i == 5) {
                        html += "</tr><tr>";
                        i = 0;
                    }
                    var num = 0;
                    $.each(model.get("authRoleList").models, function (i, t) {
                        if (t.get("sfyx_st") != "UNVALID") {
                            num++;
                        }
                    });
                    html += "<td class='authTd'><a href='javascript:void(0)' pageId='" + model.get("page_id") + "'>" +
                        model.get("name") + "</a>" +
                        "<b>(" + num + ")</b>" + "</td>";
                    i++;
                    j++;
                }
            });
            for (; i < 5; i++) {
                html += "<td class='authTd'> </td>";
            }
            if (flag) {
                html += "</tr>";
                $(tbody).append(html);
            }
            $(".authTd a", this.el).click(function () {
                modelMain.setValue("pageId", $(this).attr("pageId"));
                givePage();
            });
        },
        isHasAuth: function (model) {        //检查model有没有功能权限
            var flag = false;          //标识符，有没有功能权限
            var authRoleModels = model.get("authRoleList").models,
                modelsLength = authRoleModels.length;
            for (var m = 0; m < modelsLength; m++) {
                if (authRoleModels[m].get("sfyx_st") == "VALID") {
                    flag = true;
                    return flag;
                }
            }
            return flag;
        }
    });
    var data = JSON.parse(winData(window, "param").data);
//实例页面动态列表主view
    pageTableView = new PageTableView({
        collection: new PageCollection(data),
        el: $("#selPageAuthList")
    });
    pageTableView.render();
    var ModelPageAuth = DetailModel.extend({
        className: "ModelPageAuth",
        initJson: ModelPageAuthJson,
        stateJson: stateJson,
        setModelName: function () {
            this.set("ModelName", "ModelPageAuth" + (++modelIndex));
        }
    });
//关联集合
    PageAuthCollection = Backbone.Collection.extend({
        model: ModelPageAuth
    });
    pageAuthCollection = new PageAuthCollection();   //机构数据对象
    var PageAuthTrView = BaseElementView.extend({
        canCheck: true,
        tagName: 'tr',
        className: 'rx-grid-tr',
        renderEditMode: function () {    //实现渲染接口
            var view = this;
            var html = "";
            if (view.model.checked) {
                html += "<td style='text-align:center'><input type='checkbox' class='checkBox' checked = 'checked' /></td>";
                view.$el.addClass("selectRow");
            } else {
                html += "<td style='text-align:center'><input type='checkbox' class='checkBox'/></td>";
            }

            html += "<td style='text-align:center'>" + this.index + "</td>";
            html += "<td style='text-align:center'><input type='text'  class='i_text' data-property='name' data-model='" + this.model.get("ModelName") + "'/></td>" +
                "<td style='text-align:center'><input type='text' class='i_text' data-property='code' data-model='" + this.model.get("ModelName") + "'/>" + "</td>" +
                "<td style='text-align:center'><input type='text' class='i_text' data-property='description' data-model='" + this.model.get("ModelName") + "'/>" + "</td>";
            $(this.el).html(html);
        }
    });

//创建关联动态列表视图类声明
    var PageAuthTableView = BaseTableView.extend({
        getControlHtml: function () { //实现控制区域渲染接口
            return "";
        },
        getTheadHtml: function () {  //实现表头区域渲染接口
            var theads = "<thead>";
            theads += "<th style='width:5%'></th>";
            theads += "<th style='width:5%'>序号</th>" +
                "<th style='width:20%'>权限名称</th>  " +
                "<th style='width:20%'>权限编码</th>  " +
                "<th style='width:30%'>权限描述</th>";
            return theads;
        },
        getNewModel: function () { //实现接口，以关联创建的model
            return new ModelPageAuth();
        },
        getNewTrView: function (item, mode, display, index) {  //实现接口，以关联创建的行view
            return new PageAuthTrView({
                model: item,
                renderCallback: mode,
                display: display,
                index: index
            });
        },
        render: function () {
            var view = this;
            this.index = 0;
            $(this.el).empty();
            $(this.el).append(view.getControlHtml());  //渲染标题和控制区域
            var table = $('<table  cellpadding="0" cellspacing="0" border="0" class="list"></table>');
            $(table).append(view.getTheadHtml());

            // 渲染控制区域，放入table的caption中
            // var x = $(this.el)[0].createCaption();
            // x.innerHTML = this.getControlHtml();
            // 渲染table的thead部分
            // $(this.el).append(view.getTheadHtml());
            //将已有的checked设置为true
            ckeckAuth();
            var hasTag = false;
            if (this.collection != null && this.collection.models != null) {
                $.each(this.collection.models, function (key, model) {
                    if (model.get("sfyx_st") != "UNVALID") {
                        view.index++;
                        var viewel = view.getNewTrView(model, 'renderEditMode', true, view.index, view).render().el;
                        table.append(viewel);
                        hasTag = true;
                    }
                })
            }
            if (!hasTag) {
                $(view.el).append("<tr><td colspan='5' style='height:32px;text-align:center;color:red;font-weight: bold'>" +
                    "该页面下无可用权限</td></tr>");
            }
            $(this.el).append(table);
            view.modelRender();
        }
    });
//实例动态列表主view
    pageAuthTableView = new PageAuthTableView({
        collection: pageAuthCollection,
        el: $("#pageAuthList")
    });
//视图渲染
    pageAuthTableView.render();

//渲染搜索主model
    var modelMain = new ModelMain();
    modelMain.render();

    if (type == "ck") {
        $("#confirm").hide();
    }
//保存按钮事件
    $("#confirm").click(function () {
        addData();
        var evalFunc = eval("getPrevWin()." + func);
        result = evalFunc(pageTableView.collection.getJson());
        if (result || typeof(result) == "undefined") {
            closeWin();
        }
    });
});

function reloadData(pageId) {
    var pageAuthCollection = new PageAuthCollection();   //机构数据对象
    $.ajax({
        type: "get",
        url: "/auth/getAuthRoleList?id=" + pageId + "&random=" + Math.random(),
        async: false,
        success: function (ar) {
            pageAuthCollection.add(ar.data);
        }
    });
    pageAuthTableView.collection = pageAuthCollection;
    pageAuthTableView.render();
}

//选择页面change函数
function givePage() {
    addData();
    var pageObj = $.getEle("ModelMain", "pageId");
    $("#pageId").val(pageObj.val());
    $("#pageName").val(pageObj.find("option:selected").text());
    reloadData(pageObj.val());
}

//选择页面json获取
function BindSelect() {
    var dictJson = [];
    var dataa = {};
    $.ajax({
        url: "/page/getPageSearch",
        type: "POST",
        async: false,
        data: dataa,
        success: function (ar) {
            if (ar.success) {
                var data = ar.data;
                $.each(data, function (i, item) {
                    dictJson.push({code: item.ID, value: item.NAME});
                });
            }
        }
    });
    return dictJson;
}

//勾选已选择的
function ckeckAuth() {
    var pageModels = pageAuthTableView.collection.models;    //当前页面的权限
    var authModels = pageTableView.collection.models;        //传过来的页面权限
    for (var i = 0, pageLength = pageModels.length; i < pageLength; i++) {
        for (var j = 0; j < authModels.length; j++) {
            var authListModels = authModels[j].get("authRoleList").models;
            for (var m = 0, authListLength = authListModels.length; m < authListLength; m++) {
                if (authListModels[m].get("pageAuthroleId") == pageModels[i].get("pageAuthroleId") &&
                    authListModels[m].get("sfyx_st") != "UNVALID") {
                    pageModels[i].checked = true;
                }
            }
        }
    }
}

//处理选择的数据
function addData() {
    var page_id = $("#pageId").val();
    var page_name = $("#pageName").val();
    //列表展示的页面权限
    var pageModels = pageAuthTableView.collection.models;
    //勾选的集合
    var checkCollection = new ModelPageAuthCollection();
    //反勾的集合
    var unCheckCollection = new ModelPageAuthCollection();
    for (var i = 0, pageLength = pageModels.length; i < pageLength; i++) {
        if (pageModels[i].checked) {
            checkCollection.add(new ModelGlbRolePageAuthRole({
                id: null,
                roleId: null,
                pageAuthroleId: pageModels[i].get("pageAuthroleId"),
                sfyx_st: "VALID"
            }));
        } else {
            unCheckCollection.add(new ModelGlbRolePageAuthRole({
                id: null,
                roleId: null,
                pageAuthroleId: pageModels[i].get("pageAuthroleId"),
                sfyx_st: "VALID"
            }));
        }
    }
    var unCheckModels = unCheckCollection.models,
        unCheckLength = unCheckModels.length;
    var checkModels = checkCollection.models,
        checkLength = checkModels.length;
    //保存的页面权限
    var authModels = pageTableView.collection.models;
    var pageFlag = true;  //是否新增flag
    //判断page_id存不存在需要保存的model里
    for (var i = 0, authLength = authModels.length; i < authLength; i++) {
        if (authModels[i].get("page_id") == page_id) {     //存在
            pageFlag = false;
            var authRoleModels = authModels[i].get("authRoleList").models,
                authRoleLength = authRoleModels.length;
            //处理反勾的数据
            for (var j = 0; j < authRoleLength; j++) {
                for (var m = 0; m < unCheckLength; m++) {
                    if (unCheckModels[m].get("pageAuthroleId") == authRoleModels[j].get("pageAuthroleId") && authRoleModels[j].get("sfyx_st") != "UNVALID") {
                        authRoleModels[j].set("sfyx_st", "UNVALID");
                        break;
                    }
                }
            }
            //将勾选的数据加入
            for (var j = 0; j < checkLength; j++) {
                var checkFlag = true;
                for (var m = 0; m < authRoleLength; m++) {
                    if (authRoleModels[m].get("pageAuthroleId") == checkModels[j].get("pageAuthroleId") && authRoleModels[m].get("sfyx_st") != "UNVALID") {
                        checkFlag = false;
                        break;
                    }
                }
                if (checkFlag) {
                    authModels[i].get("authRoleList").add(checkModels[j]);
                }
            }
        }
    }
    if (pageFlag) {  //新增
        if (checkLength > 0) {
            pageTableView.collection.add(new ModelPage({
                page_id: page_id,
                name: page_name,
                sfyx_st: 'VALID',
                authRoleList: checkCollection
            }));

//              pageTableView.collection.push({
//                  page_id:page_id,
//                  page_name:page_name,
//                  sfyx_st:'VALID',
//                  authRoleList:checkCollection
//              });
        }
    }
    pageTableView.render();
}



