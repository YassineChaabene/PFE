package gestionCommerciale.dto;

public class MonthlyRevenueDto {
    private String date;
    private Double total;

    public MonthlyRevenueDto() {}

    public MonthlyRevenueDto(String date, Double total) {
        this.date = date;
        this.total = total;
    }

    public String getDate()  { return date; }
    public Double getTotal() { return total; }
}
