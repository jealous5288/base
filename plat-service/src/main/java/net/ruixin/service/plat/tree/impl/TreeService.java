package net.ruixin.service.plat.tree.impl;

import net.ruixin.dao.plat.organ.IOrganDao;
import net.ruixin.dao.plat.organ.IUserDao;
import net.ruixin.domain.plat.organ.SysOrgan;
import net.ruixin.service.plat.tree.ITreeService;
import net.ruixin.util.config.LocalConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 树-数据封装
 */
@Service
public class TreeService implements ITreeService {

    @Autowired
    private IOrganDao organDao;
    @Autowired
    private IUserDao userDao;

    /**
     * 树
     *
     * @param id         节点ID
     * @param lx         节点类型，“jg”：机构，“gw”：岗位，“ry”：人员
     * @param tid        顶级节点ID
     * @param tlx        顶级节点类型，“jg”：机构，“gw”：岗位
     * @param filterId   过滤id
     * @param filterLx   过滤类型
     * @param type       1：机构树，2：机构岗位树，3：机构用户树，4：机构岗位用户树
     * @param hasTop     是否有顶级"机构"  false：否  其它：是
     * @param hasNoOrgan 是否有 无组织要素  默认为否
     * @param hasDelData 是否查询已删数据  不传参：默认为不查     否则为查
     * @return jsonList
     */
    @Override
    public List getTreeDataList(Long id, String lx, Long tid, String tlx, Long filterId, String filterLx,
                                String type, Boolean hasTop, String hasNoOrgan, String hasDelData, String childLx) {
        List<Map<String, Object>> jsonList = new ArrayList<>();
        if (null == id) {  //初次展开树
            if (null != tid) { //有顶级具体节点
                Map<String, Object> tempMap = new HashMap<>();
                tempMap.put("handleId", (tid + "jg"));
                tempMap.put("id", tid);
                tempMap.put("pId", ("" + "jg"));
                tempMap.put("isParent", true);
                tempMap.put("sfyx_st", "1");
                tempMap.put("sfkhf", "0");
                if ("jg".equals(tlx)) {
                    SysOrgan sysOrgan = organDao.getOrganById(tid);
                    tempMap.put("name", sysOrgan.getOrganName());
                    tempMap.put("lx", "jg");
//                    tempMap.put("icon", LocalConfig.getInstance().getProperty("organIcon"));
                }
                jsonList.add(tempMap);
            } else if (!Boolean.FALSE.equals(hasTop)) { //没有顶级具体节点，有顶级"机构"
                Map<String, Object> tempMap = new HashMap<>();
                tempMap.put("handleId", ("0" + "jg"));
                tempMap.put("id", 0);
                tempMap.put("name", "机构");
                tempMap.put("pId", ("" + "jg"));
                tempMap.put("isParent", true);
                tempMap.put("lx", "jg");
//                tempMap.put("icon", LocalConfig.getInstance().getProperty("organIcon"));
                tempMap.put("sfyx_st", "1");
                tempMap.put("sfkhf", "0");
                jsonList.add(tempMap);
            } else { //没有顶级具体节点，没有顶级“机构”
                this.getOrganList(jsonList, null, type, filterId, filterLx, hasDelData);
                if (hasNoOrgan != null) //判断是否显示无机构用户
                    this.addNoOrgan(jsonList, null);
            }
        } else {
            if (id == 0) {  //顶级"机构"
                this.getOrganList(jsonList, id, type, filterId, filterLx, hasDelData);
                if (hasNoOrgan != null) //判断是否显示无机构用户
                    this.addNoOrgan(jsonList, id);
            } else if (id == -1) {  //无组织 用户：无机构用户一定也无岗位，不存在无机构有岗位的情况
                if ("3".equals(type) || "4".equals(type)) {
                    this.getWjgWgwUserList(jsonList, hasDelData);
                }
            } else {
                if ("ry".equals(childLx)) {
                    this.getUserList(jsonList, id, hasDelData);
                } else {
                    if ("jg".equals(lx)) {
                        this.getOrganList(jsonList, id, type, filterId, filterLx, hasDelData);
                        switch (type) {
                            case "2":
                                if (LocalConfig.getInstance().getProperty("isPostExist").equals("true")) {
                                }
                                break;
                            case "3":
                                this.getUserList(jsonList, id, hasDelData);
                                break;
                            case "4":
                                if (LocalConfig.getInstance().getProperty("isPostExist").equals("true")) {
                                    //获取机构下无岗位用户
                                    this.getWgwUserList(jsonList, id, hasDelData);
                                } else {
                                    this.getUserList(jsonList, id, hasDelData);
                                }
                                break;
                            default:
                                break;
                        }
                    }
                }
            }
        }
        return jsonList;
    }

