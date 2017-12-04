package net.ruixin.controller.plat.dictionary;

import net.ruixin.controller.BaseController;
import net.ruixin.domain.plat.dictionary.SysDict;
import net.ruixin.service.plat.dictionary.IDictService;
import net.ruixin.util.cache.Cache;
import net.ruixin.util.cache.CacheKit;
import net.ruixin.util.data.AjaxReturn;
import net.ruixin.util.paginate.FastPagination;
import net.ruixin.util.resolver.FormModel;
import net.ruixin.util.resolver.SearchModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.*;

/**
 * 字典控制层
 */
@Controller
@RequestMapping("/dict")
public class DictHandler extends BaseController {

    @Autowired
    private IDictService dictService;

    /**
     * 保存字典实体
     *
     * @param sysDict 字典实体
     */
    @ResponseBody
    @RequestMapping("/saveDict")
    public AjaxReturn saveDict(@FormModel SysDict sysDict) {
        dictService.saveDict(sysDict);
        return SUCCESS().setData(sysDict.getId());
    }

    /**
     * 获取字典列表
     *
     * @param map 查询条件:dictName dictCode dictType
     */
    @ResponseBody
    @RequestMapping("/getDictList")
    public AjaxReturn getDictList(@SearchModel Object map) {
        FastPagination fastPagination = dictService.getDictList((Map) map);
        return SUCCESS.setData(fastPagination);
    }

    /**
     * 获取字典实体
     *
     * @param dictId 字典id
     */
    @ResponseBody
    @RequestMapping("/getDictById")
    public AjaxReturn getDictById(Long dictId) {
        return SUCCESS.setData(dictService.getDictById(dictId));
    }

    /**
     * 删除字典
     *
     * @param dictId 字典id
     */
    @ResponseBody
    @RequestMapping("/deleteDict")
    public AjaxReturn deleteDict(Long dictId) {
        dictService.deleteDict(dictId);
        return SUCCESS;
    }

    /**
     * 根据code（"zd1+zd2+zd3,zd4,zd5"）获取多个字典
     *
     * @param codeStr code
     */
    @ResponseBody
    @RequestMapping("/getDictsByCodes")
    public Map getDictsByCodes(String codeStr) {
        Map<String, Object> result = new HashMap<>();
        if (codeStr.contains(",")) {
            String[] codes = codeStr.split(",");
            for (String code : codes) {
                result.put(code, getDictByCodes(code));
            }
        } else {
            result.put(codeStr, getDictByCodes(codeStr));
        }
        return result;
    }

    /**
     * 根据code（"zd1+zd2+zd3"）获取单个字典
     *
     * @param codeStr code
     */
    @ResponseBody
    @RequestMapping("/getDictByCodes")
    public List getDictByCodes(String codeStr) {
        Collection obj;
        List<Object> list = new ArrayList<>();
        if (codeStr.contains("+")) {
            for (String code : codeStr.split("\\+")) {
                obj = CacheKit.get(Cache.DICT, code);
                if (null != obj)
                    list.addAll(obj);
            }
        } else {
            obj = CacheKit.get(Cache.DICT, codeStr);
            if (null != obj)
                list.addAll(obj);
        }
        return list;
    }
}
