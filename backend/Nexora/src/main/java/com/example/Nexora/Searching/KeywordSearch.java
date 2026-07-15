package com.example.Nexora.Searching;

import org.springframework.ai.document.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
public class KeywordSearch{

  @Autowired
    private JdbcTemplate jdbcTemplate;

  public List<Document> searchByKeyword(String keyword){
      String sql = "SELECT id, content FROM vector_store WHERE to_tsvector('english', content) @@ plainto_tsquery('english', ?)";
      return jdbcTemplate.query(sql, (rs, rowNum) -> new Document(rs.getString("id"),rs.getString("content"),java.util.Map.of()), keyword);
  }

}
