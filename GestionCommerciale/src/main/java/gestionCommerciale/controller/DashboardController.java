package gestionCommerciale.controller;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import gestionCommerciale.common.DashboardMetrics;
import gestionCommerciale.dto.FactureDto;
import gestionCommerciale.service.ConventionService;
import gestionCommerciale.service.DashboardService;

@RestController
@RequestMapping("/dashboard/metrics")
public class DashboardController {
	@Autowired
    private final DashboardService dashboardService;
	private final ConventionService conventionService;
    
    

    public DashboardController(DashboardService dashboardService , ConventionService conventionService ) {
        this.dashboardService = dashboardService;
        this.conventionService = conventionService;
    }

    
    @GetMapping("/test")
    public String testEndpoint() {
        return "Dashboard is working!";
    }
    
    @GetMapping
    public DashboardMetrics metrics() {
        return dashboardService.getMetrics();
    }
    @GetMapping("/conventions-by-year")
    public Map<Integer, Long> conventionsByYear() {
      return conventionService.getConventionsByYear();
    }
    
    @GetMapping("/conventions-by-month")
    public Map<Integer,Long>conventionByMonth(){
    	return conventionService.getConventionsByMonth();
    }
    
    @GetMapping("/conventions-upcoming-by-year")
    public Map<Integer, Long> conventionsUpcomingByYear() {
      return conventionService.getUpcomingConventionsByYear();
    }
    @GetMapping("/invoice-status")
    public Map<String,Long> invoiceStatus() {
      return dashboardService.getInvoiceStatusDistribution();
    }
    
    @GetMapping("/recent-invoices")
    public List<FactureDto> recentInvoices(@RequestParam(defaultValue="5") int limit) {
        return dashboardService.getRecentInvoices(limit);
    }
    
    @GetMapping("/clients-by-region")
    public Map<String,Long> clientsByRegion() {
        return dashboardService.getClientsByRegion();
    }
    
    @GetMapping("/monthly-revenue")
    public Map<String,BigDecimal> monthlyRevenue(@RequestParam(defaultValue="24") int monthsBack) {
        return dashboardService.getMonthlyRevenue(monthsBack);
    }
    
}

