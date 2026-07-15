package com.example.Nexora.Controller;

import com.example.Nexora.Model.MyForm;
import com.example.Nexora.Searching.SemanticSearch;
import org.apache.tika.exception.TikaException;
import org.apache.tika.parser.microsoft.ooxml.OOXMLTikaBodyPartHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.apache.tika.Tika;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.ai.document.Document;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@CrossOrigin
@Controller
public class UploadFilesController {

    @Autowired
    private SemanticSearch semanticSearch;

    @PostMapping("/form")
    public ResponseEntity<?> HandleFormUpload(MyForm form) throws IOException, TikaException {
        if(!form.getFile().isEmpty()){
            Tika tika = new Tika();
            List<Document> documents = new ArrayList<>();
            for(MultipartFile file : form.getFile()) {
                   String text = tika.parseToString(file.getInputStream());
                    Document doc = new Document(text);
                    documents.add(doc);
//                System.out.println(text);
            }

            semanticSearch.saveResumes(documents);

                System.out.println("Total documents prepared : " + documents.size());
            return new ResponseEntity<>(HttpStatus.OK);
        }
        else return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

}
