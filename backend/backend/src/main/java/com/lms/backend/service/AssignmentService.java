package com.lms.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.lms.backend.model.Assignment;
import com.lms.backend.repository.AssignmentRepository;

@Service
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;

    public AssignmentService(AssignmentRepository assignmentRepository) {
        this.assignmentRepository = assignmentRepository;
    }

    public Assignment createAssignment(Assignment assignment) {
        return assignmentRepository.save(assignment);
    }

    public List<Assignment> getAllAssignments() {
        return assignmentRepository.findAll();
    }

    public void deleteAssignment(Long id) {
        assignmentRepository.deleteById(id);
    }
    public List<Assignment> getAssignmentsByCourse(Long courseId) {
    return assignmentRepository.findByCourseId(courseId);
}
public Assignment updateAssignment(Long id, Assignment assignment) {

    Assignment existing =
            assignmentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Assignment not found"));

    existing.setTitle(assignment.getTitle());
    existing.setDueDate(assignment.getDueDate());
    existing.setCourse(assignment.getCourse());

    return assignmentRepository.save(existing);
}

}