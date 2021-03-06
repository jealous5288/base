package config;

import net.ruixin.util.cache.CacheKit;
import net.sf.ehcache.Cache;
import net.sf.ehcache.CacheManager;
import net.sf.ehcache.Element;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.*;

/**
 * 后端缓存初始化
 * 配置缓存、字典暂不缓存
 */
public class CacheInit {

    private static final String dictSql = "SELECT SS.DICT_CODE \"dictCode\", " +
            " SS.CODE \"code\", SS.VALUE \"value\",SS.SORT \"sort\", " +
            " SS.PCODE \"pcode\", SS.PDICT_CODE \"pdictcode\" " +
            "  FROM SYS_SUBDICT SS WHERE SS.SFYX_ST = '1'";
    private static final String configSql = "SELECT C.CODE KEY, C.VALUE FROM SYS_CONFIG C WHERE C.SFYX_ST = '1' ";

    public void setJdbcTemplate(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private JdbcTemplate jdbcTemplate;

    public void init() {
        CacheManager cacheManager = CacheManager.getInstance();
        //缓存字典
        List<Map<String, Object>> dicts = jdbcTemplate.queryForList(dictSql);
        CacheKit.putAll(net.ruixin.util.cache.Cache.DICT, toCollection(dicts));
        //缓存配置
        Cache cache = cacheManager.getCache(net.ruixin.util.cache.Cache.CONFIG);
        List<Map<String, Object>> configs = jdbcTemplate.queryForList(configSql);
        initResource(configs, cache);
        CacheKit.putAll(net.ruixin.util.cache.Cache.CONFIG, toElement(configs));
    }

    private void initResource(List<Map<String, Object>> configs, Cache cache) {
        Map<String, Map<String, Object>> resourceMap = null;
        List<Map<String, Object>> resourceDict = new ArrayList<>();
        String[] resourceType = null;
        for (Map map : configs) {
            if ("resType".equals(map.get("KEY").toString())) {
                resourceType = map.get("VALUE").toString().split(",");
                break;
            }
        }
        if (null != resourceType) {
            resourceMap = new HashMap<>();
            for (String type : resourceType) {
                resourceMap.put(type, new HashMap<>());
                Map subdict = new HashMap();
                subdict.put("code", type);
                resourceDict.add(subdict);
            }
            for (Map map : configs) {
                String code = map.get("KEY").toString();
                if (!"resType".equals(code) && code.startsWith("res_")) {
                    String[] subType = code.split("_");
                    if (subType.length == 3 && resourceMap.containsKey(subType[1])) {
                        resourceMap.get(subType[1]).put(subType[2], map.get("VALUE") != null ? map.get("VALUE").toString() : "");
                        if ("name".equals(subType[2])) {
                            for (Map subdict : resourceDict) {
                                if (subType[1].equals(subdict.get("code"))) {
                                    subdict.put("value", map.get("VALUE") != null ? map.get("VALUE").toString() : "");
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }

        if (null != resourceMap) {
            cache.put(new Element("resourceConfig", resourceMap));
            cache.put(new Element("resourceDict", resourceDict));
        }
    }

    private Collection<Element> toElement(List<Map<String, Object>> maps) {
        Set<Element> set = new HashSet<>();
        for (Map<String, Object> map : maps) {
            set.add(new Element(map.get("KEY"), map.get("VALUE")));
        }
        return set;
    }

    private Collection<Element> toElement(Map<String, Map<String, Object>> maps) {
        Set<Element> set = new HashSet<>();
        for (String key : maps.keySet()) {
            set.add(new Element(key, maps.get(key)));
        }
        return set;
    }

    @SuppressWarnings("unchecked")
    private Collection<Element> toCollection(List<Map<String, Object>> maps) {
        Set<Element> set = new HashSet<>();
        Map<String, List> code = new HashMap<>();
        String dictCode;
        List list;
        for (Map<String, Object> map : maps) {
            dictCode = map.get("dictCode").toString();
            if (code.containsKey(dictCode)) {
                code.get(dictCode).add(map);
            } else {
                list = new ArrayList();
                list.add(map);
                code.put(dictCode, list);
            }
        }
        for (String key : code.keySet()) {
            set.add(new Element(key, code.get(key)));
        }
        return set;
    }
}
