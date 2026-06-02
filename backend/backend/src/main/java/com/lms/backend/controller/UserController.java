package com.lms.backend.controller;

import java.util.List;
import com.lms.backend.dto.LoginRequest;
import org.springframework.web.bind.annotation.*;

import com.lms.backend.model.User;
import com.lms.backend.service.UserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.saveUser(user);
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PutMapping("/{id}")
public User updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
    return userService.updateUser(id, updatedUser);
}

@DeleteMapping("/{id}")
public String deleteUser(@PathVariable Long id) {
    userService.deleteUser(id);
    return "User deleted successfully";
}

@GetMapping("/{id}")
public User getUserById(@PathVariable Long id) {
    return userService.getUserById(id);
}
@PostMapping("/login")
public User login(@RequestBody LoginRequest request) {

    return userService.login(
            request.getRegNO(),
            request.getPassword()
    );
}

}
