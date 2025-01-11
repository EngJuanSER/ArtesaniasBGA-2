
"use strict";

import { factories } from '@strapi/strapi';

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::report.report", ({ strapi }) => ({
  async create(ctx) {
    try {
      // Verificar usuario y rol
      const user = ctx.state.user;
      if (!user) return ctx.unauthorized("No autorizado");

      const userWithRole = await strapi.entityService.findOne(
        'plugin::users-permissions.user',
        user.id,
        { populate: ['role'] }
      );

      if (userWithRole?.role?.type !== 'admin') {
        return ctx.unauthorized("Solo administradores pueden generar reportes");
      }

      const { type, dataRange, filters, format = 'json' } = ctx.request.body;

      // Validaciones
      if (!type || !dataRange) {
        return ctx.badRequest("Tipo y rango de fechas son requeridos");
      }

      if (!['ventas', 'inventario', 'comportamiento', 'productos_vendidos'].includes(type)) {
        return ctx.badRequest("Tipo de reporte inválido");
      }

      // Crear reporte
      const report = await strapi.entityService.create('api::report.report', {
        data: {
          title: `Reporte de ${type} - ${new Date().toISOString()}`,
          type,
          dataRange,
          filters,
          format,
          state: 'pendiente',
          user: user.id,
          publishedAt: new Date()
        }
      });

      // Agregar a la cola de procesamiento
      await strapi.service('api::report.report').addToQueue(report);

      return { data: report };
    } catch (error) {
      strapi.log.error("Error creating report:", error);
      return ctx.badRequest(error.message || "Error al crear reporte");
    }
  },

  async findAllByUser(ctx) {
    try {
      const user = ctx.state.user;
      if (!user) return ctx.unauthorized("No autorizado");

      const userWithRole = await strapi.entityService.findOne(
        'plugin::users-permissions.user',
        user.id,
        { populate: ['role'] }
      );

      if (userWithRole?.role?.type !== 'admin') {
        return ctx.unauthorized("Solo administradores pueden ver reportes");
      }

      const reports = await strapi.entityService.findMany('api::report.report', {
        filters: { user: user.id },
        sort: { createdAt: 'desc' },
        populate: ['user']
      });

      return { data: reports };
    } catch (error) {
      return ctx.badRequest(error.message || "Error al obtener reportes");
    }
  },

  async download(ctx) {
    try {
      const user = ctx.state.user;
      if (!user) return ctx.unauthorized("No autorizado");

      const userWithRole = await strapi.entityService.findOne(
        'plugin::users-permissions.user',
        user.id,
        { populate: ['role'] }
      );

      if (userWithRole?.role?.type !== 'admin') {
        return ctx.unauthorized("Solo administradores pueden descargar reportes");
      }

      const { id } = ctx.params;
      const report = await strapi.entityService.findOne('api::report.report', id, {
        populate: ['user']
      });

      if (!report || report.user.id !== user.id) {
        return ctx.unauthorized("No autorizado para descargar este reporte");
      }

      if (report.state !== 'completado') {
        return ctx.badRequest("El reporte aún no está listo");
      }

      const reportData = await strapi.service('api::report.report').formatReport(
        report.information,
        report.format
      );

      ctx.set('Content-Disposition', `attachment; filename=report-${id}.${report.format}`);
      
      switch (report.format) {
        case 'pdf':
          ctx.type = 'application/pdf';
          break;
        case 'excel':
          ctx.type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          break;
        default:
          ctx.type = 'application/json';
      }

      return reportData;
    } catch (error) {
      return ctx.badRequest(error.message || "Error al descargar reporte");
    }
  },
  
  async delete(ctx) {
    try {
      const user = ctx.state.user;
      if (!user) return ctx.unauthorized("No autorizado");

      const userWithRole = await strapi.entityService.findOne(
        'plugin::users-permissions.user',
        user.id,
        { populate: ['role'] }
      );

      if (userWithRole?.role?.type !== 'admin') {
        return ctx.unauthorized("Solo administradores pueden eliminar reportes");
      }

      const { id } = ctx.params;
      const report = await strapi.entityService.findOne('api::report.report', id, {
        populate: ['user']
      });

      if (!report || report.user.id !== user.id) {
        return ctx.unauthorized("No autorizado para eliminar este reporte");
      }

      const deletedReport = await strapi.entityService.delete('api::report.report', id);
      return { data: deletedReport };
    } catch (error) {
      return ctx.badRequest(error.message || "Error al eliminar reporte");
    }
  }
}));