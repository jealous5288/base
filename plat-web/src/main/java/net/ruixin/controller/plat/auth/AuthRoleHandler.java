package net.ruixin.controller.plat.auth;

import net.ruixin.controller.BaseController;
import net.ruixin.domain.plat.auth.SysAuthRole;
import net.ruixin.service.plat.auth.IAuthRoleService;
import net.ruixin.util.data.AjaxReturn;
import net.ruixin.util.paginate.FastPagination;
import net.ruixin.util.resolver.FormModel;
import net.ruixin.util.resolver.SearchModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Map;

/**
 * Created by admin on 2016-10-19
 * 功能权限控制层——系统权限
 */
@Controller
@RequestMapping("/authRole")
public class AuthRoleHandler extends BaseController {

    @Autowired
    private IAuthRoleService authRoleService;

    /**
     * 根据ID查询功能权限信息
     *
     * @param authRoleId 功能权限ID
     * @return AjaxReturn
     */
    @ResponseBody
    @RequestMapping(value = "/getAuthRoleById")
    public AjaxReturn getAuthRoleById(Long authRoleId) {
        return new AjaxReturn().setSuccess(true).setData(authRoleService.getAuthRoleById(authRoleId));
    }

    /**
     * 查询功能权限列表
     *
     * @param map 查询条件
     * @return AjaxReturn
     */
    @ResponseBody
    @RequestMapping(value = "/getAuthRoleList")
    public AjaxReturn getAuthRoleList(@SearchModel Object map) {
        FastPagination fastPagination = authRoleService.getAuthRoleList((Map) map);
        return new AjaxReturn().setSuccess(true).setData(fastPagination);
    }

    /**
     * 保存功能权限信息
     *
     * @param sysAuthRole 功能权限信息
     * @return AjaxReturn
     */
    @ResponseBody
    @RequestMapping(value = "/saveAuthRole")
    public AjaxReturn saveAuthRole(@FormModel SysAuthRole sysAuthRole) {
        authRoleService.saveAuthRole(sysAuthRole);
        return new AjaxReturn().setSuccess(true).setData(sysAuthRole.getId());
    }


    /**
     * 删除或恢复功能权限信息
     *
     * @param authRoleId 功能权限ID
     * @param type       操作类型 0：删除  1：恢复
     * @return AjaxReturn
     */
    @ResponseBody
    @RequestMapping(value = "/delOrAbleAuthRole")
    public AjaxReturn delOrAbleAuthRole(Long authRoleId, String type) {
        authRoleService.delOrAbleAuthRole(authRoleId, type);
        return new AjaxReturn(true);
    }

}
