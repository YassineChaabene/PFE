package gestionCommerciale.service;

import gestionCommerciale.convert.FactureConvert;
import gestionCommerciale.dto.FactureDto;
import gestionCommerciale.entity.Convention;
import gestionCommerciale.entity.Facture;
import gestionCommerciale.repository.ConventionRepository;
import gestionCommerciale.repository.FactureRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FactureService {
    private static final Logger logger = LoggerFactory.getLogger(FactureService.class);

    private final FactureRepository factureRepo;
    private final ConventionRepository conventionRepo;

    public List<FactureDto> getAllFactures() {
        List<Facture> factures = factureRepo.findAll();
        logger.info("Fetched {} factures", factures.size());
        return factures.stream().map(FactureConvert::toDto).collect(Collectors.toList());
    }

    public FactureDto getFactureByUuid(String uuid) {
        return factureRepo.findByUuid(uuid)
                .map(FactureConvert::toDto)
                .orElseThrow(() -> new RuntimeException("Facture not found with UUID: " + uuid));
    }

    public FactureDto saveFacture(FactureDto dto) {
        Convention convention = conventionRepo.findByUuid(dto.getConventionUuid())
                .orElseThrow(() -> new RuntimeException("Convention not found with UUID: " + dto.getConventionUuid()));

        Facture facture = FactureConvert.toEntity(dto);
        facture.setConvention(convention);

        Facture saved = factureRepo.save(facture);
        logger.info("Saved facture with ID: {}", saved.getId());
        return FactureConvert.toDto(saved);
    }

    public void deleteByUuid(String uuid) {
        factureRepo.findByUuid(uuid).ifPresentOrElse(
            facture -> {
                factureRepo.delete(facture);
                logger.info("Deleted facture with UUID: {}", uuid);
            },
            () -> {
                logger.error("Facture not found with UUID: {}", uuid);
                throw new RuntimeException("Facture not found with UUID: " + uuid);
            }
        );
    }
}
