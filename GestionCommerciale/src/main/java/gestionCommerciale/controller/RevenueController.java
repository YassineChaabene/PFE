package gestionCommerciale.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import gestionCommerciale.dto.YearlyRevenueDto;
import gestionCommerciale.dto.MonthlyRevenueDto;
import gestionCommerciale.service.RevenueService;

@RestController
@RequestMapping("/api/revenue")
public class RevenueController {

    private final RevenueService revenueService;

    public RevenueController(RevenueService revenueService) {
        this.revenueService = revenueService;
    }

    @GetMapping("/historical")
    public List<YearlyRevenueDto> getAnnualRevenues() {
        return revenueService.getAnnualRevenues();
    }
    @GetMapping("/predict")
    public List<MonthlyRevenueDto> predictRevenue(@RequestParam(defaultValue="5") int periods) {
      return revenueService.predictRevenues(periods);
    }
    @GetMapping("/predict-all")
    public List<MonthlyRevenueDto> predictAll(@RequestParam(defaultValue="5") int periods) {
      return revenueService.predictAll(periods);
    }

    @GetMapping("/historical-monthly")
    public List<MonthlyRevenueDto> historicalMonthly() {
      return revenueService.getMonthlyHistoryThisYear();
    }
    @GetMapping("/historical-monthly-all")
    public List<MonthlyRevenueDto> historicalMonthlyAll() {
      return revenueService.getAllMonthlyHistory();
    }

}