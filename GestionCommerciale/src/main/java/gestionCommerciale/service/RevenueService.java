package gestionCommerciale.service;

import gestionCommerciale.dto.YearlyRevenueDto;
import gestionCommerciale.dto.MonthlyRevenueDto;
import gestionCommerciale.repository.FactureRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.Year;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;  // ← n’oubliez pas cet import

@Service
public class RevenueService {
    private final FactureRepository factureRepo;
    private final RestTemplate rest;

    public RevenueService(FactureRepository factureRepo ,RestTemplate restTemplate) {
        this.factureRepo = factureRepo;
        this.rest = restTemplate;
        
    }

    /** Retourne une liste { year, total } pour chaque année historique */
    public List<YearlyRevenueDto> getAnnualRevenues() {
        return factureRepo.findAnnualRevenues()
                .stream()
                .map(p -> new YearlyRevenueDto(p.getYear(), p.getTotal()))
                .collect(Collectors.toList());
    }
    public List<MonthlyRevenueDto> predictRevenues(int periods) {
        String url = "http://localhost:5000/predict?periods=" + periods;
        MonthlyRevenueDto[] resp = rest.getForObject(url, MonthlyRevenueDto[].class);
        return Arrays.asList(resp);
    }
    public List<MonthlyRevenueDto> predictAll(int periods) {
        String url = "http://localhost:5000/predict_all?periods=" + periods;
        MonthlyRevenueDto[] resp = rest.getForObject(url, MonthlyRevenueDto[].class);
        return Arrays.asList(resp);
    }

public List<MonthlyRevenueDto> getMonthlyHistoryThisYear() {
    LocalDate jan1 = Year.now().atDay(1); 
    return factureRepo.sumMonthlyRevenue(jan1)
        .stream()
        .map(arr -> 
           new MonthlyRevenueDto(
             (String)arr[0], 
             ((Number)arr[1]).doubleValue())
        ).collect(Collectors.toList());
}
public List<MonthlyRevenueDto> getAllMonthlyHistory() {
    return factureRepo.sumMonthlyRevenueAll().stream()
        .map(arr -> new MonthlyRevenueDto(
            (String) arr[0],
            ((Number) arr[1]).doubleValue()
        ))
        .collect(Collectors.toList());
}

}
