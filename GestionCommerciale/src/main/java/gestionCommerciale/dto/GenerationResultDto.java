
package gestionCommerciale.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GenerationResultDto {
    private String sql;
    private List<ConventionRowDto> rows;
}
