package net.ruixin.controller.plat.auth;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by admin on 2016-9-22.
 * 权限控制类——控制规则、功能权限、数据权限
 */
@Controller
@RequestMapping("/rule")
public class RuleMapping {
    //规则列表
    @RequestMapping("/authRuleList")
    public String authRuleList() {
        return "plat/auth/rule/ruleList";
    }

    //规则编辑
    @RequestMapping("/authRuleEdit")
    public String authRuleEdit() {
        return "plat/auth/rule/ruleEdit";
    }

    //规则选择
    @RequestMapping("/ruleSelect")
    public String authRuleSelect() {
        return "plat/auth/rule/ruleSelect";
    }
}
