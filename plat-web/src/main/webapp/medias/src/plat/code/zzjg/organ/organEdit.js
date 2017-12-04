var modelOrgan;        //机构对象
var type = GetQueryString("type");  //操作类型标志位
var organGlbTableView;             //机构直接关系视图对象
var ModelGlbOrgan;             //角色机构关联类
$(function () {
    //初始化尺寸
    resizeForm();
    //依据参数确定选择的状态配置
    var stateJson;
    if (type == "xz") {
        stateJson = XzState;
    } else if (type == "xg") {
        stateJson = XgState;
    } else if (type == "ck") {
        stateJson = CkState;
        $("#save").hide();
        $(".w_button_box").hide();
    }

    //角色机构关联类声明
    ModelGlbOrgan = DetailModel.extend({
        className: "ModelGlbOrgan",
        initJson: ModelOrganJson,
        stateJson: stateJson,
        setModelName: function () {
            this.set("ModelName", "ModelGlbOrgan" + (++modelIndex));
        }
    });

    //关联集合
    var GlbCollection = Backbone.Collection.extend({
        model: ModelGlbOrgan
    });

    //机构类声明
    var ModelOrgan = DetailModel.extend({
        className: "ModelOrgan",
        initJson: ModelOrganJson,
        stateJson: stateJson,
        state: type,
        relations: [
            {
                type: Backbone.HasMany,
                key: 'sysGlbRoleList',
                relatedModel: ModelGlbOrgan,
                collectionType: GlbCollection
            }
        ]
    });
    //获取初值
    var id = GetQueryString("id");
    var organ = {};   //机构数据对象
    if (id) {
        $.ajax({
            type: "get",
            url: "/organ/getOrganById?id=" + id + "&random=" + Math.random(),
            async: false,
            success: function (ar) {
                organ = ar.data;
            }
        });
    }
    //创建机构对象
    modelOrgan = new ModelOrgan(organ);
    if (type == "xz") {
        var sjbmmc = decodeURI(decodeURI(GetQueryString("sjbmmc")));    //上级机构名称
        var sjbmid = GetQueryString("sjbmid");    //上级机构id
        if (sjbmid && sjbmid != "undefined") {
            modelOrgan.set("parentName", sjbmmc);
            modelOrgan.set("parentOrg", sjbmid);
        }
        $.ajax({
            type: "get",
            url: "/module/getMaxSort?tableName=sys_organ&fieldName=sort_num&random=" + Math.random(),
            async: false,
            success: function (ar) {
                modelOrgan.set("sortNum", ar.data);          //设置顺序号
            }
        });
    }
    //渲染数据
    modelOrgan.render(stateJson);
    //创建关联动态列表行视图类声明
    var GlbTrView = BaseElementView.extend({
        canCheck: false,
        tagName: 'tr',
        className: 'rx-grid-tr',
        renderEditMode: function () {    //实现渲染接口
            var view = this;
            var html = "";
            var unuseTag = view.model.get("sfqy_st") == "UNVALID";
            html += "<td style='text-align:center'>" + this.index + "</td>";
            html += "<td style='text-align:center'><input type='text'  class='i_text' data-property='role_name' data-model='" + this.model.get("ModelName") + "'/></td>" +
                "<td style='text-align:center'><input type='text' class='i_text' data-property='role_code' data-model='" + this.model.get("ModelName") + "'/>" + "</td>" +
                "<td style='text-align:center'><input type='text' class='i_text' data-property='role_type_name' data-model='" + this.model.get("ModelName") + "'/>" + "</td>";
            if (unuseTag) {
                html += "<td style='text-align:center' title='否'><img src='" + RX.handlePath("/medias/images/baseModel/grid_no.png") + "' align='absmiddle'></td>";
            } else {
                html += "<td style='text-align:center' title='是'><img src='" + RX.handlePath("/medias/images/baseModel/grid_yes.png") + "' align='absmiddle'></td>";
            }
            if (type != "ck") {
                if (unuseTag) {
                    html += "<td style='text-align:center'><a class='qyjy' href='javascript:void(0)'>启用</a>&nbsp" +
                        "<a href='javascript:void(0)' onclick='delRole(\"" + this.model.get("ModelName") + "\")'>删除</a></td>";
                } else {
                    html += "<td style='text-align:center'><a class='qyjy' href='javascript:void(0)'>禁用</a>&nbsp" +
                        "<a href='javascript:void(0)' onclick='delRole(\"" + this.model.get("ModelName") + "\")'>删除</a></td>";
                }
            }
            $(this.el).html(html);
            $(".qyjy", this.el).click(function () {
                changeState(view.model);
            })
        }
    });

    //创建关联动态列表视图类声明
    var GlbTableView = BaseTableView.extend({
        getControlHtml: function () { //实现控制区域渲染接口
            var controlstr = "<div class='page_title'>" +
                "<h1>关联角色</h1>";
            if (type != "ck") {
                controlstr += "<ul class='action_button' style='float: right;margin: 0 5px 0 0;'>" +
                    "<li><a class='add'>新增</a></li>" +
                    "</ul>" +
                    "</div>";
            }
            return controlstr;
        },
        events: {
            'click .add': 'add'
        },
        getTheadHtml: function () {  //实现表头区域渲染接口
            var theads = "<thead>";
            theads += "<th style='width:5%'>序号</th>" +
                "<th style='width:20%'>角色名称</th>  " +
                "<th style='width:20%'>角色编码</th>  " +
                "<th style='width:15%'>角色类型</th>  " +
                "<th style='width:10%'>是否启用</th>";
            if (type == "ck") {
                theads += "</thead>";
            } else {
                theads += "<th style='width:20%'>操作</th></thead>";
            }
            return theads;
        },
        getNewModel: function () { //实现接口，以关联创建的model
            return new ModelGlbOrgan();
        },
        getNewTrView: function (item, mode, display, index) {  //实现接口，以关联创建的行view
            return new GlbTrView({
                model: item,
                renderCallback: mode,
                display: display,
                index: index
            });
        },
        add: function () {
            var url = "/role/roleSelect?func=getRole&roleId=" + getLinkRoleIds() + "&roleType=1,2";
            openStack(window, "选择角色", ["680px", "500px"], url);
        },
        addNewItem: function (model) {
            var view = this;
            view.collection.push(model);
            view.index++;
            $(view.el).children("table").append(
                view.getNewTrView(model, 'renderEditMode', true, view.index).render().el
            );
            model.render();
        }
    });
    //实例动态列表主view
    organGlbTableView = new GlbTableView({
        collection: modelOrgan.get("sysGlbRoleList"),
        el: $("#zjList")
    });
    //视图渲染
    organGlbTableView.render();
    //保存
    $("#save").click(function () {
        if (modelOrgan.ruleValidate()) {
            $.ajax({
                type: "post",
                url: "/organ/saveOrgan",
                data: {sysOrgan: modelOrgan.getJson()},
                dataType: "json",
                success: function (ar) {
                    if (ar.success) {
                        layer.msg("保存成功", {icon: 1});
                        reloadPrevWin();
                        getPrevWin().reLoadPartentNode();
                        closeAllWin();
                    } else {
                        layer.alert(ar.msg);
                    }
                }
            });
        }
    });
});

