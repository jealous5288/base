//model渲染方案配置
var ModelAuthRoleJson = {
    ModelAuthRole: {
        id: {        //主键ID
            display: false
        },
        name: {        //模块名称
            rules: {checkSave: ["notNull"]},
            maxLength: 25
        },
        code: {        //模块编码
            rules: {checkKeyup: ["isCode"], checkSave: ["notNull"]},
            maxLength: 10
        },
        description: {          //描述
            maxLength: 100
        },
        type: {         //功能权限类型  1：系统权限   2：自定义权限
            display: false
        },
        sfyx_st: {        //是否有效
            display: false,
            defaultValue: "VALID"
        }
    }
};

//新增权限
var XzState = {
    ModelAuthRole: {
        state: {
            disable: []
        }
    }
};

//查看权限配置
var CkState = {
    ModelAuthRole: {
        state: {
            enable: []
        }
    }
};
