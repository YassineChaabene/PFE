
package gestionCommerciale.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConventionRowDto {
    private String code;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private String client;
    private String application;
}
