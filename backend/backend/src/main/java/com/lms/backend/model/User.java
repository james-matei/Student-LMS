package com.lms.backend.model;
import jakarta.persistence.*;

@Entity
 @Table(name = "users")

public class User {
     public static final String ROLE_STUDENT = "ROLE_STUDENT";
    public static final String ROLE_TEACHER = "ROLE_TEACHER";
    public static final String ROLE_ADMIN = "ROLE_ADMIN";
   
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String regNO;
    private String name;
    private String email;
    private String password;
    private String role;

    @Column(nullable = false)
    private String status;

    public User() {

    }

    public User(String regNO, String name, String email, String password, String role, String status) {
        this.regNO = regNO;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;

        this.status = status;
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getRegNO() {
        return regNO;
    }
    public void setRegNO(String regNO) {
        this.regNO = regNO;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public String getRole() {
        return role;
    }
    public void setRole(String role) {
        this.role = role;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }


    

    
}
