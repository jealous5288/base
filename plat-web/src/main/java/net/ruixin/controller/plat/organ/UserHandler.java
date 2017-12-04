package net.ruixin.controller.plat.organ;

import net.ruixin.controller.BaseController;
import net.ruixin.domain.plat.organ.SysUser;
import net.ruixin.service.plat.organ.IUserService;
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
 * Created by admin on 2016-8-17.
 * 用户控制层
 */
@Controller
@RequestMapping("/user")
public class UserHandler extends BaseController {

    @Autowired
    private IUserService userService;

    /**
     * 根据ID查询用户信息
     *
     * @param id 用户ID
     * @return AjaxReturn
     */
    @ResponseBody
    @RequestMapping(value = "/getUserById")
    public AjaxReturn getUserById(Long id) {
        return new AjaxReturn().setSuccess(true).setData(userService.getUserById(id));
    }

    /**
     * 查询用户列表
     *
     * @param map        查询条件
     * @param hasDelData 是否查询已删数据  不传参：默认为不查     否则为查
     * @return AjaxReturn
     */
    @ResponseBody
    @RequestMapping(value = "/getUserList")
    public AjaxReturn getUserList(@SearchModel Object map, String hasDelData) {
        FastPagination fastPagination = userService.getUserList((Map) map, hasDelData);
        return new AjaxReturn().setSuccess(true).setData(fastPagination);
    }

    /**
     * 保存用户信息
     *
     * @param sysUser 用户信息
     * @return AjaxReturn
     */
    @ResponseBody
    @RequestMapping(value = "/saveUser")
    public AjaxReturn saveUser(@FormModel SysUser sysUser) {
        userService.saveUser(sysUser);
        return new AjaxReturn().setSuccess(true).setData(sysUser.getId());
    }

    /**
     * 删除或恢复用户
     *
     * @param userId 用户id
     * @param type   操作类型 0：删除  1：恢复   2:停用
     * @return AjaxReturn
     */
    @ResponseBody
    @RequestMapping(value = "/delOrAbleUser")
    public AjaxReturn delOrAbleUser(Long userId, String type) {
        userService.delOrAbleUser(userId, type);
        return new AjaxReturn(true);
    }

    /**
     * 查询获取用户关联角色信息
     *
     * @param id 用户id
     * @return AjaxReturn
     */
    @ResponseBody
    @RequestMapping(value = "/userGlxx")
    public AjaxReturn getUserGlxx(Long id) {
        Map map = userService.getUserGlxx(id);
        return new AjaxReturn().setSuccess(true).setData(map);
    }

    /**
     * 保存用户关联菜单的关联关系
     *
     * @param userId  用户id
     * @param menuIds 菜单ids
     * @return AjaxReturn
     */
    @ResponseBody
    @RequestMapping(value = "/saveUserMenu")
    public AjaxReturn saveUserMenu(Long userId, String menuIds) {
        userService.saveUserMenu(userId, menuIds);
        return new AjaxReturn().setSuccess(true);
    }

    /**
     * 通过用户名称查询用户列表（排除同部门、排除已选择）
     *
     * @param name   用户name
     * @param ssbmId 所属部门id
     * @param ids    已选择用户id
     * @return AjaxReturn
     */
    @ResponseBody
    @RequestMapping(value = "/getUserByName")
    public AjaxReturn getUserByName(String name, Long ssbmId, String ids) {
        return new AjaxReturn().setSuccess(true).setData(userService.getUserByName(name, ssbmId, ids));
    }

}
