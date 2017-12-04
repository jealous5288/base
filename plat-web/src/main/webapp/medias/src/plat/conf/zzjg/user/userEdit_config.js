//权限状态配置
//新增权限配置
var XzState = {
    ModelUser: {
        state: {
            disable: []
        }
    },
    ModelSSJG: {
        state: {
            disable: ["organName"]
        }
    },
    ModelGlbUser: {
        state: {
            enable: []
        }
    }
};
//修改权限配置
var XgState = {
    ModelUser: {
        state: {
            disable: []
        }
    },

    ModelGlbUser: {
        state: {
            enable: []
        }
    }
};

var CkState = {
    ModelUser: {
        state: {
            enable: []
        }
    },
    ModelGlbUser: {
        state: {
            enable: []
        }
    }
};
//model渲染方案配置
var ModelUserJson = {
    ModelUser: {
        id: {        //主键ID
            display: false
        },
        loginName: {        //登录名
            // rules: {checkValue:["checkLoginPwd"],checkSave: ["notNull","checkLoginPwd"]},
            rules: {checkValue: ["isCode"], checkSave: ["notNull"]},
            maxLength: 25
        },
        loginPwd: {        //登录密码
            defaultValue: "123",
            maxLength: 64
        },
        userName: {        //用户名
            rules: {checkSave: ["notNull"]},
            maxLength: 50
        },
        sex: {        //性别
            type: "dict",
            dictConfig: {
                dictCode: "XB",
                checkType: "radio"
            },
            rules: {checkSave: ["notNull"]},
            maxLength: 50
        },
        is_Blocked: {    //是否辅警
            rules: {checkSave: ["notNull"]},
            type: "dict",
            dictConfig: {
                dictCode: [
                    {code: 1, value: "是"},
                    {code: 0, value: "否"}
                ],
                checkType: "radio"
            },
            defaultValue: "0",
            changeFunc: "blockedChange"
        },
        organName: {        //默认机构
            type: "layer",
            layerConfig: {
                url: "/tree/getTree?treeType=1&userFlag=true&",
                title: "选择所属机构",
                callbackFunc: "organSelectCallback",
                style: "tree"
            }
        },
        organId: {        //默认机构ID
            display: false
        },
        sfkhf: {       //是否可恢复
            display: false,
            defaultValue: "0"
        },
        sfyx_st: {        //是否有效
            display: false,
            defaultValue: "VALID"
        }
    },
    ModelGlbUser: {
        id: {               //主键ID
            display: false
        },
        roleId: {           //角色id
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
        glId: {                //关联id
            display: false
        },
        glType: {             //关联类型，3：用户，1：岗位，2：机构
            display: false
        },
        role_type_name: {     //role_type名称
            ifForm: false
        },
        sfqy_st: {           //是否启用
            display: false,
            defaultValue: "VALID"
        },
        sfgl: {               //是否关联
            ifForm: false,
            display: false
        },
        notShowTag: {         //不显示标志
            ifForm: false,
            display: false
        },
        sfyx_st: {           //是否有效
            display: false,
            defaultValue: "VALID"
        }
    }
};

var userState = {
    ModelUser: {
        property: {
            dftOrganName: {}
        }
    }
};
