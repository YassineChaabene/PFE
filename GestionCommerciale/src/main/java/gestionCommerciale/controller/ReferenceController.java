package gestionCommerciale.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import gestionCommerciale.repository.ApplicationRepository;
import gestionCommerciale.repository.ClientRepo;
import gestionCommerciale.repository.ConventionRepository;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/ref")
@AllArgsConstructor
public class ReferenceController {
	private final ConventionRepository conventionRepo;
	  private final ApplicationRepository applicationRepo;
	  private final ClientRepo clientRepo;

	  @GetMapping("/conventions/codes")
	  public List<String> getAllConventionCodes() {
	    return conventionRepo.findAllCodes();
	  }

	  @GetMapping("/conventions/statuses")
	  public List<String> getAllStatuses() {
	    return conventionRepo.findDistinctStatuses();
	  }

	  @GetMapping("/applications")
	  public List<String> getAllApplications() {
	    return applicationRepo.findAllIntitules();
	  }

	  @GetMapping("/clients")
	  public List<String> getAllClients() {
	    return clientRepo.findAllIntitules();
	  }

}
