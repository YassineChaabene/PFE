package gestionCommerciale.service;

import java.time.LocalDate;
import java.time.Year;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gestionCommerciale.convert.ConventionConvert;
import gestionCommerciale.dto.ConventionDto;
import gestionCommerciale.entity.Application;
import gestionCommerciale.entity.Client;
import gestionCommerciale.entity.Convention;
import gestionCommerciale.repository.ApplicationRepository;
import gestionCommerciale.repository.ClientRepo;
import gestionCommerciale.repository.ConventionRepository;

@Service
public class ConventionService {

    private static final Logger logger = LoggerFactory.getLogger(ConventionService.class);
    
    private final ConventionRepository conventionRepository;
    private final ClientRepo clientRepo;
    private final ApplicationRepository applicationRepo;
    
    @Autowired
    public ConventionService(ConventionRepository conventionRepository,ClientRepo clientRepo,ApplicationRepository applicationRepo) 
    {
        this.conventionRepository = conventionRepository;
        this.clientRepo = clientRepo;
        this.applicationRepo = applicationRepo;
    }
    
    public List<Convention> getAllConventions() {
        logger.info("Fetching all conventions");
        List<Convention> conventions = conventionRepository.findAll();
        logger.info("Total conventions found: {}", conventions.size());
        return conventions;
    }
    
    public ConventionDto getConvention(Long id) {
        logger.info("Fetching convention with ID: {}", id);
        Optional<Convention> convention = conventionRepository.findById(id);
        
        if (convention.isPresent()) {
            logger.info("Convention found: {}", convention.get());
            return ConventionConvert.toDto(convention.get());
        } else {
            logger.warn("Convention not found with ID: {}", id);
            return null;
        }
    }
    
    public ConventionDto getConventionByUuid(String uuid) {
        logger.info("Fetching convention with UUID: {}", uuid);
        Optional<Convention> convention = conventionRepository.findByUuid(uuid);
        
        if (convention.isPresent()) {
            logger.info("Convention found: {}", convention.get());
            return ConventionConvert.toDto(convention.get());
        } else {
            logger.warn("Convention not found with UUID: {}", uuid);
            return null;
        }
    }
    
    public ConventionDto save(ConventionDto conventionDto) {
        logger.info("Saving new convention: {}", conventionDto);

        Client client = clientRepo.findById(conventionDto.getClientId())
            .orElseThrow(() -> new RuntimeException("Client not found with ID: " + conventionDto.getClientId()));

        Application application = applicationRepo.findById(conventionDto.getApplicationId())
            .orElseThrow(() -> new RuntimeException("Application not found with ID: " + conventionDto.getApplicationId()));

        Convention convention = Convention.builder()
            .code(conventionDto.getCode())
            .status(conventionDto.getStatus())
            .startDate(conventionDto.getStartDate())
            .endDate(conventionDto.getEndDate())
            .client(client)
            .application(application)
            .build();

        Convention savedConvention = conventionRepository.save(convention);
        logger.info("Convention saved successfully with ID: {}", savedConvention.getId());

        return ConventionConvert.toDto(savedConvention);
    }
    public void delete(String uuid) {
        logger.warn("Deleting convention with UUID: {}", uuid);

        conventionRepository.findByUuid(uuid).ifPresentOrElse(convention -> {
            conventionRepository.deleteById(convention.getId());
            logger.info("Convention with UUID {} deleted successfully", uuid);
        }, () -> {
            logger.error("Convention not found with UUID: {}", uuid);
            throw new RuntimeException("Convention not found with UUID: " + uuid);
        });
    }
    
