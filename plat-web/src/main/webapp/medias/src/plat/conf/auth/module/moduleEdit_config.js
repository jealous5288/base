var XzState = {
    ModelModule: {
        state: {
            disable: []
        }
    },
    ModelAuthRole: {
        state: {
            enable: []
        }
    }
};

//查看权限配置
var CkState = {
    ModelModule: {
        state: {
            enable: []
        }
    },
    ModelAuthRole: {
        state: {
            enable: []
        }
    }
};


//model渲染方案配置
var ModelModuleJson = {
    ModelModule: {
        id: {        //主键ID
            display: false
        },
        moduleName: {        //模块名称
            rules: {checkSave: ["notNull"]},
            maxLength: 25
        },
        moduleCode: {        //模块编码
            rules: {checkKeyup: ["isCode"], checkSave: ["notNull"]},
            maxLength: 20
        },
        pageNames: {        //关联页面名称  弹出层
            type: "layer",
            layerConfig: {     //在类型为数据字典时才有dictConfig
                url: "/page/pageSelect?mulChooseFlag=true&",
                title: "选择关联页面",
                checkFunc: "checkPage",
                callbackFunc: "pageSelectCallback"
            },
            ifForm: false
        },
        pageIds: {        //关联页面ids
            display: false
        },
        sfyx_st: {        //是否有效
            display: false,
            defaultValue: "VALID"
        }
    },
    ModelAuthRole: {
        id: {        //主键ID
            display: false
        },
        name: {        //权限名称
            rules: {checkSave: ["notNull"]},
            ifForm: false
        },
        code: {        //权限编码
            rules: {checkSave: ["notNull"]},
            ifForm: false
        },
        description: {    //描述
            ifForm: false
        },
        moduleId: {      //模块id
            display: false
        },
        authroleId: {      //权限id
            display: false
        },
        type: {   //type 1系统 2个人
            display: false,
            ifForm: false
        },
        sfyx_st: {        //是否有效
            display: false,
            defaultValue: "VALID"
        }
    }
};

