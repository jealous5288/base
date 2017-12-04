package net.ruixin.service.plat.shiro.server;

import net.ruixin.util.cache.Cache;
import net.ruixin.util.cache.CacheKit;
import net.ruixin.util.exception.BizExceptionEnum;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;
import redis.clients.jedis.exceptions.JedisException;

import java.util.Objects;

public class RedisHelper {
    private static JedisPool jedisPool;
    // session 在redis过期时间是30分钟30*60
    private static int expireTime = 1800;
    private static Logger logger = LoggerFactory.getLogger(RedisHelper.class);

    static {
        initPool();
    }

    private static void initPool() {
        JedisPoolConfig config = new JedisPoolConfig();
        //最大连接数
        String maxActive = CacheKit.get(Cache.CONFIG, "maxActive");
        if (StringUtils.isEmpty(maxActive)) {
            throw new RuntimeException("系统配置参数缺失：maxActive");
        }
        config.setMaxTotal(Integer.parseInt(maxActive));
        //最大空闲连接
        String maxIdle = CacheKit.get(Cache.CONFIG, "maxIdle");
        if (StringUtils.isEmpty(maxIdle)) {
            throw new RuntimeException("系统配置参数缺失：maxIdle");
        }
        config.setMaxIdle(Integer.parseInt(maxIdle));
        //最大阻塞等待时间
        String maxWait = CacheKit.get(Cache.CONFIG, "maxWait");
        config.setMaxWaitMillis(Long.parseLong(maxWait));
        config.setTestOnBorrow(false);
        //redis服务器IP地址
        final String ip = CacheKit.get(Cache.CONFIG, "redisIp");
        if (StringUtils.isEmpty(ip)) {
            throw new RuntimeException("系统配置参数缺失：redisIp");
        }
        //redis服务端口
        String redisPort = CacheKit.get(Cache.CONFIG, "redisPort");
        if (StringUtils.isEmpty(redisPort)) {
            throw new RuntimeException("系统配置参数缺失：redisPort");
        }
        final int port = Integer.parseInt(redisPort);
        jedisPool = new JedisPool(config, ip, port);
    }

    // 从连接池获取redis连接
    public static Jedis getJedis() {
        if (jedisPool == null)
            initPool();
        return jedisPool.getResource();
    }

    //回收redis连接
    private static void recycleJedis(Jedis jedis) {
        if (jedis != null) {
            jedis.close();
        }
    }

    //保存byte类型数据
    public static void setObject(byte[] key, byte[] value) {
        Jedis jedis = getJedis();
        if (jedis != null) {
            try {
                if (!jedis.exists(key)) {
                    jedis.set(key, value);
                }
                // redis中session过期时间
                jedis.expire(key, expireTime);
            } catch (Exception e) {
                throw new JedisException("保存Redis缓存数据异常");
            } finally {
                recycleJedis(jedis);
            }
        }

    }

    // 获取byte类型数据
    public static byte[] getObject(byte[] key) {
        Jedis jedis = getJedis();
        byte[] bytes = null;
        if (jedis != null) {
            try {
                bytes = jedis.get(key);
            } catch (Exception e) {
                throw new JedisException("获取Redis缓存数据异常");
            } finally {
                recycleJedis(jedis);
            }
        }
        return bytes;
    }

    //清除缓存
    public static void delString(String key) {
        Jedis jedis = getJedis();
        if (jedis != null) {
            try {
                jedis.del(key);
            } catch (Exception e) {
                throw new JedisException("删除Redis缓存数据异常");
            } finally {
                recycleJedis(jedis);
            }
        }

    }
}
