package gestionCommerciale.controller;

import gestionCommerciale.service.MailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/notifications")
public class MailController {

    private final MailService mailService;

    public MailController(MailService mailService) {
        this.mailService = mailService;
    }

    @PostMapping("/send-alert")
    public ResponseEntity<String> sendEmailAlert(
            @RequestParam String to,
            @RequestParam String conventionCode,
            @RequestParam String endDate
    ) {
        String subject = "Convention Expiration Alerte";
        String message = String.format(
            "Bonjour,\n\nLa convention \"%s\" expirera le %s.\nMerci de prendre les mesures nécessaires.\n\nCordialement.",
            conventionCode, endDate
        );

        try {
            mailService.sendAlertEmail(to, subject, message);
            return ResponseEntity.ok("Email envoyé avec succès à " + to);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Échec de l'envoi de l'email : " + e.getMessage());
        }
    }
    
}
