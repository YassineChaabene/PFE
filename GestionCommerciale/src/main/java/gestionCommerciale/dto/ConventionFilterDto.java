
package gestionCommerciale.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConventionFilterDto {
    private String conv;
    private String stat;
    private LocalDate dem;
    private LocalDate fin;
    private String app;
    private String cli;
}
