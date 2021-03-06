package net.ruixin.domain.plat.organ;

import net.ruixin.domain.plat.BaseDomain;
import net.ruixin.enumerate.plat.Sfyx_st;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.Formula;

import javax.persistence.*;

/**
 * 实体：组织用户关联表
 */
@SuppressWarnings("unused")
@Table(name = "SYS_GLB_ORGAN_USER")
@Entity
@DynamicInsert
@DynamicUpdate
public class SysGlbOrganUser extends BaseDomain {
    @Id
    @SequenceGenerator(name = "seq_sys_glb_organ_user", sequenceName = "SEQ_SYS_GLB_ORGAN_USER", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_sys_glb_organ_user")
    private Long id;
    //用户ID
    @Column(name = "USER_ID")
    private Long userId;
    //组织ID
    @Column(name = "ORGAN_ID")
    private Long organId;
    //有效标识
    @Enumerated
    private Sfyx_st sfyx_st;

    // 机构名称
    @Formula("(SELECT ORGAN.ORGAN_NAME FROM SYS_ORGAN ORGAN WHERE ORGAN.ID=ORGAN_ID AND ORGAN.SFYX_ST='1')")
    private String organName;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getOrganId() {
        return organId;
    }

    public void setOrganId(Long organId) {
        this.organId = organId;
    }

    public Sfyx_st getSfyx_st() {
        return sfyx_st;
    }

    public void setSfyx_st(Sfyx_st sfyx_st) {
        this.sfyx_st = sfyx_st;
    }

    public String getOrganName() {
        return organName;
    }

    public void setOrganName(String organName) {
        this.organName = organName;
    }
}
