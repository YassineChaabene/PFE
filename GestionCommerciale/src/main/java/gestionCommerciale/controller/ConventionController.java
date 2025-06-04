package gestionCommerciale.controller;

import java.util.List;
import java.util.Map;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import gestionCommerciale.dto.ConventionDto;
import gestionCommerciale.entity.Application;
import gestionCommerciale.entity.Client;
import gestionCommerciale.entity.Convention;
import gestionCommerciale.repository.ApplicationRepository;
import gestionCommerciale.repository.ClientRepo;
import gestionCommerciale.service.ClientService;
import gestionCommerciale.service.ConventionService;
import gestionCommerciale.service.ReportService;
import net.sf.jasperreports.engine.JRException;

@RestController
@RequestMapping("/conventions")
public class ConventionController {

	  private final ConventionService     conventionService;
	  private final ReportService         reportService;
	  private final ClientRepo            clientRepo;
	  private final ApplicationRepository applicationRepo;

	  public ConventionController(
	    ConventionService conventionService,
	    ReportService     reportService,
	    ClientRepo        clientRepo,
	    ApplicationRepository applicationRepo
	  ) {
	    this.conventionService = conventionService;
	    this.reportService     = reportService;
	    this.clientRepo        = clientRepo;
	    this.applicationRepo   = applicationRepo;
	  }
    
    

    @GetMapping("/get-convention")
    public ResponseEntity<ConventionDto> getConvention(@RequestParam String uuid) {
        ConventionDto conventionDto = conventionService.getConventionByUuid(uuid);
        if (conventionDto != null) {
            return ResponseEntity.ok(conventionDto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @GetMapping("/get-all-conventions")
    public ResponseEntity<List<Convention>> getAllConventions() {
        List<Convention> conventions = conventionService.getAllConventions();
        if (!conventions.isEmpty()) {
            return ResponseEntity.ok(conventions);
        } else {
            return ResponseEntity.noContent().build();
        }
    }

  

    @PostMapping("/save-convention")
    public ResponseEntity<ConventionDto> save(@RequestBody ConventionDto conventionDto) {
        ConventionDto savedConvention = conventionService.save(conventionDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedConvention);
    }

    @GetMapping("/delete-convention")
    public ResponseEntity<Void> delete(@RequestParam String uuid) {
        conventionService.delete(uuid);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/update-convention")
    public ResponseEntity<ConventionDto> updateConvention(@RequestBody ConventionDto conventionDto) {
        ConventionDto updatedConvention = conventionService.updateConvention(conventionDto);
        if (updatedConvention != null) {
            return ResponseEntity.ok(updatedConvention);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    

    @GetMapping("/get-expiring-conventions")
    public ResponseEntity<List<Convention>> getExpiringConventions() {
        List<Convention> conventions = conventionService.getConventionsExpiringSoon();
        if (!conventions.isEmpty()) {
            return ResponseEntity.ok(conventions);
        } else {
            return ResponseEntity.noContent().build();
        }
    }
    
    @GetMapping("/get-expired-conventions")
    public ResponseEntity<List<Convention>> getExpiredConventions() {
        List<Convention> expired = conventionService.getExpiredConventions();
        if (!expired.isEmpty()) {
            return ResponseEntity.ok(expired);
        } else {
            return ResponseEntity.noContent().build();
        }
    }

    @GetMapping("/metrics/conventions-by-month")
    public Map<Integer, Long> conventionsByMonth() {
      return conventionService.getConventionsByMonth();
    }
    @GetMapping("/print/by-application/{appId}")
    public ResponseEntity<byte[]> printByApplication(@PathVariable Long appId) throws Exception {
    	
    	Application app = applicationRepo.findById(appId).orElseThrow(
    			() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "application not found: " + appId
    	        )
    	);
    	
        List<ConventionDto> dtos =
            conventionService.findByApplication(appId);

        byte[] pdf = reportService
            .generateConventionsListPdf(dtos, "Conventions pour l'application " + app.getIntitule());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(
            ContentDisposition
                .attachment()
                .filename("Conventions-App-" + appId + ".pdf")
                .build()
        );

        return new ResponseEntity<>(pdf, headers, HttpStatus.OK);
    }

    @GetMapping("/print/by-client/{clientId}")
    public ResponseEntity<byte[]> printByClient(@PathVariable Integer clientId) throws Exception {
    	Client client = clientRepo.findById(clientId).orElseThrow(
    			() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Client not found: " + clientId
    	        )
    	);
    	
    	
        List<ConventionDto> dtos =
            conventionService.findByClient(clientId);

        byte[] pdf = reportService.generateConventionsListPdf(dtos, "Conventions pour le client " + client.getIntitule());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(
            ContentDisposition
                .attachment()
                .filename("Conventions-Client-" + ".pdf")
                .build()
        );

        return new ResponseEntity<>(pdf, headers, HttpStatus.OK);
    }
    @GetMapping("/print/by-code/{code}")
    public ResponseEntity<byte[]> printByCode(@PathVariable String code) {
        ConventionDto dto = conventionService.getConventionByCode(code);
        byte[] pdf;
        try {
            pdf = reportService.generateConventionsListPdf( List.of(dto),"Convention " + code);
        } catch (JRException e) {
            throw new ResponseStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR,"Error generating PDF for convention " + code,e
            );
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(org.springframework.http.MediaType.APPLICATION_PDF);
        headers.setContentDisposition(
            ContentDisposition
              .attachment()
              .filename("Convention-" + code + ".pdf")
              .build()
        );

        return new ResponseEntity<>(pdf, headers, HttpStatus.OK);
    }
}