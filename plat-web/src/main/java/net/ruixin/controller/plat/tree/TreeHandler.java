package net.ruixin.controller.plat.tree;

import net.ruixin.controller.BaseController;
import net.ruixin.service.plat.tree.ITreeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

/**
 * Created by admin on 2016-8-23.
 * 模型公用树
 */
@Controller
@RequestMapping("/tree")
public class TreeHandler extends BaseController {

    @Autowired
    private ITreeService treeService;

    /**
     * 树
     *
     * @param id         节点ID
     * @param lx         节点类型，“jg”：机构，“gw”：岗位，“ry”：人员
     * @param tid        顶级节点ID
     * @param tlx        顶级节点类型，“jg”：机构，“gw”：岗位
     * @param filterId   过滤id
     * @param filterLx   过滤类型
     * @param type       1：机构树，2：机构岗位树，3：机构用户树，4：机构岗位用户树
     * @param hasTop     是否有顶级"机构"   true：是  false：否
     * @param hasNoOrgan 是否有 无组织要素  默认为否
     * @param hasDelData 是否查询已删数据  不传参：默认为不查     否则为查
     * @return jsonList
     */
    @ResponseBody
    @RequestMapping(value = "/organTree")
    public List organTree(@RequestParam(value = "id", required = false) Long id,
                          @RequestParam(value = "lx", required = false) String lx,
                          @RequestParam(value = "tid", required = false) Long tid,
                          @RequestParam(value = "tlx", required = false) String tlx,
                          String type,
                          @RequestParam(value = "filterId", required = false) Long filterId,
                          @RequestParam(value = "filterLx", required = false) String filterLx,
                          @RequestParam(value = "hasTop", required = false) Boolean hasTop,
                          @RequestParam(value = "hasNoOrgan", required = false) String hasNoOrgan,
                          @RequestParam(value = "hasDelData", required = false) String hasDelData,
                          @RequestParam(value = "childLx", required = false) String childLx) {
        return treeService.getTreeDataList(id, lx, tid, tlx,
                filterId, filterLx, type, hasTop, hasNoOrgan, hasDelData, childLx);
    }

}
