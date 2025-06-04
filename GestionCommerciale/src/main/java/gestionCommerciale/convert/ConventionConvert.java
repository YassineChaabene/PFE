package gestionCommerciale.convert;

import gestionCommerciale.dto.ConventionDto;
import gestionCommerciale.entity.Convention;

public class ConventionConvert {
    
    // Convert Convention entity to DTO
    public static ConventionDto toDto(Convention entity) {
        if (entity == null) {
            return null;
        }
        return ConventionDto.builder()
        		.uuid(entity.getUuid())
                .id(entity.getId())
                .code(entity.getCode())
                .status(entity.getStatus())
                .startDate(entity.getStartDate())
                .endDate(entity.getEndDate())
                .clientId(entity.getClient() != null ? entity.getClient().getId() : null)
                .applicationId(entity.getApplication() != null ? entity.getApplication().getId() : null)
                .client(entity.getClient())
                .application(entity.getApplication())
                .build();
    }
    
    // Convert Convention DTO to entity
    public static Convention toEntity(ConventionDto conventionDto) {
        if (conventionDto == null) {
            return null;
        }
        return Convention.builder()
        		.uuid(conventionDto.getUuid())
                .id(conventionDto.getId())
                .code(conventionDto.getCode())
                .status(conventionDto.getStatus())
                .startDate(conventionDto.getStartDate())
                .endDate(conventionDto.getEndDate())
                .build();
    }
}