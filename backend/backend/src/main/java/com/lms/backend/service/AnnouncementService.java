package com.lms.backend.service;
import java.util.List;

import org.springframework.stereotype.Service;

import com.lms.backend.model.Announcement;
import com.lms.backend.repository.AnnouncementRepository;


@Service
public class AnnouncementService {

    private final AnnouncementRepository repo;

    public AnnouncementService(AnnouncementRepository repo) {
        this.repo = repo;
    }

    public Announcement create(Announcement a) {
        return repo.save(a);
    }

    public List<Announcement> getAll() {
        return repo.findAll();
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}
