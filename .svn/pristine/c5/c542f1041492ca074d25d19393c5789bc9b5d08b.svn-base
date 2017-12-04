package net.ruixin.controller.plat.auth;

import net.ruixin.controller.BaseController;
import net.ruixin.domain.plat.auth.SysDataAuth;
import net.ruixin.service.plat.auth.IAuthCfgService;
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
 * Created by admin on 2016-9-22.
 * 权限控制类——功能权限、数据权限
 */
@Controller
@RequestMapping("/auth")
public class AuthCfgHandler extends BaseController {

    @Autowired
    private IAuthCfgService authCfgService;

    /**
     * 通过模块id获取模块包含的功能权限
     *
     * @return AjaxReturn
     */
    @ResponseBody
    @RequestMapping(value = "/getAuthRoleList")
    public AjaxReturn getAuthRoleListByPageId(Long id) {
        AjaxReturn ar = new AjaxReturn();
        return ar.setSuccess(true).setData(authCfgService.getAuthRoleListByPageId(id));
    }

    /**
     * 通过角色id获取页面及页面对应的功能权限
     *
     * @param roleId 角色id
     * @return AjaxReturn
     */
    @ResponseBody
    @RequestMapping(value = "/getAuthRoleListByRoleId")
    public AjaxReturn getAuthRoleListByRoleId(Long roleId) {
        return new AjaxReturn().setSuccess(true).setData(authCfgService.getAuthRoleListByRoleId(roleId));
    }


    /**
     * 数据权限管理模块  关联对象的弹出层使用  查询配置了数据权限的对象列表
     *
     * @param map 可根据objectName查询
     * @return AjaxReturn
     */
    @ResponseBody
    @RequestMapping(value = "/getObjectList")
    public AjaxReturn getObjectList(@SearchModel Object map) {
        return new AjaxReturn().setSuccess(true).setData(authCfgService.getObjectList((Map) map));
    }

    /**
     * 查询当前用户对该对象的数据权限
     *
     * @param map 含user_id,obj_id,module_id,db_name 数据库表名,field_names 数据库表字段名  module_id不必传，其余必传
     * @return AjaxReturn
     */
    @ResponseBody
    @RequestMapping(value = "/getOraDataAuthList")
    public AjaxReturn getOraDataAuthList(@SearchModel Object map) {
        FastPagination fastPagination = authCfgService.getOraDataAuthListByParam((Map) map);
        return new AjaxReturn().setSuccess(true).setData(fastPagination);
    }

    /**
     * 查询数据权限列表
     *
     * @param map ztlx:主体类型 1(角色)  2(用户), id 主体id, obj_id 对象id, module_id 模型id
     * @return AjaxReturn
     */
    @ResponseBody
    @RequestMapping(value = "/getPerDataAuthList")
    public AjaxReturn getPerDataAuthList(@SearchModel Object map) {
        FastPagination fastPagination = authCfgService.getPerDataAuthListByParam((Map) map);
        return new AjaxReturn().setSuccess(true).setData(fastPagination);
    }

    /**
     * 根据主体类型、主体id删除数据权限
     *
     * @param ztlx  主体类型(1.角色  2.用户)
     * @param id    角色id或数据权限id
     * @param objId 对象id
     * @return AjaxReturn
     */
    @ResponseBody
    @RequestMapping(value = "/deleteDataAuth")
    public AjaxReturn deleteDataAuth(String ztlx, Long id, Long objId) {
        authCfgService.deleteDataAuth(ztlx, id, objId);
        return new AjaxReturn(true);
    }

    /**
     * 根据id获取数据权限实体
     *
     * @param dataAuthId 数据权限id
     * @return AjaxReturn
     */
    @ResponseBody
    @RequestMapping(value = "/getDataAuthById")
    public AjaxReturn getDataAuthById(Long dataAuthId) {
        return new AjaxReturn().setSuccess(true).setData(authCfgService.getDataAuthById(dataAuthId));
    }

    /**
     * 保存数据权限实体
     *
     * @param sysDataAuth 数据权限实体
     * @return AjaxReturn
     */
    @ResponseBody
    @RequestMapping(value = "/saveDataAuth")
    public AjaxReturn saveDataAuth(@FormModel SysDataAuth sysDataAuth) {
        authCfgService.saveDataAuth(sysDataAuth);
        return new AjaxReturn().setSuccess(true).setData(sysDataAuth.getId());
    }
}
