package net.ruixin.service.plat.config;

import net.ruixin.dao.plat.config.IConfigDao;
import net.ruixin.domain.plat.config.SysConfig;
import net.ruixin.util.cache.Cache;
import net.ruixin.util.cache.CacheKit;
import net.ruixin.util.constant.Const;
import net.ruixin.util.paginate.FastPagination;
import net.ruixin.util.tools.RxFileUtils;
import net.sf.ehcache.Element;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ConfigService implements IConfigService {

    @Autowired
    private IConfigDao configDao;

    @Transactional
    @Override
    public void saveConfig(SysConfig config) {
        //新增、修改配置到数据库
        configDao.saveConfig(config);
        //同步更新后端缓存配置
        CacheKit.put(Cache.CONFIG, config.getCode(), config.getValue());
        //若更新资源相关配置，重新处理资源配置
        if (config.getCode().startsWith("res")) {
            reloadResource(CacheKit.getAll(Cache.CONFIG));
        }
        //重新生成前端缓存文件
        cacheConfig();
    }

    private void reloadResource(Map<Object, Element> configs) {
        Map<String, Map<String, Object>> resourceMap = null;
        List<Map<String, Object>> resourceDict = new ArrayList<>();
        String[] resourceType = null;
        if (null != configs.get("resType")) {
            resourceType = configs.get("resType").getObjectValue().toString().split(",");
        }
        if (null != resourceType) {
            resourceMap = new HashMap<>();
            for (String type : resourceType) {
                resourceMap.put(type, new HashMap<>());
                Map subdict = new HashMap();
                subdict.put("code", type);
                resourceDict.add(subdict);
            }
            for (Object key : configs.keySet()) {
                String code = key.toString();
                if (!"resType".equals(code) && code.startsWith("res_")) {
                    String[] subType = code.split("_");
                    if (subType.length == 3 && resourceMap.containsKey(subType[1])) {
                        Object value = configs.get(key).getObjectValue();
                        resourceMap.get(subType[1]).put(subType[2], value != null ? value.toString() : "");
                        if ("name".equals(subType[2])) {
                            for (Map subdict : resourceDict) {
                                if (subType[1].equals(subdict.get("code"))) {
                                    subdict.put("value", value != null ? value.toString() : "");
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }

        CacheKit.put(Cache.CONFIG, "resourceConfig", resourceMap);
        CacheKit.put(Cache.CONFIG, "resourceDict", resourceDict);
    }

    @Override
    public SysConfig getConfigById(Long id) {
        return configDao.getConfigById(id);
    }

    @Transactional
    @Override
    public void delConfig(Long id) {
        //删除数据库中配置
        configDao.delConfig(id);
        //同步更新后端缓存配置
        SysConfig config = getConfigById(id);
        CacheKit.remove(Cache.CONFIG, config.getCode());
        //重新生成前端缓存文件
        cacheConfig();
    }

    @Override
    public FastPagination getConfigList(Map map) {
        return configDao.getConfigList(map);
    }

    private void cacheConfig() {
        File f = new File(CacheKit.get(Cache.CONFIG, "contextPath") + "medias/cache/platConfig.js");
        RxFileUtils.createFile(f, CacheKit.getAll(Cache.CONFIG));
    }

    @Override
    public List<Map<String, Object>> getConfigListByType() {
        return getConfigListByProjectType(null);
    }

    public List<Map<String, Object>> getConfigListByProjectType(Long projectId) {
        List<Map<String, Object>> resultList = new ArrayList<>();
        //平台配置获取
        List<Map<String, Object>> configList = configDao.getConfigListByProjectType(projectId);
        if (configList.size() > 0) {
            Map<String, Object> projectMap = new HashMap();
            List<Map<String, Object>> typeList = new ArrayList<>();
            Map<String, Object> typeMap = new HashMap<>();
            List<Map<String, Object>> mapList = new ArrayList();
            for (Map map : configList) {
                if (projectMap.containsKey("projectId")) {
                    if (projectMap.get("projectId").equals(map.get("PROJECT_ID") != null ? map.get("PROJECT_ID").toString() : "0")) {
                        if (typeMap.get("typeName").equals(map.get("TYPE_NAME").toString())) {
                            mapList.add(map);
                        } else {
                            typeMap.put("configList", mapList);
                            typeList.add(typeMap);
                            typeMap = new HashMap<>();
                            typeMap.put("typeName", map.get("TYPE_NAME").toString());
                            mapList = new ArrayList<>();
                            mapList.add(map);
                        }
                    } else {
                        typeMap.put("configList", mapList);
                        typeList.add(typeMap);
                        projectMap.put("typeList", typeList);
                        resultList.add(projectMap);
                        projectMap = new HashMap();
                        typeList = new ArrayList();
                        typeMap = new HashMap<>();
                        mapList = new ArrayList();
                        typeMap.put("typeName", map.get("TYPE_NAME").toString());
                        projectMap.put("projectId", map.get("PROJECT_ID").toString());
                        projectMap.put("name", map.get("PROJECT_NAME"));
                        mapList.add(map);
                    }
                } else {
                    if (Const.CONFIG_LEVEL_PLAT.equals(map.get("LEVELS").toString())) {
                        projectMap.put("projectId", "0");
                        projectMap.put("name", "平台");
                        projectMap.put("typeList", new ArrayList<>());
                        typeMap.put("typeName", map.get("TYPE_NAME").toString());
                        mapList.add(map);
                    } else {
                        projectMap.put("projectId", map.get("PROJECT_ID").toString());
                        projectMap.put("name", map.get("PROJECT_NAME"));
                        projectMap.put("typeList", new ArrayList<>());
                        typeMap.put("typeName", map.get("TYPE_NAME").toString());
                        mapList.add(map);
                    }
                }
            }
            typeMap.put("configList", mapList);
            typeList.add(typeMap);
            projectMap.put("typeList", typeList);
            resultList.add(projectMap);
        }
        return resultList;
    }
}
