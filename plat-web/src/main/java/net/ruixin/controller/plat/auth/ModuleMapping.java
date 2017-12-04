package net.ruixin.controller.plat.auth;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 系统模块控制层
 */
@Controller
@RequestMapping("/module")
public class ModuleMapping {
    //模块列表
    @RequestMapping("moduleList")
    public String moduleList() {
        return "plat/auth/module/moduleList";
    }

    //模块编辑
    @RequestMapping(value = "/moduleEdit")
    public String moduleEdit() {
        return "plat/auth/module/moduleEdit";
    }

    //模块功能权限编辑
    @RequestMapping(value = "/moduleAuthEdit")
    public String moduleAuthEdit() {
        return "plat/auth/module/moduleAuthEdit";
    }

    //系统功能权限
    @RequestMapping(value = "/moduleAuthSystem")
    public String moduleAuthSystem() {
        return "plat/auth/module/moduleAuthSystem";
    }

    //模块选择
    @RequestMapping(value = "/moduleSelect")
    public String moduleSelect() {
        return "plat/auth/module/moduleSelect";
    }
}
