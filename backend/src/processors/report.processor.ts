//"use strict";

//const { reportQueue } = require('../../config/queue');

//module.exports = () => {
//  reportQueue.process('generate-report', async (job) => {
//    const { reportId, type, dataRange, filters } = job.data;
//
//    try {
//      // Actualizar estado a "procesando"
//      await strapi.entityService.update('api::report.report', reportId, {
//        data: {
//          state: 'procesando'
//        }
//      });
//
//      // Obtener servicio de reportes
//      const reportService = strapi.service('api::report.report');
//      let reportInformation;
//
//      // Generar reporte según tipo
//      switch (type) {
//        case 'ventas':
//          reportInformation = await reportService.generateSalesReport(dataRange, filters);
//          break;
//
//        case 'inventario':
//          reportInformation = await reportService.generateInventoryReport();
//          break;
//
//        case 'comportamiento':
//          reportInformation = await reportService.generateBehaviorReport(dataRange);
//          break;
//
//        case 'productos_vendidos':
//          // En este caso es una variante del reporte de ventas enfocada en productos
//          reportInformation = await reportService.generateSalesReport(dataRange, {
//            ...filters,
//            groupBy: 'product'
//          });
//          break;
//
//        default:
//          throw new Error(`Tipo de reporte no soportado: ${type}`);
//      }
//
//      // Formatear reporte según formato solicitado
//      const formattedReport = await reportService.formatReport(
//        reportInformation,
//        job.data.format || 'json'
//      );
//
//      // Actualizar reporte con información y cambiar estado a completado
//      await strapi.entityService.update('api::report.report', reportId, {
//        data: {
//          state: 'completado',
//          information: reportInformation,
//          title: `Reporte de ${type} - ${new Date().toISOString()}`,
//          publishedAt: new Date()
//        }
//      });
//
//      return {
//        success: true,
//        reportId,
//        type,
//        completedAt: new Date()
//      };
//
//    } catch (error) {
//      // Actualizar reporte con error
//      await strapi.entityService.update('api::report.report', reportId, {
//        data: {
//          state: 'fallido',
//          information: { error: error.message },
//          publishedAt: new Date()
//        }
//      });
//
//      // Log del error
//      strapi.log.error('Error procesando reporte:', {
//        reportId,
//        type,
//        error: error.message,
//        stack: error.stack
//      });
//
//      // Relanzar error para que Bull lo maneje
//      throw error;
//    }
//  });
//
//  // Configurar manejo de errores global de la cola
//  reportQueue.on('failed', (job, error) => {
//    strapi.log.error('Error en cola de reportes:', {
//      jobId: job.id,
//      reportId: job.data.reportId,
//      error: error.message
//    });
//  });
//
//  reportQueue.on('completed', (job) => {
//    strapi.log.info('Reporte completado:', {
//      jobId: job.id,
//      reportId: job.data.reportId
//    });
//  });
//};