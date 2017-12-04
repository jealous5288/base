package net.ruixin.controller.plat.auth;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 数据权限页面跳转mapping
 */
@Controller
@RequestMapping("/dataAuth")
public class DataAuthMapping {
    //数据权限列表
    @RequestMapping(value = "/dataAuthList")
    public String dataAuthList() {
        return "plat/auth/data/dataAuthList";
    }

    //数据权限编辑
    @RequestMapping(value = "/dataAuthEdit")
    public String dataAuthEdit() {
        return "plat/auth/data/dataAuthEdit";
    }

}
