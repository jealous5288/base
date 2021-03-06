//权限状态配置
//新增权限配置
var XzState = {
    ModelMain: {
        state: {
            disable: []
        }
    },
    ModelPageAuth: {
        state: {
            enable: []
        }
    }
};

//查看权限配置
var CkState = {
    ModelMain: {
        state: {
            enable: []
        }
    },
    ModelPageAuth: {
        state: {
            enable: []
        }
    }
};

//修改权限配置
var XgState = {
    ModelMain: {
        state: {
            disable: []
        }
    },
    ModelPageAuth: {
        state: {
            enable: []
        }
    }
};

//model渲染方案配置
var ModelMainJson = {
    ModelMain: {
        pageId: {
            type: "dict",
            dictConfig: {
                reqInterface: "BindSelect",
                ifSearch: true
            },
            changeFunc: "givePage"
        }
    }
};

//model渲染方案配置
var ModelPageAuthJson = {
    ModelPageAuth: {
        id: {        //主键ID
            display: false
        },
        name: {        //权限名称
            rules: {checkSave: ["notNull"]},
            maxLength: 25
        },
        code: {        //权限编码
            rules: {checkSave: ["notNull"]},
            maxLength: 10
        },
        description: {       //权限描述
            rules: {checkValue: [], checkSave: ["notNull"]},
            maxLength: 100
        },
        pageAuthroleId: {}
    }
};
var ModelGlbRoleAuthRoleJson = {
    //ModelGlbRoleAuthRole
    ModelGlbRolePageAuthRole: {    //角色模块功能权限
        id: {
            display: false
        },
        roleId: {
            display: false
        },
        pageAuthroleId: {
            display: false
        },
        sfyx_st: {
            display: false,
            defaultValue: "VALID"
        }
    },
    ModelPage: {        //页面
        page_id: {        //主键ID
            display: false
        },
        name: {        //页面名称
            rules: {checkSave: ["notNull"]},
            disabled: true,
            maxLength: 25
        },
        sfyx_st: {
            display: false,
            defaultValue: "VALID"
        }
    }
};
