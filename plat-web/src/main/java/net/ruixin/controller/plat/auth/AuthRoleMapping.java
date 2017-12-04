package net.ruixin.controller.plat.auth;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 功能权限mapping
 */
@Controller
@RequestMapping("/authRole")
public class AuthRoleMapping {
    //功能权限列表
    @RequestMapping(value = "/authRoleList")
    public String authRoleList() {
        return "plat/auth/module/sysAuth/authRoleList";
    }

    //功能权限编辑
    @RequestMapping(value = "/authRoleEdit")
    public String authRoleEdit() {
        return "plat/auth/module/sysAuth/authRoleEdit";
    }

    //选择功能权限
    @RequestMapping(value = "/authRoleSelect")
    public String authRoleSelect() {
        return "plat/auth/module/sysAuth/authRoleSelect";
    }
}
