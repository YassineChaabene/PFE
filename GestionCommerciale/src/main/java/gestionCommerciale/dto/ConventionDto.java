package gestionCommerciale.dto;

import java.time.LocalDate;

import gestionCommerciale.entity.Application;
import gestionCommerciale.entity.Client;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ConventionDto {
	 private String uuid;
	 private Long id;
	 private String code;
	 private String status;
	 private LocalDate startDate;
	 private LocalDate endDate;
	 private Integer clientId;
	 private Long applicationId;
	 private Client    client;
	 private Application application;
}