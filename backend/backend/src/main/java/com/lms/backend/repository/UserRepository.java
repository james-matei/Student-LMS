package com.lms.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lms.backend.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    

}
