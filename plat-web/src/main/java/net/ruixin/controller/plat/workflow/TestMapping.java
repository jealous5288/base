package net.ruixin.controller.plat.workflow;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/teacher")
public class TestMapping {

    //测试列表
    @RequestMapping(value = "/teacherList")
    public String testList() {
        return "plat/workflow/test/teacherList";
    }

    //流程表单
    @RequestMapping(value = "/teacherEdit")
    public String testForm() {
        return "plat/workflow/test/teacherEdit";
    }
}
