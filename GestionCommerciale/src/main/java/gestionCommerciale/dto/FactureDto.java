package gestionCommerciale.dto;

import java.time.LocalDate;

import gestionCommerciale.entity.Convention;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FactureDto {
    private Long id;
    private String uuid;
    private String reference;
    private LocalDate dateEmission;
    private LocalDate dateEcheance;
    private Double montant;
    private String status;
    private String conventionUuid;
    private Convention convention;
}
