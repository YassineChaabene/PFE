package gestionCommerciale.convert;

import gestionCommerciale.dto.ApplicationDto;
import gestionCommerciale.dto.ResponsableDto;
import gestionCommerciale.entity.Application;
import gestionCommerciale.entity.Responsable;

public class ApplicationConvert {

    // Convert Application entity to ApplicationDto
    public static ApplicationDto toDto(Application entity) {
        if (entity == null) {
            return null;
        }
        ResponsableDto responsableDto = ResponsableConvert.toDto(entity.getResponsable());

        return ApplicationDto.builder()
                .uuid(entity.getUuid())
                .id(entity.getId())
                .intitule(entity.getIntitule())
                .description(entity.getDescription())
                .dateExploitation(entity.getDateExploitation())
                .abreviation(entity.getAbreviation())
                .responsable(responsableDto)
                .build();
    }

    // Convert ApplicationDto to Application entity
    public static Application toEntity(ApplicationDto dto) {
        if (dto == null) {
            return null;
        }
        Responsable responsable = ResponsableConvert.toEntity(dto.getResponsable());

        return Application.builder()
                .uuid(dto.getUuid())
                .id(dto.getId())
                .intitule(dto.getIntitule())
                .description(dto.getDescription())
                .dateExploitation(dto.getDateExploitation())
                .abreviation(dto.getAbreviation())
                .responsable(responsable)
                .build();
    }
}
