package net.ruixin.controller.plat.auth;

import net.ruixin.controller.BaseController;
import net.ruixin.domain.plat.auth.SysModule;
import net.ruixin.service.plat.auth.IModuleService;
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
 * Created by admin on 2016-8-19.
 * 系统模块控制层
 */
@Controller
@RequestMapping("/module")
public class ModuleHandler extends BaseController {

    @Autowired
    private IModuleService moduleService;

    /**
     * 根据ID查询模块信息
     *
     * @param moduleId 模块ID
     * @return AjaxReturn
     */
    @ResponseBody
    @RequestMapping(value = "/getModuleById")
    public AjaxReturn getModuleById(Long moduleId) {
        return new AjaxReturn().setSuccess(true).setData(moduleService.getModuleById(moduleId));
    }

    /**
     * 查询模块列表
     *
     * @param map 查询条件
     * @return AjaxReturn
     */
    @ResponseBody
    @RequestMapping(value = "/getModuleList")
    public AjaxReturn getModuleList(@SearchModel Object map) {
        FastPagination fastPagination = moduleService.getModuleList((Map) map);
        return new AjaxReturn().setSuccess(true).setData(fastPagination);
    }

    /**
     * 保存模块信息
     *
     * @param sysModule 模块信息
     * @return AjaxReturn
     */
    @ResponseBody
    @RequestMapping(value = "/saveModule")
    public AjaxReturn saveModule(@FormModel SysModule sysModule) {
        moduleService.saveModule(sysModule);
        return new AjaxReturn().setSuccess(true).setData(sysModule.getId());
    }


    /**
     * 删除模块信息
     *
     * @param moduleId 模块ID
     * @return AjaxReturn
     */
    @ResponseBody
    @RequestMapping(value = "/deleteModule")
    public AjaxReturn deleteModule(Long moduleId) {
        moduleService.deleteModule(moduleId);
        return new AjaxReturn(true);
    }

    /**
     * 获取模块list 搜索下拉列表
     *
     * @return AjaxReturn
     */
    @ResponseBody
    @RequestMapping(value = "/getModuleSearch")
    public AjaxReturn getModuleSearch() {
        return new AjaxReturn(true).setData(moduleService.getModuleSearch());
    }

    /**
     * 获取顺序号
     *
     * @param tableName 表名
     * @param fieldName 字段名
     * @return AjaxReturn
     */
    @ResponseBody
    @RequestMapping(value = "/getMaxSort")
    public AjaxReturn getMaxSort(String tableName, String fieldName) {
        return new AjaxReturn(true).setData(moduleService.getMaxSort(tableName, fieldName));
    }

    /**
     * 根据模块id查询规则名称、菜单名称
     *
     * @param id 模块id
     * @return ar
     */
    @ResponseBody
    @RequestMapping("/getNamesByModuleId")
    public AjaxReturn getNamesByModuleId(Long id) {
        return moduleService.getNamesByModuleId(id);
    }

}
