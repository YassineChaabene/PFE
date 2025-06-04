package gestionCommerciale.convert;

import gestionCommerciale.dto.FactureDto;
import gestionCommerciale.entity.Facture;

public class FactureConvert {

    // Convert entity to DTO
    public static FactureDto toDto(Facture entity) {
        if (entity == null) {
            return null;
        }
        return FactureDto.builder()
                .id(entity.getId())
                .uuid(entity.getUuid())
                .reference(entity.getReference())
                .dateEmission(entity.getDateEmission())
                .dateEcheance(entity.getDateEcheance())
                .montant(entity.getMontant())
                .status(entity.getStatus())
                .conventionUuid(entity.getConvention() != null ? entity.getConvention().getUuid() : null)
                .convention(entity.getConvention())
                .build();
    }

    // Convert DTO to entity
    public static Facture toEntity(FactureDto dto) {
        if (dto == null) {
            return null;
        }
        return Facture.builder()
                .id(dto.getId())
                .uuid(dto.getUuid())
                .reference(dto.getReference())
                .dateEmission(dto.getDateEmission())
                .dateEcheance(dto.getDateEcheance())
                .montant(dto.getMontant())
                .status(dto.getStatus())
                .build(); // Note: Convention will be set separately in the service layer
    }
}
