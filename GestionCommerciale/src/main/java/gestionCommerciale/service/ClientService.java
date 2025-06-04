package gestionCommerciale.service;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import gestionCommerciale.convert.ClientConvert;
import gestionCommerciale.dto.ClientDto;
import gestionCommerciale.entity.Client;
import gestionCommerciale.repository.ClientRepo;



@Service
public class ClientService {
    
    private static final Logger logger = LoggerFactory.getLogger(ClientService.class);

    @Autowired
    private ClientRepo clientRepo;

    public ClientDto getClient(Integer id) {
        logger.info("Fetching client with ID: {}", id);
        Optional<Client> client = this.clientRepo.findById(id);
        
        if (client.isPresent()) {
            logger.info("Client found: {}", client.get());
            return ClientConvert.toDto(client.get());
        } else {
            logger.warn("Client not found with ID: {}", id);
            return null;
        }
    }

    public ClientDto getClientByUuid(String uuid) {
        logger.info("Fetching client with UUID: {}", uuid);
        Optional<Client> client = clientRepo.findByUuid(uuid);
        
        if (client.isPresent()) {
            logger.info("Client found: {}", client.get());
            return ClientConvert.toDto(client.get());
        } else {
            logger.warn("Client not found with UUID: {}", uuid);
            return null;
        }
    }

    public ClientDto save(ClientDto clientDto) {
        logger.info("Enregistrement d'un nouveau client {}", clientDto);

        
        if (clientRepo.existsByCode(clientDto.getCode())) {
            throw new IllegalArgumentException("Le code client existe déjà : " + clientDto.getCode());
        }

        Client client = ClientConvert.toEntity(clientDto);
        Client savedClient = clientRepo.save(client);

        logger.info("Client ajouté ave succès  CODE: {}", savedClient.getCode());
        return ClientConvert.toDto(savedClient);
    }


    public void delete(String uuid) {
        logger.warn("Deleting client with UUID: {}", uuid);
        
        clientRepo.findByUuid(uuid).ifPresentOrElse(client -> {
            clientRepo.deleteById(client.getId());
            logger.info("Client with UUID {} deleted successfully", uuid);
        }, () -> {
            logger.error("Client not found with UUID: {}", uuid);
            throw new RuntimeException("Client not found with UUID: " + uuid);
        });
    }

    public ClientDto updateClient(ClientDto clientDto) {
        logger.info("Updating client: {}", clientDto);
        return clientRepo.findByUuid(clientDto.getUuid())
          .map(existing -> {
           
            existing.setCode(clientDto.getCode());
            existing.setIntitule(clientDto.getIntitule());
            existing.setTelephone(clientDto.getTelephone());
            existing.setEmail(clientDto.getEmail());
            existing.setAdresse(clientDto.getAdresse());
            existing.setGouvernorat(clientDto.getGouvernorat());

            Client saved = clientRepo.save(existing);
            logger.info("Client updated successfully: {}", saved);
            return ClientConvert.toDto(saved);
          })
          .orElseThrow(() -> {
            logger.error("Client not found with UUID: {}", clientDto.getUuid());
            return new RuntimeException("Client not found with UUID: " + clientDto.getUuid());
          });
    }

    public List<Client> getAllClients() {
        logger.info("Fetching all clients");
        List<Client> clients = clientRepo.findAll();
        logger.info("Total clients found: {}", clients.size());
        return clients;
    }
    public boolean codeExists(Integer code) {
        logger.info("Vérification d'existence du code client : {}", code);
        return clientRepo.existsByCode(code);
    }

}