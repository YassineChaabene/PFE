package gestionCommerciale.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import gestionCommerciale.dto.ClientDto;
import gestionCommerciale.entity.Client;
import gestionCommerciale.service.ClientService;

@RestController
@RequestMapping("/clients")
public class ClientController {

    @Autowired
    private ClientService clientService;

    @GetMapping("/get-client")
    public ResponseEntity<ClientDto> getClient(@RequestParam Integer id) {
        ClientDto clientDto = clientService.getClient(id);
        if (clientDto != null) {
            return ResponseEntity.ok(clientDto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/code-exists")
    public ResponseEntity<Boolean> codeExists(@RequestParam Integer code) {
        boolean exists = clientService.codeExists(code);
        return ResponseEntity.ok(exists);
    }


    @PostMapping("/save-client")
    public ResponseEntity<ClientDto> save(@RequestBody ClientDto clientDto) {
        ClientDto savedClient = clientService.save(clientDto);
        return ResponseEntity.ok(savedClient);
    }

    @GetMapping("/delete-client")
    public ResponseEntity<Void> delete(@RequestParam String uuid) {
        clientService.delete(uuid);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/update-client")
    public ResponseEntity<ClientDto> update(@RequestBody ClientDto clientDto) {
        ClientDto updatedClient = clientService.updateClient(clientDto);
        if (updatedClient != null) {
            return ResponseEntity.ok(updatedClient);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/get-all-client")
    public ResponseEntity<List<Client>> getAllClients() {
        List<Client> clients = clientService.getAllClients();
        if (!clients.isEmpty()) {
            return ResponseEntity.ok(clients);
        } else {
            return ResponseEntity.noContent().build();
        }
    }

    @GetMapping("/get-client-by-uuid")
    public ResponseEntity<ClientDto> getClientByUuid(@RequestParam String uuid) {
        ClientDto clientDto = clientService.getClientByUuid(uuid);
        if (clientDto != null) {
            return ResponseEntity.ok(clientDto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
