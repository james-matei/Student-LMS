package com.lms.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.lms.backend.model.Assignment;
import com.lms.backend.service.AssignmentService;

@RestController
@RequestMapping("/api/assignments")
@CrossOrigin(origins = "http://localhost:5173")
public class AssignmentController {

    private final AssignmentService assignmentService;

    public AssignmentController(AssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    @PostMapping
    public Assignment createAssignment(@RequestBody Assignment assignment) {
        return assignmentService.createAssignment(assignment);
    }

    @GetMapping
    public List<Assignment> getAllAssignments() {
        return assignmentService.getAllAssignments();
    }

    @DeleteMapping("/{id}")
    public void deleteAssignment(@PathVariable Long id) {
        assignmentService.deleteAssignment(id);
    }
    @GetMapping("/course/{courseId}")
    public List<Assignment> getAssignmentsByCourse(
        @PathVariable Long courseId) {

    return assignmentService.getAssignmentsByCourse(courseId);
}
@PutMapping("/{id}")
public Assignment updateAssignment(
        @PathVariable Long id,
        @RequestBody Assignment assignment) {

    return assignmentService.updateAssignment(id, assignment);
}

}