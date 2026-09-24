package com.dhanabalmart.model;

import jakarta.persistence.*;

@Entity
@Table(name = "admins")
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(length = 100)
    private String department = "Executive Management";

    @Column(columnDefinition = "TEXT")
    private String permissions = "ALL_PRIVILEGES";

    public Admin() {}

    public Admin(User user, String department, String permissions) {
        this.user = user;
        this.department = department != null ? department : "Executive Management";
        this.permissions = permissions != null ? permissions : "ALL_PRIVILEGES";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getPermissions() { return permissions; }
    public void setPermissions(String permissions) { this.permissions = permissions; }
}
