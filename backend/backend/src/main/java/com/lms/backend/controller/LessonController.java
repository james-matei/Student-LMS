package com.lms.backend.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.core.io.UrlResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.lms.backend.model.Lesson;
import com.lms.backend.service.LessonService;
import org.springframework.web.util.UriUtils;
import java.nio.charset.StandardCharsets;
import java.nio.file.Paths;
import java.nio.file.Path;
import org.springframework.core.io.Resource;


@RestController
@RequestMapping("/api/lessons")
@CrossOrigin(origins = "http://localhost:5173")
public class LessonController {

    private final LessonService lessonService;

    public LessonController(LessonService lessonService) {
        this.lessonService = lessonService;
    }

    // multipart because we're uploading a file + metadata together
    @PostMapping(consumes = "multipart/form-data")
    public Lesson createLesson(
            @RequestParam("courseId") Long courseId,
            @RequestParam("title") String title,
            @RequestParam("type") String type,
            @RequestParam("file") MultipartFile file) throws IOException {
        return lessonService.createLesson(courseId, title, type, file);
    }

    @GetMapping("/course/{courseId}")
    public List<Lesson> getLessonsByCourse(@PathVariable Long courseId) {
        return lessonService.getLessonsByCourse(courseId);
    }

    @DeleteMapping("/{id}")
    public void deleteLesson(@PathVariable Long id) {
        lessonService.deleteLesson(id);
    }
@GetMapping("/file/{fileName}")
public ResponseEntity<Resource> serveFile(
        @PathVariable String fileName) throws IOException {

    // decode %20 back to spaces
    String decodedFileName = UriUtils.decode(fileName, StandardCharsets.UTF_8);
    
    Path filePath = Paths.get("uploads/lessons/").resolve(decodedFileName).normalize();
    Resource resource = new UrlResource(filePath.toUri());

    if (!resource.exists()) {
        return ResponseEntity.notFound().build();
    }

    // set content type based on file extension
    String contentType;
    if (decodedFileName.endsWith(".pdf")) {
        contentType = "application/pdf";
    } else if (decodedFileName.endsWith(".mp4") || decodedFileName.endsWith(".mov")) {
        contentType = "video/mp4";
    } else {
        contentType = "application/octet-stream";
    }

    return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_TYPE, contentType)
            .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + decodedFileName + "\"")
            .header(HttpHeaders.ACCEPT_RANGES, "bytes")
            .body(resource);
}

}