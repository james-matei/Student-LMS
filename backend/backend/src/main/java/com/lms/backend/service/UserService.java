package com.lms.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.lms.backend.model.User;
import com.lms.backend.repository.UserRepository;

@Service

public class UserService {
    private  final UserRepository userRepository;
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
     public User saveUser(User user) {
        user.setStatus("ACTIVE");
        if (user.getRole() == null) {
             user.setRole(User.ROLE_STUDENT);
        }
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    public User updateUser(Long id, User updatedUser) {

    User existingUser = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
    existingUser.setName(updatedUser.getName());
    existingUser.setEmail(updatedUser.getEmail());
    existingUser.setRegNO(updatedUser.getRegNO());
    existingUser.setPassword(updatedUser.getPassword());
    //existingUser.setRole(updatedUser.getRole());
    return userRepository.save(existingUser);
}

public void deleteUser(Long id) {
    userRepository.deleteById(id);
}

public User getUserById(Long id) {
    return userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
}

public User login(String regNO, String password) {

    User user = userRepository.findByRegNO(regNO);

    if (user == null) {
        throw new RuntimeException("Invalid Registration Number");
    }

    if (!user.getPassword().equals(password)) {
        throw new RuntimeException("Invalid Password");
    }

    return user;
}
public User createTeacher(User user) {
    user.setRole(User.ROLE_TEACHER);
    user.setStatus("ACTIVE");
    return userRepository.save(user);
}

public User createAdmin(User user) {
    user.setRole(User.ROLE_ADMIN);
    user.setStatus("ACTIVE");
    return userRepository.save(user);
}
public User createUser(User user) {
    return userRepository.save(user);
}
public User suspendUser(Long id) {

    User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));

    user.setStatus("SUSPENDED");

    return userRepository.save(user);
}

public User restoreUser(Long id) {

    User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));

    user.setStatus("ACTIVE");

    return userRepository.save(user);
}

    
}
