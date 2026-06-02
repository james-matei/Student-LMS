package com.lms.backend.dto;

public class LoginRequest {

    private String regNO;
    private String password;

    public LoginRequest() {
    }

    public String getRegNO() {
        return regNO;
    }

    public void setRegNO(String regNO) {
        this.regNO = regNO;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}