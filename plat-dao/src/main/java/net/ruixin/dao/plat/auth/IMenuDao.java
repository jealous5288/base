package net.ruixin.dao.plat.auth;


import java.util.List;
import java.util.Map;

/**
 * Created by admin on 2016-8-19.
 * 系统菜单DAO接口
 */
public interface IMenuDao {


    List<Map<String, Object>> getMenus(Long id);
}
