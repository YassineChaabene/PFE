package gestionCommerciale.controller;

import gestionCommerciale.dto.FactureDto;
import gestionCommerciale.service.FactureService;
import gestionCommerciale.service.ReportService;
import net.sf.jasperreports.engine.JRException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import java.awt.PageAttributes.MediaType;
import java.util.List;

@RestController
@RequestMapping("/factures")
public class FactureController {

	 private final FactureService factureService;
	  private final ReportService reportService;   

	  public FactureController(FactureService factureService,
	                           ReportService reportService) {
	    this.factureService = factureService;
	    this.reportService  = reportService;
	  }

    @GetMapping("/test")
    public String testEndpoint() {
        return "FactureController is working!";
    }

    @GetMapping("/get-facture")
    public ResponseEntity<FactureDto> getFacture(@RequestParam String uuid) {
        FactureDto factureDto = factureService.getFactureByUuid(uuid);
        if (factureDto != null) {
            return ResponseEntity.ok(factureDto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/get-all-factures")
    public ResponseEntity<List<FactureDto>> getAllFactures() {
        List<FactureDto> factures = factureService.getAllFactures();
        if (!factures.isEmpty()) {
            return ResponseEntity.ok(factures);
        } else {
            return ResponseEntity.noContent().build();
        }
    }

    @PostMapping("/save-facture")
    public ResponseEntity<FactureDto> saveFacture(@RequestBody FactureDto factureDto) {
        FactureDto savedFacture = factureService.saveFacture(factureDto);
        return ResponseEntity.ok(savedFacture);
    }

    @PostMapping("/update-facture")
    public ResponseEntity<FactureDto> updateFacture(@RequestBody FactureDto factureDto) {
        FactureDto updated = factureService.saveFacture(factureDto); // save handles both create & update
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/delete-facture")
    public ResponseEntity<Void> deleteFacture(@RequestParam String uuid) {
        factureService.deleteByUuid(uuid);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/print/{uuid}")
    public ResponseEntity<byte[]> printFacture(@PathVariable String uuid) {
        FactureDto dto = factureService.getFactureByUuid(uuid);

        try {
            byte[] pdf = reportService.generateInvoicePdf(dto);

            HttpHeaders headers = new HttpHeaders();
   
            headers.add("Content-Type", "application/pdf");
            headers.add("Content-Disposition",
                        "inline; filename=\"Facture-" + dto.getReference() + ".pdf\"");

            return new ResponseEntity<byte[]>(pdf, headers, HttpStatus.OK);

        } catch (JRException e) {
        	e.printStackTrace();
        	return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
