package net.ruixin.dao.plat.resource;

import net.ruixin.domain.plat.resource.SysResource;
import net.ruixin.util.hibernate.BaseDao;
import net.ruixin.util.paginate.FastPagination;
import net.ruixin.util.tools.RxStringUtils;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Repository
public class ResourceDao extends BaseDao<SysResource> implements IResourceDao {

    @Override
    public void saveResource(SysResource resource) {
        super.saveOrUpdate(resource);
    }

    @Override
    public SysResource getResourceById(Long id) {
        return super.get(id);
    }

    @Override
    public void delResource(Long id) {
        super.delete(id);
    }

    @Override
    public FastPagination getResourceList(Map map) {
        StringBuilder sql = new StringBuilder("SELECT * FROM (");
        List<Object> args = new ArrayList<>();
        if (RxStringUtils.isNotEmpty(map.get("parentId"))) {
            sql.append("SELECT R.ID, R.NAME, R.CODE, R.TYPE, R.XGSJ, 1 UTYPE \n" +
                    "  FROM SYS_RESOURCE R WHERE R.ID = ? UNION ALL ");
            args.add(map.get("parentId"));
        }
        sql.append("SELECT R.ID, R.NAME, R.CODE, R.TYPE, R.XGSJ, 2 UTYPE \n" +
                "  FROM SYS_RESOURCE R WHERE R.SFYX_ST='1' ");
        if (RxStringUtils.isNotEmpty(map.get("name"))) {
            sql.append(" AND R.NAME LIKE ? ");
            args.add("%" + map.get("name") + "%");
        }
        if (RxStringUtils.isNotEmpty(map.get("code"))) {
            sql.append(" AND R.CODE LIKE ? ");
            args.add("%" + map.get("code") + "%");
        }
        if (RxStringUtils.isNotEmpty(map.get("type"))) {
            sql.append(" AND R.TYPE = ? ");
            args.add(map.get("type"));
        }
        if (RxStringUtils.isNotEmpty(map.get("parentId"))) {
            sql.append(" AND R.PARENT_ID = ? ");
            args.add(map.get("parentId"));
        }
        sql.append(") ORDER BY UTYPE,XGSJ DESC");
        return super.cacheNextPagePaginationSql(sql, args, (Integer) map.get("pageNo"),
                (Integer) map.get("pageSize"), (Boolean) map.get("onePage"), (Integer) map.get("oldPage"));
    }

    @Override
    public List getResourceTreeData(String resourceType, Long removeId, Long id) {
        StringBuilder sql = new StringBuilder();
        List<Object> args = new ArrayList<>();
        sql.append(" SELECT R.ID, R.NAME, R.CODE, R.TYPE, R.XGSJ,\n" +
                " (SELECT COUNT(R2.ID) FROM SYS_RESOURCE R2 WHERE R2.PARENT_ID = R.ID ");
        if (null != removeId) {
            sql.append("AND R2.ID <> ? ");
            args.add(removeId);
        }
        sql.append(" AND INSTR(?,R.TYPE) > 0 ");
        args.add("," + resourceType + ",");
        sql.append(" AND R2.SFYX_ST = '1') CHILD_NUM \n" +
                "  FROM SYS_RESOURCE R WHERE INSTR(?,R.TYPE) > 0 ");
        args.add("," + resourceType + ",");
        if (null != removeId) {
            sql.append("AND R.ID <> ? ");
            args.add(removeId);
        }
        if (null == id) {
            sql.append("AND (R.PARENT_TYPE IS NULL OR INSTR(? ,R.PARENT_TYPE) = 0) ");
            args.add("," + resourceType + ",");
        } else {
            sql.append("AND R.PARENT_ID = ? ");
            args.add(id);
        }
        sql.append("AND R.SFYX_ST = '1' ");
        return getJdbcTemplate().queryForList(sql.toString(), args.toArray());
    }

    @Override
    public List getRoleResourceTreeData(String type, Long roleId, String showRoleIds, Boolean showAll) {
        StringBuilder sql = new StringBuilder();
        List<Object> args = new ArrayList<>();
        sql.append("SELECT R.*, GRR2.ID AS HAS_ID " +
                "        FROM SYS_RESOURCE R ");
        if (!showAll) {
            sql.append(" INNER JOIN SYS_GLB_ROLE_RESOURCE GRR ON GRR.RESOURCE_ID = R.ID " +
                    "AND GRR.ROLE_ID IN (" + showRoleIds + ") AND GRR.SFYX_ST = '1' ");
        }
        sql.append(" LEFT JOIN SYS_GLB_ROLE_RESOURCE GRR2 ON GRR2.RESOURCE_ID = R.ID " +
                "AND GRR2.ROLE_ID = ? AND GRR2.SFYX_ST = '1'" +
                " WHERE R.TYPE = ? AND R.SFYX_ST = '1' ORDER BY R.SORT ASC ");
        args.add(roleId);
        args.add(type);
        return getJdbcTemplate().queryForList(sql.toString(), args.toArray());
    }

    @Override
    public void saveRoleResource(Long roleId, String resourceIds, Long cjrId) {
        getJdbcTemplate().update("delete from sys_glb_role_resource where role_id = ? ", roleId);
        String[] ids = resourceIds.split(",");
        for (String resourceId : ids) {
            getJdbcTemplate().update("insert into sys_glb_role_resource values(seq_sys_glb_role_resource.nextval,?,?,?,sysdate,'1')", roleId, resourceId, cjrId);
        }
    }
}