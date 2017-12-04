package net.ruixin.dao.plat.workflow.impl;

import net.ruixin.domain.plat.workflow.test.Teacher;
import net.ruixin.util.hibernate.BaseDao;
import net.ruixin.util.paginate.FastPagination;
import net.ruixin.util.tools.RxStringUtils;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Repository
public class TeacherDao extends BaseDao<Teacher> {

    public FastPagination getTeacherList(Map map) {
        List<Object> args = new ArrayList<>();
        StringBuffer sql = new StringBuffer("SELECT WKINS.ID, WKINS.TITLE, K.XGSJ, " +
                "NVL(WKINS.ID,0) WORKFLOW_INSTANCE_ID, " +
                "DECODE(WKINS.STATUS,'0','完成','5','待提交','2',N.NAME,'完成') ZT ");
        sql.append(" FROM SYS_WORKFLOW_INSTANCE WKINS  ");
        sql.append(" LEFT JOIN (select * from T_TEACHER t where t.sfyx_st = 1");
        if (RxStringUtils.isNotEmpty(map.get("name"))) {
            sql.append(" and t.name like ?");
            args.add("%" + map.get("name") + "%");
        }
        sql.append(" ) K ON WKINS.DATA_ID = K.ID ");
        sql.append("  LEFT JOIN SYS_NODE_INSTANCE NINS ON NINS.WORKFLOW_INSTANCE_ID=WKINS.ID AND NINS.STATUS='1' " +
                "  LEFT JOIN SYS_NODE N ON N.ID=NINS.NODE_ID WHERE WKINS.workflow_id = 100178 order by WKINS.CJSJ desc ");
        return super.cacheNextPagePaginationSql(sql, args, (Integer) map.get("pageNo"), (Integer) map.get("pageSize"), (Boolean) map.get("onePage"), (Integer) map.get("oldPage"));
    }

    public FastPagination getBlList(Map map) { //2017/4/14 wcy增加  替代原来的getBlList方法  测试用
        String sql = "SELECT BW.STATUS,\n" +
                "       BW.TITLE,\n" +
                "       BW.WORKFLOW_INSTANCE_ID WF_INS_ID,\n" +
                "       BW.XGSJ,\n" +
                "       U.USER_NAME\n" +
                "  FROM SYS_GLB_BIZ_WF BW, SYS_USER U\n" +
                " WHERE BW.USER_ID = U.ID\n" +
                "   AND BW.WORKFLOW_CODE = 'QJLC'\n" +
                "   AND U.SFYX_ST = '1'\n" +
                "   AND BW.SFYX_ST = '1'" +
                " ORDER BY BW.XGSJ DESC ";
        return super.cacheNextPagePaginationSql(sql, null, (Integer) map.get("pageNo"),
                (Integer) map.get("pageSize"), (Boolean) map.get("onePage"), (Integer) map.get("oldPage"));
    }
}
