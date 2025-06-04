package gestionCommerciale.service;

import gestionCommerciale.dto.*;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import java.sql.ResultSet;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class GenerationService {
    private final JdbcTemplate jdbc;

    public GenerationService(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public GenerationResultDto generateAndExecute(ConventionFilterDto f) {
        List<String> joins = new ArrayList<>();
        List<String> cond  = new ArrayList<>();

        String sql  = "SELECT c.code, c.start_date, c.end_date, c.status, " +
                      "cl.intitule AS client, ap.intitule AS application " +
                      "FROM public.conventions c";

        if (f.getApp() != null && !f.getApp().isEmpty()) {
            joins.add("JOIN public.applications ap ON c.application_id = ap.id");
            cond.add("ap.intitule = '" + f.getApp() + "'");
        } else {
            joins.add("LEFT JOIN public.applications ap ON c.application_id = ap.id");
        }

        if (f.getCli() != null && !f.getCli().isEmpty()) {
            joins.add("JOIN public.clients cl ON c.client_id = cl.id");
            cond.add("cl.intitule = '" + f.getCli() + "'");
        } else {
            joins.add("LEFT JOIN public.clients cl ON c.client_id = cl.id");
        }

        if (f.getConv() != null && !"ALL".equals(f.getConv())) {
            cond.add("c.code = '" + f.getConv() + "'");
        }
        if (f.getStat() != null && !" <NONE>".equals(f.getStat())) {
            cond.add("c.status = '" + f.getStat() + "'");
        }
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        if (f.getDem() != null) {
            cond.add("c.start_date >= '" + f.getDem().format(fmt) + "'");
        }
        if (f.getFin() != null) {
            cond.add("c.end_date <= '" + f.getFin().format(fmt) + "'");
        }

        StringBuilder sb = new StringBuilder(sql);
        joins.forEach(j -> sb.append(" ").append(j));
        if (!cond.isEmpty()) {
            sb.append(" WHERE ")
              .append(String.join(" AND ", cond));
        }
        String finalSql = sb.toString();
        
        List<ConventionRowDto> rows = jdbc.query(
            finalSql,
            (ResultSet rs, int rowNum) ->
                new ConventionRowDto(
                    rs.getString("code"),
                    rs.getDate("start_date").toLocalDate(),
                    rs.getDate("end_date").toLocalDate(),
                    rs.getString("status"),
                    rs.getString("client"),
                    rs.getString("application")
                )
        );

        GenerationResultDto result = new GenerationResultDto();
        result.setSql(finalSql);
        result.setRows(rows);
        return result;
    }
}
