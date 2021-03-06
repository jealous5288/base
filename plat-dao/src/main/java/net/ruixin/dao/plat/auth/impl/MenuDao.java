package net.ruixin.dao.plat.auth.impl;

import net.ruixin.dao.plat.auth.IMenuDao;
import net.ruixin.domain.plat.auth.SysMenu;
import net.ruixin.util.hibernate.BaseDao;
import net.ruixin.util.paginate.FastPagination;
import net.ruixin.util.tools.RxStringUtils;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created by admin on 2016-10-12
 * 系统菜单DAO实现
 */
@Repository
public class MenuDao extends BaseDao<SysMenu> implements IMenuDao {

    @Override
    public List<Map<String, Object>> getMenus(Long id) {
        StringBuilder sb = new StringBuilder("SELECT R.ID MENU_ID, R.NAME MENU_NAME, R.PARENT_ID, R.URL MENU_URL, R.TYPE, level \n" +
                "  FROM SYS_RESOURCE R\n" +
                " WHERE instr('menu,page',R.type) > 0 AND R.SFYX_ST='1'\n" +
                " START WITH R.TYPE = 'menu'\n" +
                "        AND R.PARENT_ID IS NULL\n" +
                "CONNECT BY PRIOR R.ID = R.PARENT_ID");
        return getJdbcTemplate().queryForList(sb.toString());
    }
}
