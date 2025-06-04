package gestionCommerciale.convert;

import gestionCommerciale.dto.ResponsableDto;
import gestionCommerciale.entity.Responsable;

public class ResponsableConvert {

    // Convert Responsable entity to ResponsableDto
    public static ResponsableDto toDto(Responsable entity) {
        if (entity == null) {
            return null;
        }
        return ResponsableDto.builder()
                .id(entity.getId())
                .nom(entity.getNom())
                .email(entity.getEmail())
                .telephone(entity.getTelephone())
                .build();
    }

    // Convert ResponsableDto to Responsable entity
    public static Responsable toEntity(ResponsableDto dto) {
        if (dto == null) {
            return null;
        }
        return Responsable.builder()
                .id(dto.getId())
                .nom(dto.getNom())
                .email(dto.getEmail())
                .telephone(dto.getTelephone())
                .build();
    }
}
