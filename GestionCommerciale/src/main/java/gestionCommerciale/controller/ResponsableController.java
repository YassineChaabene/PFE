package gestionCommerciale.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import gestionCommerciale.dto.ResponsableDto;
import gestionCommerciale.service.ResponsableService;

@RestController
@RequestMapping("/responsables")
public class ResponsableController {

    private final ResponsableService responsableService;

    public ResponsableController(ResponsableService responsableService) {
        this.responsableService = responsableService;
    }

    @GetMapping("/names")
    public ResponseEntity<List<String>> getResponsableNames() {
        return ResponseEntity.ok(responsableService.getAllResponsableNames());
    }

    @GetMapping("/all")
    public ResponseEntity<List<ResponsableDto>> getAllResponsables() {
        return ResponseEntity.ok(responsableService.findAll());
    }
}
