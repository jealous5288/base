package net.ruixin.service.plat.shiro.server;

import net.ruixin.service.plat.shiro.factory.IShiro;
import net.ruixin.service.plat.shiro.factory.ShiroFactroy;
import net.ruixin.service.plat.shiro.remote.IRemoteService;
import net.ruixin.service.plat.shiro.remote.PermissionContext;
import org.apache.shiro.session.Session;
import org.apache.shiro.session.mgt.eis.SessionDAO;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.Serializable;

public class RemoteService implements IRemoteService {

    @Autowired
    private SessionDAO sessionDAO;

    @Override
    public Session getSession(String appKey, Serializable sessionId) {
        return sessionDAO.readSession(sessionId);
    }

    @Override
    public Serializable createSession(Session session) {
        return sessionDAO.create(session);
    }

    @Override
    public void updateSession(String appKey, Session session) {
        sessionDAO.update(session);
    }

    @Override
    public void deleteSession(String appKey, Session session) {
        sessionDAO.delete(session);
    }

    @Override
    public PermissionContext getPermissions(String appKey, String username) {
        IShiro shiroFactory = ShiroFactroy.me();
        PermissionContext permissionContext = new PermissionContext();
        permissionContext.setRoles(shiroFactory.findRoles(appKey, username));
        permissionContext.setPermissions(shiroFactory.findPermissions(appKey, username));
        return permissionContext;
    }
}
