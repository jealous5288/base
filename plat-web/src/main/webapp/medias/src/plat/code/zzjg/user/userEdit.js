var modelUser;   //用户对象
var ModelGlbUser;  //用户关联类
var roleGlbTableView;   //角色关联view
var GlbCollection;
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
        stateJson = XgState;
    } else if (type == "ck") {
        stateJson = CkState;
        $("#save").hide();
        $(".w_button_box").hide();
    }

    //用户关联类声明
    ModelGlbUser = DetailModel.extend({
        className: "ModelGlbUser",
        initJson: ModelUserJson,
        stateJson: stateJson,
        setModelName: function () {
            this.set("ModelName", "ModelGlbUser" + (++modelIndex));
        }
    });

    //关联关系集合
    GlbCollection = Backbone.Collection.extend({
        model: ModelGlbUser
    });
    //用户类声明
    var ModelUser = DetailModel.extend({
        className: "ModelUser",
        initJson: ModelUserJson,
        stateJson: stateJson,
        state: type,
        relations: [
            {
                type: Backbone.HasMany,
                key: 'sysGlbRoleList',
                relatedModel: ModelGlbUser,
                collectionType: GlbCollection
            }
        ]
    });
    //获取初值
    var id = GetQueryString("id");
    var user = {};  //用户数据对象
    if (id) {
        $.ajax({
            type: "get",
            url: "/user/getUserById?id=" + id + "&random=" + Math.random(),
            async: false,
            success: function (ar) {
                user = ar.data;
            }
        });
    }
    //依据初值创建用户对象
    modelUser = new ModelUser(user);

    if (type == "xz") {
        var organName = decodeURI(decodeURI(GetQueryString("organName")));    //默认机构
        var organId = GetQueryString("organId");                       //机构id
        if (organId == "undefined" || organId == -1 || !organId) {
            organName = null;
            organId = null;
        }
        //从机构树上增加用户
        if (organName) {
            modelUser.set("organName", organName);
            modelUser.set("organId", organId);

        }
    }
    //依据初值创建主model实例
    modelUser.render(stateJson);

    //角色关联集合
    var roleGlbCollection = new GlbCollection();
    roleGlbCollection.add(getOrganRoleList(user.organId));

    //创建动态列表行view类
    var RoleGlbTrView = BaseElementView.extend({
        canCheck: false,
        tagName: 'tr',
        className: 'rx-grid-tr',
        renderEditMode: function () {    //实现渲染接口
            var view = this;
            var unuseTag = view.model.get("sfqy_st") == "UNVALID";
            var html = "<td style='text-align:center'>" + this.index + "</td>" +
                "<td style='text-align:center'><input type='text'  class='i_text' data-property='role_name' data-model='" + this.model.get("ModelName") + "'/></td>" +
                "<td style='text-align:center'><input type='text'  class='i_text' data-property='role_code' data-model='" + this.model.get("ModelName") + "'/></td>" +
                "<td style='text-align:center'><input type='text'  class='i_text' data-property='role_type_name' data-model='" + this.model.get("ModelName") + "'/></td>";
            if (unuseTag) {
                html += "<td style='text-align:center' title='否'><img src='" + RX.handlePath("/medias/images/baseModel/grid_no.png") + "' align='absmiddle'></td>";
            } else {
                html += "<td style='text-align:center' title='是'><img src='" + RX.handlePath("/medias/images/baseModel/grid_yes.png") + "' align='absmiddle'></td>";
            }
            var linkFlag = view.model.get("sfgl") == 1;
            if (type != "ck") {
                if (linkFlag) {
                    if (unuseTag) {
                        html += "<td style='text-align:center'><a class='qyjy' href='javascript:void(0)'>启用</a></td>";
                    } else {
                        html += "<td style='text-align:center'><a class='qyjy' href='javascript:void(0)'>禁用</a></td>";
                    }
                } else {
                    if (unuseTag) {
                        html += "<td style='text-align:center'><a class='qyjy' href='javascript:void(0)'>启用</a>&nbsp" +
                            "<a href='javascript:void(0)' onclick='delRole(\"" + this.model.get("ModelName") + "\")'>删除</a></td>";
                    } else {
                        html += "<td style='text-align:center'><a class='qyjy' href='javascript:void(0)'>禁用</a>&nbsp" +
                            "<a href='javascript:void(0)' onclick='delRole(\"" + this.model.get("ModelName") + "\")'>删除</a></td>";
                    }
                }
            }
            $(this.el).html(html);
            $(".qyjy", this.el).click(function () {
                changeState(view.model);
            });
            if (linkFlag) {
                $(this.el).addClass("linkRole");
            }
        }
    });
    var RoleGlbTableView = BaseTableView.extend({
        collA: null,         //先渲染的集合
        getControlHtml: function () { //实现控制区域渲染接口
            var controlstr = "<div class='page_title'>" +
                "<h1>关联角色</h1>";
            if (type == "ck") {
                controlstr += "</div>";
            } else {
                controlstr += "<ul class='action_button to_right'>";
                controlstr += "<li><a class='add'>新增</a></li>" +
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
            return new ModelGlbUser();
        },
        getNewTrView: function (item, mode, display, index) {  //实现接口，以关联创建的行view
            return new RoleGlbTrView({
                model: item,
                renderCallback: mode,
                display: display,
                index: index
            });
        },
        del: function () {
            var view = this;
            var dels = [];
            _.map(this.collection.models, function (model, key) {
                model.updateModel();
                if (model.checked == true) {
                    dels.push(model);
                }
            });
            if (dels.length > 0) {
                layer.confirm("您确定要删除这些信息吗？", function (index) {
                    $.each(dels, function (index, model) {
                        model.set("sfyx_st", "UNVALID");
                        model.checked = false;
                    });
                    view.render();
                    layer.close(index);
                });
            } else {
                layer.msg("请勾选要删除的信息", {icon: 0});
            }
        },
        add: function () {
            var url = "/role/roleSelect?func=getRole&roleId=" + getLinkRoleIds() + "&roleType=1,2";
            openStack(window, "选择角色", "medium", url);
        },
        render: function () {
            var view = this;
            this.index = 0;
            $(this.el).empty();
            //渲染控制区域，放入table的caption中
            $(this.el).append(view.getControlHtml());  //渲染标题和控制区域
            var table = $('<table  cellpadding="0" cellspacing="0" border="0" class="list"></table>');
            //渲染table的thead部分
            $(table).append(view.getTheadHtml());
            //同步两组col的数据
            asyncGlRole();
            //渲染collection
            if (this.collA != null && this.collA.models != null) {
                $.each(this.collA.models, function (key, model) {
                    if (model.get("sfyx_st") != "UNVALID") {
                        view.index++;
                        var viewel = view.getNewTrView(model, 'renderEditMode', true, view.index, view).render().el;
                        $(table).append(viewel);
                    }
                })
            }
            if (this.collection != null && this.collection.models != null) {
                $.each(this.collection.models, function (key, model) {
                    if (model.get("sfyx_st") != "UNVALID" && model.get("notShowTag") != "1") {
                        view.index++;
                        var viewel = view.getNewTrView(model, 'renderEditMode', true, view.index, view).render().el;
                        $(table).append(viewel);
                    }
                })
            }
            $(this.el).append(table);
            if (this.collA.models != null) {
                $.each(this.collA.models, function (index, model) {
                    model.render();
                })
            }
            view.modelRender();
        },
        //渲染model规则接口
        modelRender: function () {
            if (this.collection.models != null) {
                $.each(this.collection.models, function (index, model) {
                    model.render();
                })
            }
        },
        addNewItem: function (model) {
            var view = this;
            view.collection.push(model);
            view.render();
        }
    });
    roleGlbTableView = new RoleGlbTableView({
        collection: modelUser.get("sysGlbRoleList"),
        el: $("#roleList")
    });
    roleGlbTableView.collA = roleGlbCollection;
    roleGlbTableView.render();
    //保存
    $("#save").click(function () {
        if (modelUser.ruleValidate()) {
            $.ajax({
                type: "post",
                url: "/user/saveUser",
                data: {sysUser: modelUser.getJson()},
                dataType: "json",
                success: function (ar) {
                    if (typeof ar != "undefined" && ar.success) {
                        layer.msg("保存成功", {icon: 1});
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

//取消
function cancelCheck() {
    if (modelUser.changeValidate()) {
        layer.confirm("页面已修改，确认关闭吗", function (index) {
            layer.close(index);
            closeWin();
        });
        return false;
    }
    return true;
}


//添加treeType
function addOrganId() {
    return "&treeType=1";
}

//新增角色回调函数
function getRole(id, name, code, type, typeName) {
    roleGlbTableView.addNewItem(new ModelGlbUser({
        roleId: id,
        role_name: name,
        role_code: code,
        role_type: type,
        glType: 3,       //3表示用户
        sfqy_st: 'VALID',
        sfyx_st: 'VALID',
        sfgl: 2,   //2不关联
        role_type_name: typeName
    }));
}


//机构变动刷新角色关系列表
function changeOrganRoleList(organIds) {
    //变为获取数据，加入collection
    var colACollection = new GlbCollection();
    colACollection.add(getOrganRoleList(organIds));
    roleGlbTableView.collA = colACollection;
    roleGlbTableView.render();
}

//获取机构角色关联信息
function getOrganRoleList(organIds) {
    var glxxList;
    var map = {
        organIds: organIds
    };
    $.ajax({
        type: "post",
        url: "/role/getRoleByGlxx",
        data: {"map": JSON.stringify(map)},
        async: false,
        success: function (ar) {
            if (ar.success) {
                glxxList = ar.data;
            } else {
                layer.alert(ar.msg);
            }
        }
    });
    return glxxList;
}


//获取直接关联的角色ids
function getLinkRoleIds() {
    var models = roleGlbTableView.collection.models;
    var ids = [];
    for (var i = 0, maxLength = models.length; i < maxLength; i++) {
        if (models[i].get("sfyx_st") != "UNVALID") {
            ids.push(models[i].get("roleId"));
        }
    }
    return ids;
}

//删除关联的角色
function delRole(modelName) {
    layer.confirm("您确认要删除这条数据", function (index) {
        roleGlbTableView.collection.get(modelName).set("sfyx_st", "UNVALID");
        roleGlbTableView.render();
        layer.close(index);
    });
}

function asyncGlRole() {
    var collA = roleGlbTableView.collA.models,
        collALength = collA.length;
    var collB = roleGlbTableView.collection.models,
        collBLength = collB.length;
    //恢复所有collB的隐藏对象
    for (var iB = 0; iB < collBLength; iB++) {
        var mB = collB[iB];
        if (mB.get("sfyx_st") != "UNVALID" && mB.get("notShowTag") == "1") {
            mB.set("notShowTag", "");
        }
    }
    //同步collA和collB的显示状态和只显示一个
    for (var iA = 0; iA < collALength; iA++) {
        var mA = collA[iA];
        for (var iB = 0; iB < collBLength; iB++) {
            var mB = collB[iB];
            if (mB.get("sfyx_st") != "UNVALID" && mA.get("sfyx_st") != "UNVALID"
                && mB.get("roleId") == mA.get("roleId")) {
                mB.set("notShowTag", "1");
                mA.set("sfqy_st", mB.get("sfqy_st"));
                break;
            }
        }
    }
    //将collB所有无主的关联数据删除
    for (var iB = 0; iB < collBLength; iB++) {
        var mB = collB[iB];
        if (mB.get("sfyx_st") != "UNVALID" && mB.get("notShowTag") == ""
            && mB.get("sfgl") == "1") {
            mB.set("sfyx_st", "UNVALID");
        }
    }
}

function changeState(model) {
    model.set("sfqy_st", model.get("sfqy_st") == "UNVALID" ? "VALID" : "UNVALID");
    var coll;
    if (model.get("sfgl") == "1") {
        coll = roleGlbTableView.collection.models;
    } else {
        coll = roleGlbTableView.collA.models;
    }
    var hasTag = false;
    for (var i = 0, collLength = coll.length; i < collLength; i++) {
        var m = coll[i];
        if (m.get("sfyx_st") != "UNVALID"
            && m.get("roleId") == model.get("roleId")) {
            m.set("sfqy_st", model.get("sfqy_st"));
            hasTag = true;
            break;
        }
    }
    if (!hasTag) {
        roleGlbTableView.collection.add(new ModelGlbUser({
            id: null,
            roleId: model.get("roleId"),
            role_name: model.get("role_name"),
            role_code: model.get("role_code"),
            role_type: model.get("role_type"),
            role_type_name: model.get("role_type_name"),
            glId: null,
            glType: 3,
            notShowTag: null,
            sfqy_st: model.get("sfqy_st"),
            sfyx_st: "VALID",
            sfgl: 1
        }));
    }
    roleGlbTableView.render();
}

//选择所属机构回调函数
function organSelectCallback(organName, organId) {
    $.getEle("ModelUser", "organId").val(organId);
    $.getEle("ModelUser", "organName").val(organName);
    changeOrganRoleList(organId);
}
