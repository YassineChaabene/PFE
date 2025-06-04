// src/main/java/gestionCommerciale/controller/GenerationController.java
package gestionCommerciale.controller;

import gestionCommerciale.dto.*;
import gestionCommerciale.service.GenerationService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/generation")
public class GenerationController {

    private final GenerationService genService;
    public GenerationController(GenerationService genService) {
        this.genService = genService;
    }

    @PostMapping("/execute")
    public GenerationResultDto execute(
        @RequestBody ConventionFilterDto filter
    ) {
        return genService.generateAndExecute(filter);
    }
}
