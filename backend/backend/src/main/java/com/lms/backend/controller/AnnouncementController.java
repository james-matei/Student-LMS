package com.lms.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.lms.backend.model.Announcement;
import com.lms.backend.service.AnnouncementService;


@RestController
@RequestMapping("/api/announcements")
@CrossOrigin(origins = "http://localhost:5173")
public class AnnouncementController {

    private final AnnouncementService service;

    public AnnouncementController(AnnouncementService service) {
        this.service = service;
    }

    @PostMapping
    public Announcement create(@RequestBody Announcement a) {
        return service.create(a);
    }

    @GetMapping
    public List<Announcement> getAll() {
        return service.getAll();
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
