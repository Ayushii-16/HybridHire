package com.example.Nexora.Model;

import jakarta.persistence.Entity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


public class MyForm {

    private String name;
    private List<MultipartFile> file;


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<MultipartFile> getFile() {
        return file;
    }

    public void setFile(List<MultipartFile> file) {
        this.file = file;
    }
}
