package net.ruixin.controller.plat.auth;

import net.ruixin.controller.BaseController;
import net.ruixin.domain.plat.auth.SysAuthRule;
import net.ruixin.service.plat.auth.IRuleService;
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
 * 数据权限的生成规则
 */
@Controller
@RequestMapping("/rule")
public class RuleHandler extends BaseController {

    @Autowired
    private IRuleService ruleService;

    /**
     * 获取权限规则分页列表
     *
     * @param map RULE_NAME：规则名称  GZLX：规则类型
     * @return AjaxReturn
     */
    @ResponseBody
    @RequestMapping(value = "/getAuthRuleList")
    public AjaxReturn getAuthRuleList(@SearchModel Object map) {
        FastPagination fastPagination = ruleService.getAuthRuleList((Map) map);
        return new AjaxReturn().setSuccess(true).setData(fastPagination);
    }

    /**
     * 根据权限规则id获取权限规则实体
     *
     * @param authRuleId 权限规则id
     * @return AjaxReturn
     */
    @ResponseBody
    @RequestMapping(value = "/getAuthRuleById")
    public AjaxReturn getAuthRuleById(Long authRuleId) {
        return new AjaxReturn().setSuccess(true).setData(ruleService.getAuthRuleById(authRuleId));
    }

    /**
     * 保存权限规则实体
     *
     * @param sysAuthRule 权限规则实体
     * @return AjaxReturn
     */
    @ResponseBody
    @RequestMapping(value = "/saveAuthRule")
    public AjaxReturn saveAuthRule(@FormModel SysAuthRule sysAuthRule) {
        boolean flag = true;
        //规则实现方式为sql，则验证sql是否正确
        if (sysAuthRule.getSysBaseRule().getSxfs().equals("1")) {
            flag = ruleService.checkRuleDetail(sysAuthRule.getSysBaseRule().getRule_detail());
        }
        AjaxReturn ar = new AjaxReturn();
        if (flag) {
            ruleService.saveAuthRule(sysAuthRule);
            ar.setSuccess(true).setData(sysAuthRule.getId());
        } else {
            ar.setSuccess(false).setMsg("规则实现细节sql执行异常，保存失败");
        }
        return ar;
    }

    /**
     * 根据权限规则id删除权限规则
     *
     * @param authRuleId 权限规则id
     * @return AjaxReturn
     */
    @ResponseBody
    @RequestMapping(value = "/delAuthRule")
    public AjaxReturn delAuthRule(Long authRuleId) {
        ruleService.delAuthRule(authRuleId);
        return new AjaxReturn(true);
    }

    /**
     * 根据规则id查询角色name
     *
     * @param id 规则ID
     * @return AjaxReturn
     */
    @ResponseBody
    @RequestMapping("/getRoleNameByRuleId")
    public AjaxReturn getRoleNameByRuleId(Long id) {
        return ruleService.getRoleNameByRuleId(id);
    }
}
