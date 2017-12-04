package net.ruixin.controller.plat.resource;

import net.ruixin.util.cache.Cache;
import net.ruixin.util.cache.CacheKit;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Map;

/**
 * 资源mapping
 */
@Controller
@RequestMapping("/resource")
public class ResourceMapping {
    //资源列表
    @RequestMapping(value = "/resourceList")
    public String configList(Model model) {
        model.addAttribute("resourceConfig", CacheKit.get(Cache.CONFIG, "resourceConfig"));
        model.addAttribute("resourceDict", CacheKit.get(Cache.CONFIG, "resourceDict"));
        return "plat/resource/resourceList";
    }

    //选择资源类型
    @RequestMapping(value = "/resourceTypeSelect")
    public String resourceTypeSelect(Long parentId, String parentType, Model model) {
        if (null != parentId && null != parentType) {
            String defaultType = "";
            Map<String, Object> resourceConfig = CacheKit.get(Cache.CONFIG, "resourceConfig");
            for (String key : resourceConfig.keySet()) {
                if (null != resourceConfig.get(key)) {
                    Map map = (Map) resourceConfig.get(key);
                    if (null != map.get("parent") && map.get("parent").toString().contains(parentType)) {
                        defaultType += key + ",";
                    }
                }
            }
            model.addAttribute("defaultType", defaultType);
        } else {
            model.addAttribute("defaultType", "");
        }
        model.addAttribute("resourceDict", CacheKit.get(Cache.CONFIG, "resourceDict"));
        return "plat/resource/resourceTypeSelect";
    }

    //资源编辑
    @RequestMapping(value = "/resourceEdit")
    public String configEdit(String resourceType, Model model) {
        Map<String, Map<String, Object>> resourceConfig = CacheKit.get(Cache.CONFIG, "resourceConfig");
        model.addAttribute("resourceType", resourceType);
        model.addAttribute("config", resourceConfig.get(resourceType));
        model.addAttribute("resourceDict", CacheKit.get(Cache.CONFIG, "resourceDict"));
        return "plat/resource/resourceEdit";
    }

    //资源选择树
    @RequestMapping(value = "/resourceTreeSelect")
    public String resourceTreeSelect() {
        return "plat/resource/resourceTreeSelect";
    }

    //角色资源选择树
    @RequestMapping(value = "/roleResourceTreeSelect")
    public String roleResourceTreeSelect() {
        return "plat/resource/roleResourceTreeSelect";
    }

    //资源列表
    @RequestMapping(value = "/resourceSelect")
    public String resourceSelect(String resourceType, Model model) {
        model.addAttribute("resourceType", resourceType);
        model.addAttribute("resourceConfig", CacheKit.get(Cache.CONFIG, "resourceConfig"));
        return "plat/resource/resourceSelect";
    }

    //资源选择树
    @RequestMapping(value = "/iconfontSelect")
    public String iconfontSelect() {
        return "plat/resource/iconfontSelect";
    }
}
