package net.ruixin.service.plat.workflow.impl;


import net.ruixin.dao.plat.workflow.impl.TeacherDao;
import net.ruixin.domain.plat.workflow.test.Teacher;
import net.ruixin.util.paginate.FastPagination;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@Transactional
public class TeacherService {

    @Autowired
    private TeacherDao teacherDao;

    public FastPagination getTeacherList(Map map) {
        return teacherDao.getBlList(map);
    }

    public Long save(Teacher teacher) {
        teacherDao.saveOrUpdate(teacher);
        return teacher.getId();
    }

    public void del(Long id) {
        teacherDao.delete(id);
    }

    public Teacher get(Long id) {
        return teacherDao.get(id);
    }
}
