package gestionCommerciale.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "factures")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Facture {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, updatable = false)
    private String uuid;

    @Column(nullable = false)
    private String reference;

    @Column(nullable = false)
    private LocalDate dateEmission;
    
    @Column(nullable = false)
    private LocalDate dateEcheance;

    @Column(nullable = false)
    private Double montant;

    @Column(nullable = false)
    private String status; // PAID, UNPAID, OVERDUE

    @ManyToOne
    private Convention convention;

    @PrePersist
    private void generateUuid() {
        if (this.uuid == null) {
            this.uuid = java.util.UUID.randomUUID().toString();
        }
    }
}
