package net.ruixin.service.plat.tree;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * treeService
 */
public interface ITreeService {
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
     * @param hasTop     是否有顶级"机构"  true：是  false：否
     * @param hasNoOrgan 是否有 无组织要素  默认为否
     * @param hasDelData 是否查询已删数据  不传参：默认为不查     否则为查
     * @return jsonList
     */
    List getTreeDataList(Long id, String lx, Long tid, String tlx, Long filterId, String filterLx,
                         String type, Boolean hasTop, String hasNoOrgan, String hasDelData, String childLx);
}

