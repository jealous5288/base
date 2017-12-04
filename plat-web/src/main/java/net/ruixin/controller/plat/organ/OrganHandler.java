package net.ruixin.controller.plat.organ;

import net.ruixin.controller.BaseController;
import net.ruixin.domain.plat.organ.SysOrgan;
import net.ruixin.service.plat.organ.IOrganService;
import net.ruixin.util.data.AjaxReturn;
import net.ruixin.util.paginate.FastPagination;
import net.ruixin.util.resolver.FormModel;
import net.ruixin.util.resolver.SearchModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
import java.util.Map;

/**
 * 组织机构控制层
 */
@Controller
@RequestMapping("/organ")
public class OrganHandler extends BaseController {

    @Autowired
    private IOrganService organService;

    /**
     * 根据ID查询组织机构信息
     *
     * @param id 机构ID
     * @return SysOrgan
     */
    @ResponseBody
    @RequestMapping(value = "/getOrganById")
    public AjaxReturn getOrganById(Long id) {
        return SUCCESS.setData(organService.getOrganById(id));
    }

    /**
     * 查询组织机构列表
     *
     * @param map        查询条件
     * @param hasDelData 是否查询已删数据  不传参：默认为不查     否则为查
     * @return AjaxReturn
     */
    @ResponseBody
    @RequestMapping(value = "/getOrganList")
    public AjaxReturn getOrganList(@SearchModel Object map, String hasDelData) {
        FastPagination fastPagination = organService.getSysOrganPagingList((Map) map, hasDelData);
        return SUCCESS.setData(fastPagination);
    }

    /**
     * 查询下级机构
     *
     * @param id         机构id
     * @param hasDelData 是否查询已删数据  不传参：默认为不查     否则为查
     * @return AjaxReturn
     */
    @ResponseBody
    @RequestMapping(value = "/getChildOrgan")
    public AjaxReturn getChildOrgan(Long id, String hasDelData) {
        List<Map<String, Object>> childList = organService.getOrganListByParentId(id, hasDelData);
        return new AjaxReturn().setSuccess(true).setData(childList);
    }

    /**
     * 保存组织机构信息
     *
     * @param sysOrgan 机构信息
     * @return AjaxReturn
     */
    @ResponseBody
    @RequestMapping(value = "/saveOrgan")
    public AjaxReturn saveOrgan(@FormModel SysOrgan sysOrgan) {
        //验证同一组织机构下，简称是否重复
        boolean hasOrganName = organService.hasOrganName(sysOrgan.getId(), sysOrgan.getOrganName(), sysOrgan.getParentOrg());
        AjaxReturn ar = new AjaxReturn();
        if (!hasOrganName) { //验证（不重复）通过 保存
            organService.saveOrgan(sysOrgan);
            ar.setSuccess(true).setData(sysOrgan.getId()).setMsg("保存成功");
        } else {
            ar.setSuccess(false).setMsg("此机构名称已存在，请重新命名");
        }
        return ar;
    }

    /**
     * 删除或恢复组织机构
     *
     * @param organId    机构id
     * @param type       操作类型 0：删除  1：恢复   2:停用
     * @param newOrganId 调整后的机构id
     * @return AjaxReturn
     */
    @ResponseBody
    @RequestMapping(value = "/delOrAbleOrgan")
    public AjaxReturn delOrAbleOrgan(Long organId, String type, Long newOrganId) {
        organService.delOrAbleOrgan(organId, type, newOrganId);
        return new AjaxReturn(true);
    }

    /**
     * 查询组织关联角色信息
     *
     * @param id         组织机构ID
     * @param hasDelData 是否查询已删数据  不传参：默认为不查     否则为查
     * @return AjaxReturn
     */
    @ResponseBody
    @RequestMapping(value = "/organGlxx")
    public AjaxReturn getOrganGlxx(Long id, String hasDelData) {
        Map map = organService.getOrganGlxx(id, hasDelData);
        return new AjaxReturn().setSuccess(true).setData(map);
    }

}
