package net.ruixin.service.plat.dictionary;


import net.ruixin.dao.plat.dictionary.IDictDao;
import net.ruixin.domain.plat.dictionary.SysDict;
import net.ruixin.domain.plat.dictionary.SysSubDict;
import net.ruixin.util.cache.Cache;
import net.ruixin.util.cache.CacheKit;
import net.ruixin.util.http.HttpSessionHolder;
import net.ruixin.util.paginate.FastPagination;
import net.ruixin.util.tools.RxFileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


/**
 * 字典服务层
 */
@Service
public class DictService implements IDictService {

    @Autowired
    private IDictDao dictDao;

    @Override
    @Transactional
    public void saveDict(SysDict sysDict) {
        //处理字典项为 字典编码+code格式
        if ("0".equals(sysDict.getIsEmpty())) {
            if (!"1".equals(sysDict.getDictType())) {
                List<SysSubDict> subdicts = sysDict.getSysSubDictList();
                for (SysSubDict subDict : subdicts) {
                    if (!subDict.getCode().contains(sysDict.getDictCode())) {
                        subDict.setCode(sysDict.getDictCode() + "_" + subDict.getCode());
                    }
                }
                sysDict.setSysSubDictList(subdicts);
            }
        }
        dictDao.saveDict(sysDict);
        //更新ehcache中字典缓存
        updateDictCache(sysDict);

    }

    private void updateDictCache(SysDict sysDict) {
        List<Map<String, Object>> list = new ArrayList<>();
        Map<String, Object> map;
        for (SysSubDict subDict : sysDict.getSysSubDictList()) {
            map = new HashMap<>();
            map.put("dictCode", subDict.getDictCode());
            map.put("code", subDict.getCode());
            map.put("value", subDict.getValue());
            map.put("sort", subDict.getSort());
            map.put("pcode", subDict.getPcode());
            map.put("pdictcode", subDict.getPdictCode());
            list.add(map);
        }
        CacheKit.put(Cache.DICT, sysDict.getDictCode(), list);
    }

    private void cacheInFront(SysDict sysDict) {
        File f = new File(HttpSessionHolder.getContextPath() + "medias/cache/" + sysDict.getDictCode() + ".js");
        RxFileUtils.createFile(f, sysDict);
    }

    @Override
    public FastPagination getDictList(Map map) {
        return dictDao.getDictList(map);
    }

    @Override
    public SysDict getDictById(Long id) {
        return dictDao.getDictById(id);
    }

    @Override
    @Transactional
    public void deleteDict(Long dictId) {
        dictDao.deleteDict(dictId);
        //更新ehcache中字典缓存
        SysDict sysDict = dictDao.getDictById(dictId);
        CacheKit.remove(Cache.DICT, sysDict.getDictCode());
    }

    private void delCacheInFront(Long dictId) {
        SysDict dict = getDictById(dictId);
        RxFileUtils.deleteFile(HttpSessionHolder.getContextPath() + "medias/cache/" + dict.getDictCode() + ".js");
    }

    @Override
    public List<Map<String, Object>> getSubDictsByCode(String dictcode) {
        return dictDao.getSubDictsByCode(dictcode);
    }
}