    //获取机构
    private void getOrganList(List<Map<String, Object>> jsonList, Long id, String type, Long filterId, String filterLx, String hasDelData) {
        List<Map<String, Object>> organList = organDao.getOrganListByParentId(id, hasDelData);
        Map<String, Object> organMap;
        for (Map<String, Object> map : organList) {
            if (filterId != null && "jg".equals(filterLx) && filterId.toString().equals(map.get("ID").toString())) {
                continue;
            }
            organMap = new HashMap<>();
            organMap.put("handleId", (map.get("ID") + "jg"));
            organMap.put("id", map.get("ID"));
            organMap.put("name", map.get("MC"));
            organMap.put("qc", map.get("QC"));
            organMap.put("pId", (id == null ? "" : id) + "jg");
            switch (type) {
                case "1":
                    organMap.put("isParent", Integer.parseInt(map.get("JGCT").toString()) > 0);
                    break;
                case "2":
                    organMap.put("isParent", (Integer.parseInt(map.get("JGCT").toString()) +
                            Integer.parseInt(map.get("GWCT").toString())) > 0);
                    break;
                case "3":
                    organMap.put("isParent", (Integer.parseInt(map.get("JGCT").toString()) +
                            Integer.parseInt(map.get("USERCT").toString())) > 0);
                    break;
                case "4":
                    organMap.put("isParent", (Integer.parseInt(map.get("JGCT").toString()) +
                            Integer.parseInt(map.get("GWCT").toString()) +
                            Integer.parseInt(map.get("USERCT").toString())) > 0);
                    break;
                default:
                    break;
            }
            organMap.put("lx", "jg");
//            organMap.put("icon", LocalConfig.getInstance().getProperty("organIcon"));
            organMap.put("sfyx_st", map.get("SFYX_ST"));
            organMap.put("sfkhf", map.get("SFKHF"));
            jsonList.add(organMap);
        }
    }


    //获取用户
    private void getUserList(List<Map<String, Object>> jsonList, Long id, String hasDelData) {
        List<Map<String, Object>> userList = userDao.getUserListByOrganId(id, hasDelData);
        Map<String, Object> userMap;
        for (Map<String, Object> map : userList) {
            userMap = new HashMap<>();
            userMap.put("handleId", map.get("ID"));
            userMap.put("id", map.get("ID"));
            userMap.put("name", map.get("MC"));
            userMap.put("pId", id);
            userMap.put("isParent", false);
            userMap.put("lx", "ry");
//            userMap.put("icon", LocalConfig.getInstance().getProperty("userIcon"));
            userMap.put("sfyx_st", map.get("SFYX_ST"));
            userMap.put("sfkhf", map.get("SFKHF"));
            jsonList.add(userMap);
        }
    }

    //无机构用户节点
    private void addNoOrgan(List<Map<String, Object>> jsonList, Long id) {
        Map<String, Object> userOrPostMap = new HashMap<>();
        userOrPostMap.put("handleId", ("-1" + "jg"));
        userOrPostMap.put("id", -1);
        userOrPostMap.put("name", "无机构-用户");
//        userOrPostMap.put("icon", LocalConfig.getInstance().getProperty("userIcon"));
        userOrPostMap.put("pId", (id == null ? "" : id) + "jg");
        userOrPostMap.put("isParent", true);
        userOrPostMap.put("lx", "jg");
        jsonList.add(userOrPostMap);
    }

    //有机构但无岗位用户
    private void getWgwUserList(List<Map<String, Object>> jsonList, Long id, String hasDelData) {
        List<Map<String, Object>> wgwUserList = userDao.getWgwUserListByOrganId(id, hasDelData);
        Map<String, Object> wgwMap;
        for (Map<String, Object> map : wgwUserList) {
            wgwMap = new HashMap<>();
            wgwMap.put("handleId", map.get("ID"));
            wgwMap.put("id", map.get("ID"));
            wgwMap.put("name", map.get("MC"));
            wgwMap.put("pId", id);
            wgwMap.put("isParent", false);
            wgwMap.put("lx", "ry");
//            wgwMap.put("icon", LocalConfig.getInstance().getProperty("userIcon"));
            wgwMap.put("sfyx_st", map.get("SFYX_ST"));
            wgwMap.put("sfkhf", map.get("SFKHF"));
            jsonList.add(wgwMap);
        }
    }

    //无机构无岗位用户
    private void getWjgWgwUserList(List<Map<String, Object>> jsonList, String hasDelData) {
        List<Map<String, Object>> wjgWgwUserList = userDao.getWjgWgwUserList(hasDelData);
        Map<String, Object> wgwMap;
        for (Map<String, Object> map : wjgWgwUserList) {
            wgwMap = new HashMap<>();
            wgwMap.put("handleId", map.get("ID"));
            wgwMap.put("id", map.get("ID"));
            wgwMap.put("name", map.get("MC"));
            wgwMap.put("pId", -1);
            wgwMap.put("isParent", false);
            wgwMap.put("lx", "ry");
//            wgwMap.put("icon", LocalConfig.getInstance().getProperty("userIcon"));
            wgwMap.put("sfyx_st", map.get("SFYX_ST"));
            wgwMap.put("sfkhf", map.get("SFKHF"));
            jsonList.add(wgwMap);
        }
    }


}

