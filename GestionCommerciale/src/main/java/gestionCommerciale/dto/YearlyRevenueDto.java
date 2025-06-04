package gestionCommerciale.dto;

public class YearlyRevenueDto {
    private Integer year;
    private Double total;

    public YearlyRevenueDto(Integer year, Double total) {
        this.year = year;
        this.total = total;
    }

    public Integer getYear() {
        return year;
    }

    public Double getTotal() {
        return total;
    }
}
