package net.ruixin.controller.plat.auth;

import net.ruixin.controller.BaseController;
import net.ruixin.domain.plat.auth.SysGlbRoleAuthRule;
import net.ruixin.domain.plat.auth.SysRole;
import net.ruixin.service.plat.auth.IRoleService;
import net.ruixin.util.data.AjaxReturn;
import net.ruixin.util.paginate.FastPagination;
import net.ruixin.util.resolver.CollectionModel;
import net.ruixin.util.resolver.FormModel;
import net.ruixin.util.resolver.JsonModel;
import net.ruixin.util.resolver.SearchModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
import java.util.Map;

/**
 * Created by admin on 2016-8-24.
 * 角色控制类
 */
@Controller
@RequestMapping("/role")
public class RoleHandler extends BaseController {

    @Autowired
    private IRoleService roleService;

    /**
     * 根据ID查询角色信息
     *
     * @param id 角色ID
     * @return AjaxReturn
     */
    @ResponseBody
    @RequestMapping("/getRoleById")
    public AjaxReturn getRoleById(Long id) {
        SysRole sysRole = roleService.getRoleById(id);
        //只有是业务角色时才会查找关联要素，否则置空
        if (!"2".equals(sysRole.getRoleType())) {
            sysRole.setSysGlbRoleList(null);
        }
        return new AjaxReturn().setSuccess(true).setData(sysRole);
    }

    /**
     * 根据角色ID查询关联要素信息
     *
     * @param roleIds 角色IDs,逗号拼接的ID字符串
     * @return AjaxReturn
     */
    @ResponseBody
    @RequestMapping("/getRoleGlDataList")
    public AjaxReturn getRoleGlDataList(String roleIds) {
        List list = roleService.getRoleGlDataList(roleIds);
        return new AjaxReturn().setSuccess(true).setData(list);
    }

    /**
     * 根据角色id查询工作流name
     *
     * @param id 角色ID
     * @return AjaxReturn
     */
    @ResponseBody
    @RequestMapping("/getWFNameByRoleId")
    public AjaxReturn getWFNameByRoleId(Long id) {
        return roleService.getWFNameByRoleId(id);
    }

    /**
     * 保存角色信息
     *
     * @param sysRole 角色信息
     * @return AjaxReturn
     */
    @ResponseBody
    @RequestMapping("/saveRole")
    public AjaxReturn saveRole(@FormModel SysRole sysRole) {
        roleService.saveRole(sysRole);
        return new AjaxReturn().setSuccess(true).setData(sysRole.getId());
    }


    /**
     * 查询角色列表
     *
     * @param map map中除了包括分页查询的条件外，还包括以下参数：
     *            roleName:角色名称 roleCode:角色代码 roleType:角色类型
     *            glType:关联类型(2-组织机构 1-岗位 3-用户) gl_id:关联id
     * @return AjaxReturn
     */
    @ResponseBody
    @RequestMapping("/getRoleList")
    public AjaxReturn getRoleList(@SearchModel Object map) {
        FastPagination fastPagination = roleService.getRoleList((Map) map);
        return new AjaxReturn().setSuccess(true).setData(fastPagination);
    }

    /**
     * 删除角色信息
     *
     * @param id 角色ID
     * @return AjaxReturn
     */
    @ResponseBody
    @RequestMapping("/deleteRole")
    public AjaxReturn deleteRole(Long id) {
        roleService.deleteRole(id);
        return new AjaxReturn(true);
    }

    /**
     * 通过关联要素信息获取角色信息
     *
     * @param map organIds postIds 关联类型 3：用户 1：岗位 2：机构
     * @return AjaxReturn
     */
    @ResponseBody
    @RequestMapping("/getRoleByGlxx")
    public AjaxReturn getRoleByGlxx(@JsonModel Object map) {
        return new AjaxReturn().setSuccess(true).setData(roleService.getRoleByGlxx((Map) map));
    }

    /**
     * 查询角色下有无关联用户
     *
     * @param roleId 角色id
     * @return AjaxReturn
     */
    @ResponseBody
    @RequestMapping("/checkRoleHasUser")
    public AjaxReturn checkRoleHasUser(Long roleId) {
        return new AjaxReturn().setSuccess(true).setData(roleService.checkRoleHasUser(roleId));
    }

    /**
     * 查询角色下关联规则
     *
     * @param roleId 角色id
     * @return AjaxReturn
     */
    @ResponseBody
    @RequestMapping("/getRoleGlRule")
    public AjaxReturn getRoleGlRule(Long roleId) {
        return new AjaxReturn().setSuccess(true).setData(roleService.getRoleGlRule(roleId));
    }

    /*
    * 查询系统角色关联用户
    * @param map 查询条件
    * @param roleId 角色id
    * */
    @ResponseBody
    @RequestMapping("/getRoleGlbUser")
    public AjaxReturn getRoleGlbUser(@SearchModel Object map, String roleId) {
        FastPagination fastPagination = new FastPagination();
        if (!"null".equals(roleId)) {
            fastPagination = roleService.getRoleGlbUser((Map) map, Long.parseLong(roleId));
        }
        return new AjaxReturn().setSuccess(true).setData(fastPagination);
    }

    /**
     * 根据角色id获取角色关联信息
     *
     * @param roleId 角色id
     */
    @ResponseBody
    @RequestMapping("/getGlxxByRole")
    public AjaxReturn getGlxxByRole(Long roleId) {
        return new AjaxReturn(true).setData(roleService.getGlxxByRole(roleId));
    }

    /**
     * 角色管理 交互改造测试使用****************
     *
     * @param roleId        角色ID
     * @param organsAddSelf 机构增加 自身
     * @param organsAddDown 机构增加 向下级联
     * @param organsDelSelf 机构删除 自身
     * @param organsDelDown 机构删除 向下级联
     * @param usersAddSelf  用户增加 （包含）
     * @param usersDelSelf  用户删除（排除）
     * @param usersTurnSelf 转变
     * @return ar
     */
    @ResponseBody
    @RequestMapping("/saveRoleGlxx")
    public AjaxReturn saveRoleGlxx(Long roleId, String organsAddSelf, String organsAddDown, String organsDelSelf,
                                   String organsDelDown, String usersAddSelf, String usersDelSelf, String usersTurnSelf
    ) {
        Object[] params = new Object[]{roleId, organsAddSelf, organsAddDown,
                organsDelSelf, organsDelDown, usersAddSelf, usersDelSelf, usersTurnSelf};
        roleService.saveRoleGlxx(params);
        return new AjaxReturn(true);
    }

    /**
     * 根据角色id获取角色关联动态规则
     *
     * @param roleId 角色id
     */
    @ResponseBody
    @RequestMapping("/getRuleByRole")
    public AjaxReturn getRuleByRole(Long roleId) {
        return new AjaxReturn(true).setData(roleService.getRuleByRole(roleId));
    }

    /**
     * 保存角色信息
     *
     * @return AjaxReturn
     */
    @ResponseBody
    @RequestMapping("/saveRoleRule")
    public AjaxReturn saveRoleRule(@CollectionModel(target = SysGlbRoleAuthRule.class) Object list) {
        roleService.saveRoleRule((List<SysGlbRoleAuthRule>) list);
        return SUCCESS;
    }
}
