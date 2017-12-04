$(function () {
    var id = GetQueryString("id");
    var roleType = GetQueryString("roleType");
    if (roleType != "3") {
        $("#center-tab").show().omTabs({
            lazyLoad: true
        });
        $.ajax({
            type: "post",
            url: "/role/getRoleGlDataList?roleIds=" + id,
            success: function (ar) {
                if (ar.success) {
                    var list = ar.data, inOrganList = [], outOrganList = [],
                        inPostList = [], outPostList = [], inUserList = [], outUserList = [];
                    if (list) {
                        for (var i = 0; i < list.length; i++) {
                            var sfqy = list[i].SFQY_ST;
                            if (list[i].GL_TYPE == 2) {
                                if (sfqy == 1) {
                                    inOrganList.push({id: list[i].ID, name: list[i].MC});
                                } else {
                                    outOrganList.push({id: list[i].ID, name: list[i].MC});
                                }
                            } else if (list[i].GL_TYPE == 1) {
                                if (sfqy == 1) {
                                    inPostList.push({id: list[i].ID, name: list[i].MC});
                                } else {
                                    outPostList.push({id: list[i].ID, name: list[i].MC});
                                }
                            } else if (list[i].GL_TYPE == 3) {
                                if (sfqy == 1) {
                                    inUserList.push({id: list[i].ID, name: list[i].MC});
                                } else {
                                    outUserList.push({id: list[i].ID, name: list[i].MC});
                                }
                            }
                        }
                    }
                    var modelNodeRole = new ModelNodeRole({
                        inOrganList: inOrganList,
                        outOrganList: outOrganList,
                        inPostList: inPostList,
                        outPostList: outPostList,
                        inUserList: inUserList,
                        outUserList: outUserList
                    });
                    buildRoleElementView("inOrgan", "启用组织：", modelNodeRole.get("inOrganList"), $("#inOrganTable"));
                    buildRoleElementView("outOrgan", "禁用组织：", modelNodeRole.get("outOrganList"), $("#outOrganTable"));
                    buildRoleElementView("inPost", "启用岗位：", modelNodeRole.get("inPostList"), $("#inPostTable"));
                    buildRoleElementView("outPost", "禁用岗位：", modelNodeRole.get("outPostList"), $("#outPostTable"));
                    buildRoleElementView("inUser", "启用用户：", modelNodeRole.get("inUserList"), $("#inUserTable"));
                    buildRoleElementView("outUser", "禁用用户：", modelNodeRole.get("outUserList"), $("#outUserTable"));
                } else {
                    layer.alert(ar.msg);
                }
            }
        });
    } else {
        $("#ruleElement").show();
        //角色与权限规则关联
        var ModelRule = DetailModel.extend({
            className: "ModelRule",
            initJson: modelRuleJson,
            setModelName: function () {
                this.set("ModelName", "ModelRule" + (++modelIndex));
            }
        });
        var ModelRuleCollection = Backbone.Collection.extend({
            model: ModelRule
        });
        //规则列表行view
        var RuleTrView = BaseElementView.extend({
            canCheck: false,
            tagName: 'tr',
            className: 'rx-grid-tr',
            renderEditMode: function () {    //实现渲染接口
                var html = "";
                html += "<td style='text-align:center'>" + this.index + "</td>";
                html += "<td style='text-align:center'><input type='text' class='i_text' data-property='rule_name' data-model='" + this.model.get("ModelName") + "'/>" + "</td>" +
                    "<td style='text-align:center'><input type='text' class='i_text' data-property='xgsj' data-model='" + this.model.get("ModelName") + "'/></td>" +
                    "<td style='text-align:center'><input type='text' class='i_text' data-property='description' data-model='" + this.model.get("ModelName") + "'/></td>";
                $(this.el).html(html);
            }
        });
        //创建规则动态列表主体view类
        var RuleTableView = BaseTableView.extend({
            getControlHtml: function () { //实现控制区域渲染接口
                var controlstr = "<div class='page_title'>" +
                    "<h1 class='ruleTitle'>动态逻辑规则</h1></div>";
                return controlstr;
            },
            getTheadHtml: function () {  //实现表头区域渲染接口
                var theads = "<thead>";
                theads += "<th style='width:10%'>序号</th>" +
                    "<th style='width:30%'>规则名称</th>  " +
                    "<th style='width:20%'>修改时间</th>  " +
                    "<th>描述</th></thead>";
                return theads;
            },
            getNewTrView: function (item, mode, display, index) {  //实现接口，以关联创建的行view
                return new RuleTrView({
                    model: item,
                    renderCallback: mode,
                    display: display,
                    index: index
                });
            }
        });
        $.ajax({
            type: "post",
            url: "/role/getRoleGlRule?roleId=" + id,
            success: function (ar) {
                if (ar.success) {
                    var ruleTableView = new RuleTableView({
                        collection: new ModelRuleCollection(ar.data),
                        el: $("#ruleElement").children()
                    });
                    ruleTableView.render();
                }
            }
        });
    }
});
