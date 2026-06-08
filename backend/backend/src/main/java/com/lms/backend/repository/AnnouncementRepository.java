package com.lms.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.lms.backend.model.Announcement;


    public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {}
    

