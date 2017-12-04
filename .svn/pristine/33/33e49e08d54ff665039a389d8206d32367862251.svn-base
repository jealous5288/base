package net.ruixin.controller.plat.workflow;


import net.ruixin.controller.BaseController;
import net.ruixin.domain.plat.workflow.test.Teacher;
import net.ruixin.service.plat.workflow.ISysTaskService;
import net.ruixin.service.plat.workflow.IWorkflowInstanceService;
import net.ruixin.service.plat.workflow.impl.TeacherService;
import net.ruixin.util.data.AjaxReturn;
import net.ruixin.util.data.FlowParam;
import net.ruixin.util.paginate.FastPagination;
import net.ruixin.util.resolver.FormModel;
import net.ruixin.util.resolver.SearchModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpSession;
import java.util.Map;

/**
 * 测试svn
 */
@Controller
@RequestMapping("/teacher")
public class TestHandler extends BaseController {
    @Autowired
    private TeacherService teacherService;
    @Autowired
    private IWorkflowInstanceService workflowInstanceService;
    @Autowired
    private ISysTaskService sysTaskService;

    /**
     * 分页查询流程表单
     *
     * @param map 参数集
     * @return AjaxReturn
     */
    @ResponseBody
    @RequestMapping(value = "/getTeacherList")
    public AjaxReturn getTeacherList(@SearchModel Object map, HttpSession session) {
        ((Map) map).put("userId", super.getCurrentUserId());
        FastPagination fastPagination = teacherService.getTeacherList((Map) map);
        return new AjaxReturn().setSuccess(true).setData(fastPagination);
    }

    @ResponseBody
    @RequestMapping(value = "/saveTeacher")
    public AjaxReturn saveTeacher(@FormModel Teacher teacher, @FormModel FlowParam param) {
        Long id;
        if (teacher.getId() == null) {
            id = teacherService.save(teacher);
//            if (id != null) {
//                workflowInstanceService.updateWorkflowInstanceData(param, id, "教师:" + teacher.getName() + "流程");
//            }
        } else {
            id = teacherService.save(teacher);
        }
        /*if (param.getSort() == 1) {
            //设置变量
//            workflowInstanceService.initVariable(param, "SFSP", "1");
        }
        if (param.getSort() == 3) {
//            workflowInstanceService.initVariable(param, "SECOND_JC", "3");
        }*/
        return new AjaxReturn().setSuccess(true).setData(id);
    }

    @ResponseBody
    @RequestMapping(value = "/delTeacher")
    public AjaxReturn delTeacher(Long id) {
        teacherService.del(id);
        return new AjaxReturn().setSuccess(true);
    }

    @ResponseBody
    @RequestMapping(value = "/getTeacher")
    public AjaxReturn getTeacher(Long id) {
        return new AjaxReturn().setSuccess(true).setData(teacherService.get(id));
    }
}