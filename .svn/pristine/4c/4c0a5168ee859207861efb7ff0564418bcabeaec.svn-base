var func = GetQueryString("func");
var pageId = GetQueryString("pageId");
var type = GetQueryString("type");
var modelName = GetQueryString("modelName");
var pageAuthTableView;
var pageAuthCollection;
$(function () {
    //初始化尺寸
    resizeForm();
    var stateJson;
    if (type == "xz") {
        $(".w_button_box").show();
        stateJson = XzState;
    } else if (type == "xg") {
        $(".w_button_box").show();
        stateJson = XgState;
    } else if (type == "ck") {
        stateJson = CkState;

    }
    var ModelPageAuth = DetailModel.extend({
        className: "ModelPageAuth",
        initJson: ModelPageAuthJson,
        stateJson: stateJson,
        setModelName: function () {
            this.set("ModelName", "ModelPageAuth" + (++modelIndex));
        }
    });
    //关联集合
    var PageAuthCollection = Backbone.Collection.extend({
        model: ModelPageAuth
    });
    pageAuthCollection = new PageAuthCollection();   //机构数据对象
    if (pageId) {
        $.ajax({
            type: "get",
            url: "/auth/getAuthRoleList?id=" + pageId + "&random=" + Math.random(),
            async: false,
            success: function (ar) {
                pageAuthCollection.add(ar.data);
            }
        });
    }
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
            //渲染控制区域，放入table的caption中
            var x = $(this.el)[0].createCaption();
            x.innerHTML = this.getControlHtml();
            //渲染table的thead部分
            $(this.el).append(view.getTheadHtml());
            //将已有的checked设置为true
            ckeckAuth();
            if (this.collection != null && this.collection.models != null) {
                $.each(this.collection.models, function (key, model) {
                    if (model.get("sfyx_st") != "UNVALID" && model.get("notShowTag") != "1") {
//                    if (model.get("sfyx_st") != "UNVALID") {
                        view.index++;
                        var viewel = view.getNewTrView(model, 'renderEditMode', true, view.index, view).render().el;
                        $(view.el).append(viewel);
                    }
                })
            }
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
    //保存按钮事件
    $("#confirm").click(function () {
        var models = pageAuthTableView.collection.models;
        var selArr = [];
        var unSelArr = [];
        for (var i = 0; i < models.length; i++) {
            if (models[i].checked) {
                selArr.push(models[i].get("pageAuthroleId"));
            } else {
                unSelArr.push(models[i].get("pageAuthroleId"));
            }
        }
        var evalFunc = eval("getPrevWin()." + func);
        result = evalFunc(modelName, pageId, selArr, unSelArr);
        if (result || typeof(result) == "undefined") {
            closeWin();
        }
    });

});

//勾选已选择的
function ckeckAuth() {
    var ids = GetQueryString("ids");
    if (ids) {
        var idArray = ids.split(","),
            idArrayLength = idArray.length;
        var models = pageAuthCollection.models,
            modelsLength = models.length;
        for (var i = 0; i < idArrayLength; i++) {
            for (var j = 0; j < modelsLength; j++) {
                if (idArray[i] == models[j].get("pageAuthroleId")) {
                    models[j].checked = true;
                }
            }
        }
    }
}