    public ConventionDto updateConvention(ConventionDto conventionDto) {
        logger.info("Updating convention: {}", conventionDto);
        Optional<Convention> conventionOpt = conventionRepository.findByUuid(conventionDto.getUuid());
        
        if (conventionOpt.isPresent()) {
            Convention existingConvention = conventionOpt.get();
            
            Client client = clientRepo.findById(conventionDto.getClientId())
                .orElseThrow(() -> new RuntimeException("Client not found with ID: " + conventionDto.getClientId()));
            
            Application application = applicationRepo.findById(conventionDto.getApplicationId())
                .orElseThrow(() -> new RuntimeException("Application not found with ID: " + conventionDto.getApplicationId()));
            
            existingConvention.setCode(conventionDto.getCode());
            existingConvention.setStatus(conventionDto.getStatus());
            existingConvention.setStartDate(conventionDto.getStartDate());
            existingConvention.setEndDate(conventionDto.getEndDate());
            existingConvention.setClient(client);
            existingConvention.setApplication(application);
            
            Convention savedConvention = conventionRepository.save(existingConvention);
            logger.info("Convention updated successfully: {}", savedConvention);
            return ConventionConvert.toDto(savedConvention);
        } else {
            logger.error("Convention not found with UUID: {}", conventionDto.getUuid());
            throw new RuntimeException("Convention not found with UUID: " + conventionDto.getUuid());
        }
    }




    public List<Convention> getConventionsExpiringSoon() {
        LocalDate now = LocalDate.now();
        LocalDate threshold = now.plusDays(30);
        logger.info("Fetching conventions expiring between {} and {}", now, threshold);
        return conventionRepository.findExpiringBetween(now, threshold);
    }
    
    public List<Convention> getExpiredConventions() {
        LocalDate today = LocalDate.now();
        return conventionRepository.findExpiredConventions(today);
    }


    public Map<Integer, Long> getConventionsByMonth() {
        int year = Year.now().getValue();
        return conventionRepository.countByMonthRaw(year)
          .stream()
          .collect(Collectors.toMap(
            row -> ((Number) row[0]).intValue(),    // month
            row -> ((Number) row[1]).longValue(),   // count
            (a, b) -> a,
            LinkedHashMap::new
          ));
      }
    
    public Map<Integer, Long> getConventionsByYear() {
       
        List<Object[]> raw = conventionRepository.countByYearRaw();

       
        Map<Integer, Long> yearToCount = raw.stream()
          .collect(Collectors.toMap(
            row -> ((Number) row[0]).intValue(),
            row -> ((Number) row[1]).longValue()
          ));

        int current = Year.now().getValue();
        Map<Integer, Long> result = new LinkedHashMap<>();
        for (int i = current - 9; i <= current; i++) {
          result.put(i, yearToCount.getOrDefault(i, 0L));
        }
        return result;
      }
    
    public Map<Integer, Long> getUpcomingConventionsByYear() {
        LocalDate today     = LocalDate.now();
        LocalDate threshold = today.plusYears(5);
        List<Object[]> raw = conventionRepository.countUpcomingByYearRaw(today, threshold);

        Map<Integer, Long> yearToCount = raw.stream().collect(Collectors.toMap(
          row -> ((Number)row[0]).intValue(),
          row -> ((Number)row[1]).longValue()
        ));

        int current = Year.now().getValue();
        Map<Integer, Long> result = new LinkedHashMap<>();
        for (int y = current + 1; y <= current + 5; y++) {
          result.put(y, yearToCount.getOrDefault(y, 0L));
        }
        return result;
      }
    
    public List<ConventionDto> findByApplication(Long applicationId) {
        return conventionRepository
            .findByApplication_Id(applicationId)
            .stream()
            .map(ConventionConvert::toDto)
            .collect(Collectors.toList());
    }

    
    public List<ConventionDto> findByClient(Integer clientId) {
        return conventionRepository
            .findByClient_Id(clientId)
            .stream()
            .map(ConventionConvert::toDto)
            .collect(Collectors.toList());
    }
    public ConventionDto getConventionByCode(String code) {
        Convention c = conventionRepository.findByCode(code)
          .orElseThrow(() -> new RuntimeException("Convention not found with code: " + code));
        return ConventionConvert.toDto(c);
      }
}

