package gestionCommerciale.service;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import gestionCommerciale.common.DashboardMetrics;
import gestionCommerciale.convert.FactureConvert;
import gestionCommerciale.dto.FactureDto;
import gestionCommerciale.repository.ApplicationRepository;
import gestionCommerciale.repository.ClientRepo;
import gestionCommerciale.repository.ConventionRepository;
import gestionCommerciale.repository.FactureRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardService {
    private final ClientRepo clientRepo;
    private final ConventionRepository convRepo;
    private final ApplicationRepository appRepo;
    private final FactureRepository factureRepo;

    public DashboardService(ClientRepo clientRepo,
                            ConventionRepository convRepo, ApplicationRepository appRepo, FactureRepository factureRepo) {
        this.clientRepo = clientRepo;
        this.convRepo   = convRepo;
        this.appRepo=appRepo;
        this.factureRepo = factureRepo;
    }

    public DashboardMetrics getMetrics() {
        long totalClients        = clientRepo.count();
        long activeConventions   = convRepo.countByStatus("ACTIVE");
        long totalApplications        = appRepo.count();
        long totalRevenue    = factureRepo.sumAllMontants();
        

        return new DashboardMetrics(
          totalClients,
          activeConventions,
          totalApplications,
          totalRevenue
        );
    }
    public Map<String, Long> getInvoiceStatusDistribution() {
        List<Object[]> raw = factureRepo.countByStatusRaw();
        return raw.stream()
          .collect(Collectors.toMap(
            row -> (String) row[0],
            row -> (Long)   row[1],
            (a,b) -> a,
            LinkedHashMap::new
          ));
      }
    public List<FactureDto> getRecentInvoices(int limit) {
        return factureRepo.findAllByOrderByDateEmissionDesc(PageRequest.of(0, limit))
                          .stream()
                          .map(FactureConvert::toDto)
                          .collect(Collectors.toList());
    }
    
    public Map<String,Long> getClientsByRegion() {
        return clientRepo.countByGouvernoratRaw().stream()
          .collect(Collectors.toMap(
            row -> (String) row[0],
            row -> (Long)   row[1],
            (a,b) -> a,
            LinkedHashMap::new
          ));
    }
    
    public Map<String, BigDecimal> getMonthlyRevenue(int monthsBack) {
        LocalDate start = YearMonth.now()
                                   .minusMonths(monthsBack - 1)
                                   .atDay(1);
        List<Object[]> raw = factureRepo.sumMonthlyRevenue(start);

        return raw.stream().collect(Collectors.toMap(
          row -> (String) row[0],
          row -> {
              Object val = row[1];
              if (val instanceof BigDecimal) {
                  return (BigDecimal) val;
              } else if (val instanceof Number) {
                 
                  return BigDecimal.valueOf(((Number) val).doubleValue());
              } else {
                 
                  return new BigDecimal(val.toString());
              }
          },
          (a, b) -> a,
          LinkedHashMap::new
        ));
    }
    
}