//选择上级机构机构回调函数
function sjmbSelectCallback(modelName, name, id) {
    $.getEle(modelName, "parentOrg").val(id);
    $.getEle(modelName, "parentName").val(name);
}

//取消
function cancelCheck() {
    if (modelOrgan.changeValidate()) {
        layer.confirm("页面已修改，确认关闭吗", function (index) {
            layer.close(index);
            closeWin();
        });
        return false;
    }
    return true;
}

//添加树类型，过滤id
function addOrganId() {
    var organId = modelOrgan.get("id");
    var str = "&filterId=" + organId + "&treeType=" + 1 + "&filterLx=jg";
    return str;
}

//新增角色回调函数
function getRole(id, name, code, type, typeName) {
    organGlbTableView.addNewItem(new ModelGlbOrgan({
        roleId: id,
        role_name: name,
        role_code: code,
        role_type: type,
        glType: 2,
        sfqy_st: 'VALID',
        sfyx_st: 'VALID',
        role_type_name: typeName
    }));
}

//获取已关联的角色ids
function getLinkRoleIds() {
    var models = organGlbTableView.collection.models;
    var ids = [];
    for (var i = 0, maxLength = models.length; i < maxLength; i++) {
        if (models[i].get("sfyx_st") == "VALID") {
            ids.push(models[i].get("roleId"));
        }
    }
    return ids;
}

//改变启用状态
function changeState(model) {
    model.set("sfqy_st", model.get("sfqy_st") == "UNVALID" ? "VALID" : "UNVALID");
    organGlbTableView.render();
}

//删除关联的角色
function delRole(modelName) {
    layer.confirm("您确认要删除这条数据", function (index) {
        organGlbTableView.collection.get(modelName).set("sfyx_st", "UNVALID");
        organGlbTableView.render();
        layer.close(index);
    });
}

//清空上级机构
function emptyParent() {
    $.getEle("ModelOrgan", "parentOrg").val("");
}

//选择主管领导回调
function zgLeaderSelectCallback(modelName, name, id) {
    $.getEle(modelName, "zgLeader").val(id);
    $.getEle(modelName, "zgLeaderMc").val(name);
}

//清空主管领导
function emptyZgLeader() {
    $.getEle("ModelOrgan", "zgLeader").val("");
}

//选择分管领导回调
function fgLeaderSelectCallback(modelName, name, id) {
    $.getEle(modelName, "fgLeader").val(id);
    $.getEle(modelName, "fgLeaderMc").val(name);
}

//清空分管领导
function emptyFgLeader() {
    $.getEle("ModelOrgan", "fgLeader").val("");
}
