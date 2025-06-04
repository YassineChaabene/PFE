package gestionCommerciale.service;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gestionCommerciale.convert.ApplicationConvert;
import gestionCommerciale.convert.ResponsableConvert;
import gestionCommerciale.dto.ApplicationDto;
import gestionCommerciale.entity.Application;
import gestionCommerciale.repository.ApplicationRepository;

@Service
public class ApplicationService {

    private static final Logger logger = LoggerFactory.getLogger(ClientService.class);
    
    @Autowired
    private ApplicationRepository  appRepo;
    
    public List<ApplicationDto> getAllApplications() {
        logger.info("Fetching all applications");
        List<Application> applications = appRepo.findAll();
        return applications.stream().map(ApplicationConvert::toDto).toList();
        
    }
    
    public ApplicationDto getApplication(Long id) {
        logger.info("Fetching application with ID: {}", id);
        Optional<Application> application = this.appRepo.findById(id);
        
        if (application.isPresent()) {
            logger.info("application found: {}", application.get());
            return ApplicationConvert.toDto(application.get());
        } else {
            logger.warn("application not found with ID: {}", id);
            return null;
        }
    }
    public ApplicationDto getApplicationByUuid(String uuid) {
        logger.info("Fetching application with UUID: {}", uuid);
        Optional<Application> application = appRepo.findByUuid(uuid);
        
        if (application.isPresent()) {
            logger.info("Application found: {}", application.get());
            return ApplicationConvert.toDto(application.get());
        } else {
            logger.warn("Application not found with UUID: {}", uuid);
            return null;
        }
    }

    
    public ApplicationDto save(ApplicationDto appDto) {
    	logger.info("Saving new application: {}", appDto);
    	Application app = ApplicationConvert.toEntity(appDto);
    	Application savedApp = appRepo.save(app);
    	logger.info("Application saved successfully with ID: {}", savedApp.getUuid());
    	return ApplicationConvert.toDto(savedApp);
    }
    
    public void delete(String uuid) {
        logger.warn("Deleting application with UUID: {}", uuid);

        appRepo.findByUuid(uuid).ifPresentOrElse(application -> {
            appRepo.deleteById(application.getId());
            logger.info("Application with UUID {} deleted successfully", uuid);
        }, () -> {
            logger.error("Application not found with UUID: {}", uuid);
            throw new RuntimeException("Application not found with UUID: " + uuid);
        });
    }

    
    public ApplicationDto updateApplication(ApplicationDto appDto) {
        logger.info("Updating application: {}", appDto);
        Optional<Application> appOpt = appRepo.findByUuid(appDto.getUuid());

        if (appOpt.isPresent()) {
            Application existingApp = appOpt.get();

            // Update only mutable fields
            existingApp.setIntitule(appDto.getIntitule());
            existingApp.setDescription(appDto.getDescription());
            existingApp.setDateExploitation(appDto.getDateExploitation());
            existingApp.setAbreviation(appDto.getAbreviation());

            // Convert ResponsableDto to Responsable entity and set it
            if (appDto.getResponsable() != null) {
                existingApp.setResponsable(ResponsableConvert.toEntity(appDto.getResponsable()));
            }

            Application savedApp = appRepo.save(existingApp);
            logger.info("Application updated successfully: {}", savedApp);
            return ApplicationConvert.toDto(savedApp);
        } else {
            logger.error("Application not found with UUID: {}", appDto.getUuid());
            throw new RuntimeException("Application not found with UUID: " + appDto.getUuid());
        }
    }



}
