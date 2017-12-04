//权限状态配置
//新增权限配置
var XzState = {
    ModelOrgan: {
        state: {
            disable: []
        }
    },
    ModelGlbOrgan: {
        state: {
            enable: []
        }
    }
};

//修改权限配置
var XgState = {
    ModelOrgan: {
        state: {
            disable: []
        }
    },
    ModelGlbOrgan: {
        state: {
            enable: []
        }
    }
};

//查看权限配置
var CkState = {
    ModelOrgan: {
        state: {
            enable: []
        }
    },
    ModelGlbOrgan: {
        state: {
            enable: []
        }
    }
};

//model渲染方案配置
var ModelOrganJson = {
    ModelOrgan: {
        id: {        //主键ID
            display: false
        },
        organName: {        //机构名称
            rules: {checkSave: ["notNull"]},
            maxLength: 50
        },
        fullName: {        //全称
            rules: {checkSave: ["notNull"]},
            maxLength: 50
        },
        sortNum: {        //顺序号
            rules: {checkKeyup: ["isIntGte"], checkSave: ["notNull"]},
            maxLength: 10
        },
        organCode: {        //机构编码
            rules: {checkKeyup: ["isCode"], checkSave: ["notNull"]},
            maxLength: 25
        },
        parentOrg: {        //上级机构ID
            display: false
        },
        parentName: {            //上级机构名称
            type: "layer",
            layerConfig: {
                url: "/tree/getTree?",
                title: "选择上级机构",
                callbackFunc: "sjmbSelectCallback",
                style: "tree",
                checkFunc: "addOrganId",
                canDelete: true
            },
            changeFunc: "emptyParent"
        },
        description: {        //备注
            maxLength: 100
        },
        sfkhf: {       //是否可恢复
            display: false,
            defaultValue: "0"
        },
        zgLeader: {     //主管领导
            display: false
        },
        zgLeaderMc: {     //主管领导名称
            type: "layer",
            layerConfig: {
                url: "/tree/getTree?treeType=4&selectType=ry&",
                title: "选择主管领导",
                callbackFunc: "zgLeaderSelectCallback",
                style: "tree",
                canDelete: true
            },
            changeFunc: "emptyZgLeader",
            ifForm: false
        },
        fgLeader: {     //分管领导
            display: false
        },
        fgLeaderMc: {     //分管领导名称
            type: "layer",
            layerConfig: {
                url: "/tree/getTree?treeType=4&selectType=ry&",
                title: "选择分管领导",
                callbackFunc: "fgLeaderSelectCallback",
                style: "tree",
                canDelete: true
            },
            changeFunc: "emptyFgLeader",
            ifForm: false
        },
        sfyx_st: {        //是否有效
            display: false,
            defaultValue: "VALID"
        }
    },
    ModelGlbOrgan: {
        id: {        //主键ID
            display: false
        },
        roleId: {
            display: false
        },
        role_name: {        //角色名称
            ifForm: false
        },
        role_code: {        //角色编码
            ifForm: false
        },
        role_type: {        //角色类型，
            ifForm: false
        },
        glId: {     //关联id
            display: false
        },
        glType: {    //关联类型，3：用户，1：岗位，2：机构
            display: false
        },
        role_type_name: {    //role_type名称
            ifForm: false
        },
        sfqy_st: {        //是否启用
            display: false,
            defaultValue: "VALID"
        },
        sfyx_st: {  //是否有效
            display: false,
            defaultValue: "VALID"
        }
    }
};


