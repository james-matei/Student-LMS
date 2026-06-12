package com.lms.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.lms.backend.model.Assignment;
import com.lms.backend.repository.AssignmentRepository;
import com.lms.backend.dto.AssignmentRequest;
import com.lms.backend.repository.CourseRepository;
import com.lms.backend.model.Course;


@Service
public class AssignmentService {
    
    private final CourseRepository courseRepository;
    private final AssignmentRepository assignmentRepository;

    public AssignmentService(AssignmentRepository assignmentRepository, CourseRepository courseRepository) {
        this.assignmentRepository = assignmentRepository;
        this.courseRepository = courseRepository;
    }

    public Assignment createAssignment(AssignmentRequest request) {
        System.out.println("CourseID recieved: " + request.getCourseId());
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found"));
        Assignment assignment = new Assignment();
        assignment.setTitle(request.getTitle());
        assignment.setDueDate(request.getDueDate());
        assignment.setTokenReward(request.getTokenReward() != null ? request.getTokenReward() : 0);
        assignment.setCourse(course);


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
public Assignment updateAssignment(Long id, AssignmentRequest request) {

    Assignment existing =
            assignmentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Assignment not found"));

    Course course = courseRepository.findById(request.getCourseId())
            .orElseThrow(() -> new RuntimeException("Course not found"));
    existing.setTitle(request.getTitle());
    existing.setDueDate(request.getDueDate());
    existing.setTokenReward(request.getTokenReward() != null ? request.getTokenReward() : 0);
     existing.setCourse(course);

    return assignmentRepository.save(existing);
}

}