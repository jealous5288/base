package net.ruixin.service.plat.auth.impl;

import net.ruixin.dao.plat.auth.IMenuDao;
import net.ruixin.dao.plat.organ.IUserDao;
import net.ruixin.domain.plat.auth.SysMenu;
import net.ruixin.domain.plat.organ.SysUser;
import net.ruixin.service.plat.auth.IMenuService;
import net.ruixin.util.cache.Cache;
import net.ruixin.util.cache.CacheKit;
import net.ruixin.util.paginate.FastPagination;
import net.ruixin.util.tools.RxStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by admin on 2016-10-12
 * 系统菜单服务实现
 */
@Service
public class MenuService implements IMenuService {

    @Autowired
    private IMenuDao menuDao;

    public List<Map<String, Object>> getMenus(Long userId) {
        return (List<Map<String, Object>>) getChild(0, 1, menuDao.getMenus(userId)).get("CHILD_MENU");
    }

    private Map<String, Object> getChild(int startIndex, int startLevel, List<Map<String, Object>> resultList) {
        //结果集合
        Map resultMap = new HashMap();
        List<Map<String, Object>> menuList = new ArrayList<>();
        for (int i = startIndex; i < resultList.size(); i++) {
            Map result = resultList.get(i);
            int level = Integer.valueOf(result.get("LEVEL").toString());
            if (level < startLevel) {
                resultMap.put("endIndex", i - 1);
                resultMap.put("CHILD_MENU", menuList);
                break;
            } else if (level == startLevel) {
                Map menu = new HashMap();
                menu.put("ID", result.get("MENU_ID"));
                menu.put("MENU_NAME", result.get("MENU_NAME"));
                menu.put("MENU_URL", result.get("MENU_URL"));
                menu.put("type", result.get("TYPE"));
                menuList.add(menu);
            } else if (level > startLevel) {
                if ("page".equals(result.get("TYPE").toString())) {
                    String url = result.get("MENU_URL") == null ? "" : result.get("MENU_URL").toString();
                    menuList.get(menuList.size() - 1).put("MENU_URL", url);
                } else {
                    Map childMap = getChild(i, level, resultList);
                    i = Integer.valueOf(childMap.get("endIndex").toString());
                    menuList.get(menuList.size() - 1).put("CHILD_MENU", childMap.get("CHILD_MENU"));
                }
            }
        }
        if (!resultMap.containsKey("endIndex")) {
            resultMap.put("endIndex", resultList.size() - 1);
            resultMap.put("CHILD_MENU", menuList);
        }
        return resultMap;
    }


}
