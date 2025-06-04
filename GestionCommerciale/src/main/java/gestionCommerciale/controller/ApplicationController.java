package gestionCommerciale.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import gestionCommerciale.dto.ApplicationDto;
import gestionCommerciale.entity.Application;
import gestionCommerciale.service.ApplicationService;

@RestController
@RequestMapping("/applications")
public class ApplicationController {
	
	@Autowired
	private ApplicationService appService;
	
	@GetMapping("/get-application")
	public ResponseEntity<ApplicationDto> getApplication(@RequestParam String uuid){
		ApplicationDto appDto= appService.getApplicationByUuid(uuid);
		if(appDto != null) {
			 return ResponseEntity.ok(appDto);
        } else {
            return ResponseEntity.notFound().build();
        }
	}
	
	@GetMapping("/get-all-applications")
	public ResponseEntity<List<ApplicationDto>> getAllApplications() {
	    List<ApplicationDto> applications = appService.getAllApplications();
	    System.out.println("Fetched applications: " + applications.size());
	    if (!applications.isEmpty()) {
	        return ResponseEntity.ok(applications);
	    } else {
	        return ResponseEntity.noContent().build();
	    }
	}

	
	@PostMapping("/save-application")
    public ResponseEntity<ApplicationDto> save(@RequestBody ApplicationDto appDto) {
		ApplicationDto savedApp = appService.save(appDto);
        return ResponseEntity.ok(savedApp);
    }

    @GetMapping("/delete-application")
    public ResponseEntity<Void> delete(@RequestParam String uuid ) {
        appService.delete(uuid);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/update-application")
    public ResponseEntity<ApplicationDto> updateApplication(@RequestBody ApplicationDto appDto) {
    	ApplicationDto updatedApp = appService.updateApplication(appDto);
        if (updatedApp != null) {
            return ResponseEntity.ok(updatedApp);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
	
}
