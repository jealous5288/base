package net.ruixin.service.plat.resource;

import net.ruixin.dao.plat.resource.IResourceDao;
import net.ruixin.domain.plat.resource.SysResource;
import net.ruixin.service.plat.shiro.ShiroKit;
import net.ruixin.util.cache.Cache;
import net.ruixin.util.cache.CacheKit;
import net.ruixin.util.paginate.FastPagination;
import net.ruixin.util.tools.RxStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class ResourceService implements IResourceService {

    @Autowired
    private IResourceDao resourceDao;

    @Transactional
    @Override
    public void saveResource(SysResource resource) {
        Map<String, Map<String, Object>> resourceConfigMap = CacheKit.get(Cache.CONFIG, "resourceConfig");
        if (RxStringUtils.isNotEmpty(resource.getParentType())) {
            if (RxStringUtils.isNotEmptyAndEqualsZero(resourceConfigMap.get(resource.getParentType()).get("tree"))) {
                SysResource parentResource = getResourceById(resource.getParentId());
                if (null != parentResource) {
                    resource.setShowParentId(parentResource.getShowParentId());
                }
            } else {
                resource.setShowParentId(resource.getParentId());
            }
        }
        //新增、修改资源到数据库
        resourceDao.saveResource(resource);
    }

    @Override
    public SysResource getResourceById(Long id) {
        return resourceDao.getResourceById(id);
    }

    @Transactional
    @Override
    public void delResource(Long id) {
        //删除数据库中资源
        resourceDao.delResource(id);
    }

    @Override
    public FastPagination getResourceList(Map map) {
        return resourceDao.getResourceList(map);
    }

    @Override
    public List getResourceTreeData(String resourceType, Long removeId, Long id) {
        List<Map<String, Object>> nodeList = new ArrayList<>();
        Map<String, Map<String, Object>> resourceMap = CacheKit.get(Cache.CONFIG, "resourceConfig");
        List<Map<String, Object>> resultList = resourceDao.getResourceTreeData(resourceType, removeId, id);
        for (Map result : resultList) {
            Map node = new HashMap();
            node.put("id", result.get("ID"));
            node.put("type", result.get("TYPE"));
            node.put("name", result.get("NAME"));
            node.put("pid", result.get("PARENT_ID") != null ? result.get("PARENT_ID").toString() : "");
            node.put("isParent", Integer.valueOf(result.get("CHILD_NUM").toString()) > 0);
            node.put("icon", resourceMap.get(result.get("TYPE")).get("icon"));
            nodeList.add(node);
        }
        return nodeList;
    }

    @Override
    public List<Map<String, Object>> getRoleResourceTreeData(Long roleId, boolean treeHide) {
        List<Map<String, Object>> nodeList = new ArrayList<>();
        List<Map<String, Object>> resultList = new ArrayList<>();
        Map<String, Map<String, Object>> resourceConfigMap = CacheKit.get(Cache.CONFIG, "resourceConfig");
        List<Map<String, Object>> resourceDict = CacheKit.get(Cache.CONFIG, "resourceDict");
        Boolean showAll = true;
        String showRoleIds = "";
        for (Map map : resourceDict) {
            if (!treeHide || !RxStringUtils.isNotEmptyAndEqualsZero(resourceConfigMap.get(map.get("code")).get("tree"))) {
                resultList.addAll(resourceDao.getRoleResourceTreeData(map.get("code").toString(), roleId, showRoleIds, showAll));
            }
        }
        for (Map result : resultList) {
            Map node = new HashMap();
            node.put("id", result.get("ID"));
            node.put("type", result.get("TYPE"));
            node.put("name", result.get("NAME"));
            node.put("pid", treeHide ? result.get("SHOW_PARENT_ID") : result.get("PARENT_ID"));
            node.put("icon", resourceConfigMap.get(result.get("TYPE")).get("icon"));
            node.put("checked", null != result.get("HAS_ID"));
            node.put("open", true);
            nodeList.add(node);
        }
        return nodeList;
    }

    @Override
    public void saveRoleResource(Long roleId, String resourceIds) {
        resourceDao.saveRoleResource(roleId, resourceIds, ShiroKit.getUser().getId());
    }
}
