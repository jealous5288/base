//权限状态配置
//新增权限配置
var XzState = {
    ModelRole: {
        state: {
            disable: []
        }
    },
    ModelRoleGlb: {
        state: {
            enable: []
        }
    },
    ModelGlbRoleAuthRule: {
        state: {
            enable: []
        }
    }
};

//查看权限配置
var CkState = {
    ModelRole: {
        state: {
            enable: []
        }
    },
    ModelRoleGlb: {
        state: {
            enable: []
        }
    },
    ModelGlbRoleAuthRule: {
        state: {
            enable: []
        }
    }
};

//model渲染方案配置
var ModelRoleJson = {
    ModelRole: {
        id: {        //主键ID
            display: false
        },

        roleName: {        //角色名称
            rules: {checkSave: ["notNull"]},
            maxLength: 25
        },
        roleCode: {        //角色编码
            rules: {checkKeyup: ["isCode"], checkSave: ["notNull"]},
            maxLength: 10
        },
        description: {},
        roleType: {        //角色类型
            rules: {checkSave: ["notNull"]},
            type: "dict",
            // defaultValue:1,
            dictConfig: {
                dictCode: "JSLX"
            }
        },
        levels: {        //级别
            rules: {checkSave: ["notNull"]},
            type: "dict",
            defaultValue: 3,
            dictConfig: {
                dictCode: "SYSLEVEL"
            }
        },
        authType: {     //数据规则类型
            type: "dict",
            dictConfig: {
                dictCode: "SJQXLX"
            }
        },
        sfyx_st: {        //是否有效
            display: false,
            defaultValue: "VALID"
        }
    },
    ModelRoleGlb: {                    //角色要素关联
        id: {        //主键ID
            display: false
        },
        roleId: {        //角色ID
            display: false
        },
        glId: {         //关联要素id
            display: false
        },
        glysName: {         //要素名称
            ifForm: false
        },
        glType: {          //关联类型，3：用户，1：岗位，2：机构

        },
        glysSsjg: {      //默认机构

        },
        glTypeName: {          //关联类型名称
            ifForm: false
        },
        sfqy_st: {          //启动/禁用
            display: false
        },
        sfyx_st: {          //
            display: false,
            defaultValue: "VALID"
        }
    },
//    ModelGlbRoleAuthRole
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
    ModelPage: {        //页面Model
        page_id: {        //主键ID
            display: false
        },
        name: {        //模块名称
            rules: {checkSave: ["notNull"]},
            disabled: true,
            maxLength: 50
        },
        sfyx_st: {
            display: false,
            defaultValue: "VALID"
        }
    },
    ModelGlbRoleAuthRule: {     //    角色与权限规则关联
        id: {
            display: false
        },
        roleId: {             //角色id
            display: false
        },
        ruleId: {             //规则id
            display: false
        },
        ruleName: {               //规则名称
            ifForm: false
        },
        ruleXgsj: {                  //修改时间
            type: "date",
            ifForm: false
        },
        description: {           //描述
            ifForm: false
        },
        sfyx_st: {              //是否有效
            display: false,
            defaultValue: "VALID"
        }
    }
};

//搜索部分配置
var SUserJson = {
    SUser: {
        user_name: {
            tagName: "用户名称",
            maxLength: 40
        },
        organ_name: {
            tagName: "所属机构",
            maxLength: 40
        }

    }
};
//规定表头
var columns = [
    {title: '用户名称', id: 'USER_NAME', width: '', align: 'center', renderer: "String"},
    {title: '所属机构', id: 'ORGAN_NAME', width: '50%', align: 'center', renderer: "String"}
];
var id = GetQueryString("id");
//用户列表主配置
var ModelUserList_Propertys = {
    ModelName: "ModelUserList", //模型名称
    url: "getRoleGlbUser?roleId=" + id,  //请求列表数据的url 已自动添加了random不需要在加randon
    columns: columns,
    searchJson: SUserJson,
    SearchModelName: "SUser",
    limit: 9
};

