// src/main/java/gestionCommerciale/service/ReportService.java
package gestionCommerciale.service;

import gestionCommerciale.dto.ConventionDto;
import gestionCommerciale.dto.FactureDto;
import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReportService {
  private final ResourceLoader resourceLoader;

  public ReportService(ResourceLoader resourceLoader) {
    this.resourceLoader = resourceLoader;
  }

  public byte[] generateInvoicePdf(FactureDto dto) throws JRException {
    Resource jrxmlRes = resourceLoader.getResource("classpath:reports/invoice.jrxml");
    Resource logoRes  = resourceLoader.getResource("classpath:reports/cni.png");

    try (InputStream jrxml = jrxmlRes.getInputStream();
         InputStream logoIn = logoRes.getInputStream()
    	) 
   {
      JasperReport jasper = JasperCompileManager.compileReport(jrxml);
      byte[] logoBytes = logoIn.readAllBytes();
      Map<String,Object> params = new HashMap<>();
      params.put("LOGO", new ByteArrayInputStream(logoBytes));
      params.put("ReportTitle", "Facture N° " + dto.getReference());
      JRBeanCollectionDataSource ds = new JRBeanCollectionDataSource(List.of(dto));
      JasperPrint jp = JasperFillManager.fillReport(jasper, params, ds);
      return JasperExportManager.exportReportToPdf(jp);
    } 
    catch (Exception e) {
      throw new JRException("Une erreur est produit dans la creation de la facture en PDF", e);
    }
  }

  public byte[] generateConventionsListPdf(List<ConventionDto> dtos, String reportTitle) throws JRException {
    Resource jrxmlRes = resourceLoader.getResource("classpath:reports/conventions-list.jrxml");
    Resource logoRes  = resourceLoader.getResource("classpath:reports/cni.png");

    try (InputStream jrxml = jrxmlRes.getInputStream();
    	InputStream logoIn = logoRes.getInputStream()) 
    {
      JasperReport jasper = JasperCompileManager.compileReport(jrxml);
      byte[] logoBytes = logoIn.readAllBytes();
      Map<String,Object> params = new HashMap<>();
      params.put("LOGO", new ByteArrayInputStream(logoBytes));
      params.put("ReportTitle", reportTitle);
      JRBeanCollectionDataSource ds = new JRBeanCollectionDataSource(dtos);
      JasperPrint jp = JasperFillManager.fillReport(jasper, params, ds);
      return JasperExportManager.exportReportToPdf(jp);
    } 
    catch (Exception e){
      throw new JRException("Une erreur est produit dans la creation de la convention en PDF", e);
    }
  }
}
