package gestionCommerciale.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import gestionCommerciale.convert.ResponsableConvert;
import gestionCommerciale.dto.ResponsableDto;
import gestionCommerciale.repository.ResponsableRepository;

@Service
public class ResponsableService {

    private final ResponsableRepository responsableRepository;

    public ResponsableService(ResponsableRepository responsableRepository) {
        this.responsableRepository = responsableRepository;
    }

    public List<String> getAllResponsableNames() {
        return responsableRepository.findAllNames();
    }
    public List<ResponsableDto> findAll() {
        return responsableRepository.findAll()
                .stream()
                .map(ResponsableConvert::toDto)
                .collect(Collectors.toList());
    }
}