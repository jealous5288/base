//角色关联要素
//操作的数据
/*
 * childAll:子tree是否全部勾选或反选
 * checkFlag:子节点是否全选或者全不选  asyncAccess中使用
 * jlFlag  //节点是否级联  ，删除或者保存
 * initValue = 1  //节点是否已经保存
 * value :1保存的数据状态没变,2保存的数据状态变更  user数据使用，如：已近保存过的数据，value变为2，标识这条数据需要删除
 *
 * 组织机构：
 *      add：直接保存在perateArr数组中
 *      改变需要删除，级联的数据统一获取jlFlag为true的，不论是新增的还是修改的
 *      改变的不是级联，直接获取initValue=1的数据，看checked为true不变，false变化了，需要删除
 * 用户：
 *      个性增加
 *      个性排除
 *      已近保存的，需要删除 数组中value为2的
 * */

/*
 * saveArr1:保存的组织机构
 * saveUserArr1:保存的包含用户
 * removeUserArr1:保存的排除的用户
 * */
function roleZzjg(saveArr1, saveUserArr1, removeUserArr1) {
    var saveArr = saveArr1 || [],                //已经保存的组织机构
        saveUserArr = saveUserArr1 || {},        //已近保存的user，通过修改数组中对象的属性，保存时遍历法变化的
        removeUserArr = removeUserArr1 || {},    //已近排除的user  保存
        operateArr = [],                        //添加的组织机构
        addUserArr = {},                        //添加的user
        addRemoveUserArr = {},                  //新增排除的user
        parentTree,
        childTreeNode,
        zzjgUtils = {                           //工具包
            //从数组中获取指点对象的位置，对比属性一致，比如：arr中是id，obj也是id，biz可以是好几个，逗号隔开
            getArrIndexBySameParam: function (arr, obj, biz) {
                var index = -1;
                if (arr) {
                    var bizArr = [];
                    if (biz) {
                        bizArr = biz.split(",");
                    } else {
                        bizArr.push("id");
                    }
                    for (var i = 0, maxLength = arr.length; i < maxLength; i++) {
                        var arrObj = arr[i];
                        var selFlag = true;
                        for (var j = 0, maxBizLength = bizArr.length; j < maxBizLength; j++) {
                            if (obj[bizArr[j]] != arrObj[bizArr[j]]) {
                                selFlag = false;
                                break;
                            }
                            if (selFlag) {
                                index = i;
                            }
                        }
                    }
                }
                return index;
            },
            //从数组中获取指点对象的位置,数组和对象的比较属性不一致
            getArrIndexByDiffParam: function (arr, biz1, obj, biz2) {
                var index = -1;
                if (arr) {
                    if (!biz1) {
                        biz1 = "id";
                    }
                    if (!biz2) {
                        biz2 = "id";
                    }
                    for (var i = 0, maxLength = arr.length; i < maxLength; i++) {
                        var arrObj = arr[i];
                        if (obj[biz2] == arrObj[biz1]) {
                            index = i;
                            break;
                        }
                    }
                }
                return index;
            },
            //ztree的配置生成
            zTreeConfig: function (param) {
                return {
                    data: {
                        simpleData: {
                            enable: true,
                            idKey: "handleId",
                            pIdKey: "pId",
                            rootPId: 0
                        }
                    },
                    check: {
                        enable: true,
                        chkboxType: {"Y": "s", "N": "s"}
                    },
                    async: {
                        enable: true, type: "post", url: param.url,
                        autoParam: ["id", "lx"],
                        dataFilter: param.dataFilter
                    },
                    callback: {
                        onAsyncSuccess: param.onAsyncSuccess,
                        onClick: param.onClick,
                        onCheck: param.onCheck
                    },
                    view: {
                        expandSpeed: "",
                        selectedMulti: false
                    }
                };
            }
        },
        zzjgFunc = {                    //函数
            //父tree check事件
            parentZtreeOnCheck: function (event, treeId, treeNode) {
                function ztreeCheckFunc(treeNode, flag, treeId) {
                    if (!treeNode.initValue) {
                        //没有保存过的点
                        if (flag) {
                            //勾选，新增数据
                            operateArr.push(treeNode);
                        } else {
                            //反选，移除数据
                            var index = zzjgUtils.getArrIndexBySameParam(operateArr, treeNode);
                            if (index > -1) {
                                //s删除反勾的数据
                                operateArr.splice(index, 1);
                            }
                        }
                    }
                    //子tree是否全部勾选或反选
                    treeNode.childAll = flag;
                    //zree是当前节点的子tree
                    if (childTreeNode && childTreeNode.id == treeNode.id) {
                        //需要刷新子tree
                        zzjgFunc.createChildTree(treeId, treeNode);
                    }
                    //清空个性编辑的用户数据
                    if (addUserArr[treeNode.handleId]) {
                        addUserArr[treeNode.handleId].splice(0, addUserArr[treeNode.handleId].length);
                    }
                    if (addRemoveUserArr[treeNode.handleId]) {
                        addRemoveUserArr[treeNode.handleId].splice(0, addRemoveUserArr[treeNode.handleId].length);
                    }
                    //对已经保存的数据处理
                    if (flag && removeUserArr[treeNode.handleId]) {
                        var reArr = removeUserArr[treeNode.handleId];
                        for (var i = 0, maxLength = reArr.length; i < maxLength; i++) {
                            reArr[i].value = 2;   //数据变更
                        }
                    }
                    if (flag == false && saveUserArr[treeNode.handleId]) {
                        var saveA = saveUserArr[treeNode.handleId];
                        for (var i = 0, maxLength = saveA.length; i < maxLength; i++) {
                            saveA[i].value = 2;     //数据变更
                        }
                    }
                    //遍历数据子节点
                    if (treeNode.children && treeNode.children.length > 0) {
                        for (var i = 0, maxLength = treeNode.children.length; i < maxLength; i++) {
                            ztreeCheckFunc(treeNode.children[i], flag, treeId);
                        }
                    } else {
                        //没有展开，标记为级联
                        if (treeNode.isParent) {
                            //子节点是否全选或者全不选
                            treeNode.checkFlag = flag;
                            treeNode.jlFlag = true;
                        }
                    }
                }

                ztreeCheckFunc(treeNode, treeNode.checked, treeId);
            },
            parentAjaxDataFilter: function (treeId, parentNode, childNodes) {
                for (var i = 0, maxLength = childNodes.length; i < maxLength; i++) {
                    //当前数据是否在
                    var index = zzjgUtils.getArrIndexByDiffParam(saveArr, "glId", childNodes[i]);
                    if (index > -1) {
                        childNodes[i].initValue = 1;  //原始值为1，标记该条数据已经存储
                        childNodes[i].saveId = saveArr[index].id;
                    }
                    //父节点是自己手动勾选的，子节点应该也是这种状态
                    if (parentNode && (parentNode.checkFlag == true || parentNode.checkFlag == false)) {
                        childNodes[i].checkFlag = parentNode.checkFlag;
                        childNodes[i].checked = parentNode.checkFlag;
                        //false不用管
                        if (parentNode.checkFlag) {
                            //增加数据
                            var index1 = zzjgUtils.getArrIndexByDiffParam(saveArr, "glId", childNodes[i]);
                            if (index1 > -1) {
                                //已在保存了，不需要管理
                            } else {
                                operateArr.push(childNodes[i]);
                            }
                        }
                    } else {
                        //从save中获取
                        //可能自己操作的怎么办，怎么和save数据整合
                        if (index > -1) {
                            childNodes[i].checked = true;
                        }
                    }
                    //集成父节点的级联属性
                    if (parentNode && parentNode.jlFlag && childNodes[i].isParent) {
                        childNodes[i].jlFlag = true;
                    }
                    //如果父级是级联，节点所属用户也级联
                    if (parentNode && parentNode.jlFlag) {
                        childNodes[i].childAll = parentNode.checked;
                        //父级级联，
                        //处理个性用户
                        if (saveUserArr[childNodes[i].handleId]) {
                            for (var m = 0, userLength = saveUserArr[childNodes[i].handleId].length; m < userLength; m++) {
                                if (!parentNode.checked) {
                                    saveUserArr[childNodes[i].handleId][m].value = 2;
                                }
                            }
                        }
                        if (removeUserArr[childNodes[i].handleId]) {
                            for (var m = 0, userLength = removeUserArr[childNodes[i].handleId].length; m < userLength; m++) {
                                if (parentNode.checked) {
                                    removeUserArr[childNodes[i].handleId][m].value = 2;
                                }
                            }
                        }
                    }
                }
                if (parentNode) {
                    //不是级联到下级了，后台处理数据  级联flag为false
                    parentNode.jlFlag = false;
                }
                return childNodes;
            },
            parentZTreeOnClick: function (event, treeId, treeNode) {
                zzjgFunc.createChildTree(treeId, treeNode);
            },
            createChildTree: function (treeId, treeNode) {
                //记录用户tree区域选中的人，根据刷新数据
                var parentTree = $.fn.zTree.getZTreeObj(treeId),
                    chooseAllFalg;
                if (treeNode.childAll == true) {
                    //展开全部，然后添加到选择的数据中
                    chooseAllFalg = true;
                } else if (treeNode.childAll == false) {
                    //全部为false
                    chooseAllFalg = false;
                }

                function childAjaxDataFilter(treeId, parentNode, childNodes) {
                    if (chooseAllFalg || chooseAllFalg == false) {
                        for (var i = 0, maxLength = childNodes.length; i < maxLength; i++) {
                            childNodes[i].checked = chooseAllFalg;
                            //记录是否已经保存
                            if (parentNode) {
                                var index = zzjgUtils.getArrIndexByDiffParam(saveUserArr[treeNode.handleId], "glId", childNodes[i]);
                                if (index > -1) {
                                    childNodes[i].initValue = 1;
                                } else {
                                    index = zzjgUtils.getArrIndexByDiffParam(removeUserArr[treeNode.handleId], "glId", childNodes[i]);
                                    if (index > -1) {
                                        childNodes[i].initValue = 1;
                                    }
                                }
                            }
                        }
                    } else {
                        //从选着的数据中获取对于的数据，checked
                        //几个数据池   1、未展开选择的数据池  2、已展开选着的数据池 3、增加人选择的数据池  4、排除的人选择的数据池
                        for (var i = 0, maxLength = childNodes.length; i < maxLength; i++) {
                            //两段处理相似，可以整合
                            if (treeNode.checked) {
                                if (childNodes[i].lx == "jg") {
                                    childNodes[i].checked = true;
                                } else {
                                    //如果父节点勾选，子节点查看个性移除的  只会记录个性的数据
                                    //记录是否已经保存
                                    //本次操作的是否存在这个点
                                    var index = zzjgUtils.getArrIndexByDiffParam(removeUserArr[treeNode.handleId], "glId", childNodes[i]);
                                    //读取目前修改的值   1:保存  2：移除
                                    if (index > -1) {
                                        childNodes[i].initValue = 1;
                                        //读取目前的改变值
                                        //已经保存的个性操作
                                        var changeValue = removeUserArr[treeNode.handleId][index].value;
                                        //1标识未改变  2标识改变
                                        if (!changeValue || (changeValue && changeValue == 1)) {
                                            childNodes[i].checked = false;
                                        } else {
                                            childNodes[i].checked = true;
                                        }
                                    } else {
                                        //看是否在本次更新的操作中存在
                                        //本次个性操作
                                        var index1 = zzjgUtils.getArrIndexBySameParam(addRemoveUserArr[treeNode.handleId], childNodes[i]);
                                        if (index1 > -1) {
                                            childNodes[i].checked = false;
                                        } else {
                                            childNodes[i].checked = true;
                                        }
                                    }
                                }
                            } else {
                                if (childNodes[i].lx == "jg") {
                                    childNodes[i].checked = false;
                                } else {
                                    //如果父节点勾选，子节点查看个性移除的  只会记录个性的数据
                                    //记录是否已经保存
                                    //本次操作的是否存在这个点
                                    var index = zzjgUtils.getArrIndexByDiffParam(saveUserArr[treeNode.handleId], "glId", childNodes[i]);
                                    //读取目前修改的值   1:保存  2：移除
                                    if (index > -1) {
                                        childNodes[i].initValue = 1;
                                        //读取目前的改变值
                                        var changeValue = saveUserArr[treeNode.handleId][index].value;
                                        //1标识未改变  2标识改变
                                        if (!changeValue || (changeValue && changeValue == 1)) {
                                            childNodes[i].checked = true;
                                        } else {
                                            childNodes[i].checked = false;
                                        }
                                    } else {
                                        //看是否在本次更新的操作中存在
                                        var index1 = zzjgUtils.getArrIndexBySameParam(addUserArr[treeNode.handleId], childNodes[i]);
                                        if (index1 > -1) {
                                            childNodes[i].checked = true;
                                        } else {
                                            childNodes[i].checked = false;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    return childNodes;
                }

                function childZtreeOnCheck(event, treeId, treeNode1) {
                    //如果选择的是顶级节点，需要改变父节点的状态
                    //子节点个性操作了，父tree节点的属性置空
                    treeNode.childAll = null;
                    if (treeNode1.lx == "jg") {
                        //改变父tree节点状态
                        parentTree.checkNode(treeNode, treeNode1.checked, false);
                        if (!treeNode.initValue) {
                            if (treeNode1.checked) {
                                operateArr.push(treeNode1);
                            } else {
                                //移除
                                var index = zzjgUtils.getArrIndexBySameParam(operateArr, treeNode1);
                                if (index > -1) {
                                    operateArr.splice(index, 1);
                                }
                            }
                        }
                        //移除个性操作，有个性变为默认
                        var childNodes = treeNode1.children;
                        if (childNodes) {
                            for (var i = 0, maxLength = childNodes.length; i < maxLength; i++) {
                                if (childNodes[i].initValue) {
                                    //处理逻辑都是可以整合的
                                    if (treeNode1.checked) {
                                        var index = zzjgUtils.getArrIndexByDiffParam(saveUserArr[treeNode.handleId], "glId", childNodes[i]);
                                        if (index > -1) {
                                            saveUserArr[treeNode.handleId][index].value = 1;
                                        } else {
                                            var index1 = zzjgUtils.getArrIndexByDiffParam(removeUserArr[treeNode.handleId], "glId", childNodes[i]);
                                            if (index1 > -1) {
                                                //改变了
                                                removeUserArr[treeNode.handleId][index1].value = 2;
                                            }
                                        }
                                    } else {
                                        var index = zzjgUtils.getArrIndexByDiffParam(saveUserArr[treeNode.handleId], "glId", childNodes[i]);
                                        if (index > -1) {
                                            saveUserArr[treeNode.handleId][index].value = 2;
                                        } else {
                                            var index1 = zzjgUtils.getArrIndexByDiffParam(removeUserArr[treeNode.handleId], "glId", childNodes[i]);
                                            if (index1 > -1) {
                                                //改变了
                                                removeUserArr[treeNode.handleId][index1].value = 1;
                                            }
                                        }
                                    }
                                } else {
                                    //移除个性添加的  false -> true
                                    var index = zzjgUtils.getArrIndexBySameParam(addUserArr[treeNode.handleId], childNodes[i]);
                                    if (index > -1) {
                                        addUserArr[treeNode.handleId].splice(index, 1);
                                    } else {
                                        var index1 = zzjgUtils.getArrIndexBySameParam(addRemoveUserArr[treeNode.handleId], childNodes[i]);
                                        if (index1 > -1) {
                                            addRemoveUserArr[treeNode.handleId].splice(index1, 1);
                                        }
                                    }
                                }
                            }
                        }
                    } else if (treeNode1.lx == "ry") {
                        //机构+人员全部选
                        if (treeNode1.initValue) {
                            //在remove或者存在
                            //removeUserArr
                            //肯定在其中之一存在
                            var index = zzjgUtils.getArrIndexByDiffParam(saveUserArr[treeNode.handleId], "glId", treeNode1);
                            if (index > -1) {
                                saveUserArr[treeNode.handleId][index].value = (treeNode1.checked ? 1 : 2);
                            } else {
                                var index1 = zzjgUtils.getArrIndexByDiffParam(removeUserArr[treeNode.handleId], "glId", treeNode1);
                                if (index1 > -1) {
                                    removeUserArr[treeNode.handleId][index1].value = (treeNode1.checked ? 2 : 1)
                                }
                            }
                        } else {
                            //看是否在新增的中存在
                            if (treeNode1.checked) {
                                if (!addUserArr[treeNode.handleId]) {
                                    addUserArr[treeNode.handleId] = [];
                                }
                                //父节点为半勾状态
                                if (treeNode1.getParentNode().getCheckStatus().half) {
                                    addUserArr[treeNode.handleId].push(treeNode1);
                                } else {
                                    //全勾，移除个性数据
                                    addUserArr[treeNode.handleId] = [];
                                }
                                //在remvoe中移除
                                var index = zzjgUtils.getArrIndexBySameParam(addRemoveUserArr[treeNode.handleId], treeNode1);
                                if (index > -1) {
                                    addRemoveUserArr[treeNode.handleId].splice(index, 1);
                                }
                            } else {
                                if (!addRemoveUserArr[treeNode.handleId]) {
                                    addRemoveUserArr[treeNode.handleId] = [];
                                }
                                addRemoveUserArr[treeNode.handleId].push(treeNode1);
                                var index = zzjgUtils.getArrIndexBySameParam(addUserArr[treeNode.handleId], treeNode1);
                                if (index > -1) {
                                    addUserArr[treeNode.handleId].splice(index, 1);
                                }
                            }
                        }
                    }
                }

                childTreeNode = treeNode;
                //创建子tree
                $.fn.zTree.init($("#tree21"), zzjgUtils.zTreeConfig({
                    url: "/tree/organTree?hasTop=false&type=3&tid=" + treeNode.id + "&tlx=jg&childLx=ry",
                    dataFilter: childAjaxDataFilter,
                    onAsyncSuccess: expandFirstTreeNode(),
                    onCheck: childZtreeOnCheck
                }));
            }
        };
    //主要方法，生成ztree
    parentTree = $.fn.zTree.init($("#tree2"), zzjgUtils.zTreeConfig({
        url: "/tree/organTree?type=1&hasTop=false",
        dataFilter: zzjgFunc.parentAjaxDataFilter,
        onAsyncSuccess: expandFirstTreeNode(zzjgFunc.createChildTree),
        onClick: zzjgFunc.parentZTreeOnClick,
        onCheck: zzjgFunc.parentZtreeOnCheck
    }));
//获取保存的数据
    return {
        getSaveNodes: function () {
            var tree1 = parentTree;
            var organsDelDown = [];
            var organsDelSelf = [];
            var organsAddDown = [];
            var organsAddSelf = [];
            var jlFlagTrue = tree1.getNodesByParam("jlFlag", true);
            //处理级联数据
            for (var i = 0, maxLength = jlFlagTrue.length; i < maxLength; i++) {
                //无论是否保存，后台都需要重新刷数据
                if (jlFlagTrue[i].checked) {
                    organsAddDown.push(jlFlagTrue[i].id);
                } else {
                    organsDelDown.push(jlFlagTrue[i].id);
                }
            }
            var savedNodes = tree1.getNodesByParam("initValue", "1");
            for (var i = 0, maxLength = savedNodes.length; i < maxLength; i++) {
                //判断变更
                if (!savedNodes[i].checked && !savedNodes[i].jlFlag) {
                    organsDelSelf.push(savedNodes[i].id);
                }
            }
            //本次操作的组织机构
            for (var i = 0, maxLength = operateArr.length; i < maxLength; i++) {
                if (!operateArr[i].jlFlag) {
                    organsAddSelf.push(operateArr[i].id);
                }
            }
            //用户
            //1、处理变更的用户
            //数据统一删除
            var usersTurnSelf = [];
            for (var value in saveUserArr) {
                var val = saveUserArr[value];
                for (var i = 0, maxLength = val.length; i < maxLength; i++) {
                    if (val[i].value == 2) {
                        usersTurnSelf.push(val[i].id);
                    }
                }
            }
            for (var value in removeUserArr) {
                var val = removeUserArr[value];
                for (var i = 0, maxLength = val.length; i < maxLength; i++) {
                    if (val[i].value == 2) {
                        usersTurnSelf.push(val[i].id);
                    }
                }
            }
            //2、本次操作的用户
            //2.1增加的个性用户
            var addUserA = [];
            for (var value in addUserArr) {
                addUserA = addUserA.concat(addUserArr[value]);
            }
            var usersAddSelf = [];
            for (var i = 0, maxLength = addUserA.length; i < maxLength; i++) {
                usersAddSelf.push(addUserA[i].id);
            }
            //2.2排除的个性用户
            var remvoeUserA = [];
            for (var value in addRemoveUserArr) {
                remvoeUserA = remvoeUserA.concat(addRemoveUserArr[value]);
            }
            var usersDelSelf = [];
            for (var i = 0, maxLength = remvoeUserA.length; i < maxLength; i++) {
                usersDelSelf.push(remvoeUserA[i].id);
            }
            return {
                organsAddSelf: organsAddSelf.join(","),
                organsAddDown: organsAddDown.join(","),
                organsDelSelf: organsDelSelf.join(","),
                organsDelDown: organsDelDown.join(","),
                usersAddSelf: usersAddSelf.join(","),
                usersDelSelf: usersDelSelf.join(","),
                usersTurnSelf: usersTurnSelf.join(",")
            };
        }
    }
}
