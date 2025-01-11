"use strict";


import { factories } from '@strapi/strapi';
import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';

const { createCoreService } = require("@strapi/strapi").factories;

interface ProductVendido {
    nombre: string;
    cantidad: number;
    total: number;
  }
  
interface ProductoVisto {
    nombre: string;
    vistas: number;
    agregadosCarrito: number;
    }

module.exports = createCoreService("api::report.report", ({ strapi }) => ({
    async addToQueue(report) {
        const { reportQueue } = strapi.config.get('queue');
        await reportQueue.add('generate-report', {
        reportId: report.id,
        type: report.type,
        dataRange: report.dataRange,
        filters: report.filters
        });
    },

    async formatReport(data, format) {
        switch (format) {
          case 'pdf':
            return this.generatePDF(data);
          case 'excel':
            return this.generateExcel(data);
          default:
            return JSON.stringify(data);
        }
      },

    async generatePDF(data) {
    return new Promise((resolve) => {
        const PDFDocument = require('pdfkit');
        const doc = new PDFDocument();
        const chunks = [];

        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));

        doc.fontSize(20).text('Reporte', { align: 'center' });
        
        if (data.resumen?.totalVentas) {
        doc.fontSize(14).text(`Total Ventas: $${data.resumen.totalVentas}`);
        }

        doc.end();
    });
    },

    async generateExcel(data) {
        const ExcelJS = require('exceljs');
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Reporte');
    
        if (data.resumen?.totalVentas) {
          worksheet.columns = [
            { header: 'Fecha', key: 'fecha' },
            { header: 'Total', key: 'total' },
            { header: 'Órdenes', key: 'ordenes' }
          ];
        }
    
        return await workbook.xlsx.writeBuffer();
      },

      async generateSalesReport(dataRange, filters) {
        const { startDate, endDate } = dataRange;
        
        const orders = await strapi.db.query('api::order.order').findMany({
          where: {
            createdAt: {
              $gte: new Date(startDate),
              $lte: new Date(endDate)
            },
            state: 'completado'
          },
          populate: ['items.product', 'user']
        });
    
        const ventasPorDia = {};
        let totalVentas = 0;
        const productosMasVendidos = {};
    
        orders.forEach(order => {
          const fecha = order.createdAt.toISOString().split('T')[0];
          if (!ventasPorDia[fecha]) {
            ventasPorDia[fecha] = { total: 0, ordenes: 0 };
          }
          ventasPorDia[fecha].total += order.total;
          ventasPorDia[fecha].ordenes++;
          totalVentas += order.total;
    
          order.items.forEach(item => {
            const productId = item.product.id;
            if (!productosMasVendidos[productId]) {
              productosMasVendidos[productId] = {
                nombre: item.product.productName,
                cantidad: 0,
                total: 0
              };
            }
            productosMasVendidos[productId].cantidad += item.quantity;
            productosMasVendidos[productId].total += item.quantity * item.product.price;
          });
        });
    
        return {
          periodo: {
            inicio: startDate,
            fin: endDate
          },
          resumen: {
            totalVentas,
            numeroOrdenes: orders.length,
            promedioOrden: orders.length > 0 ? totalVentas / orders.length : 0
          },
          ventasPorDia,
          productosMasVendidos: Object.entries(productosMasVendidos)
            .sort(([,a], [,b]) => (b as ProductVendido).cantidad - (a as ProductVendido).cantidad)
            .map(([,producto]) => producto)
            .slice(0, 10)
        };
      },

  async generateInventoryReport(dataRange) {
    const products = await strapi.db.query('api::product.product').findMany({
      populate: ['category']
    });

    const categorias = {};
    const productosBajoStock = [];
    let valorTotal = 0;

    products.forEach(product => {
      const categoria = product.category?.name || 'Sin categoría';
      if (!categorias[categoria]) {
        categorias[categoria] = {
          cantidad: 0,
          valorTotal: 0
        };
      }

      const valorProducto = product.price * product.stock;
      categorias[categoria].cantidad++;
      categorias[categoria].valorTotal += valorProducto;
      valorTotal += valorProducto;

      if (product.stock < 10) {
        productosBajoStock.push({
          id: product.id,
          nombre: product.productName,
          stock: product.stock,
          categoria
        });
      }
    });

    return {
      resumen: {
        totalProductos: products.length,
        valorInventario: valorTotal,
        categorias
      },
      productosBajoStock,
      detalleProductos: products.map(p => ({
        id: p.id,
        nombre: p.productName,
        stock: p.stock,
        precio: p.price,
        categoria: p.category?.name || 'Sin categoría'
      }))
    };
  },

  async generateBehaviorReport(dataRange) {
    const { startDate, endDate } = dataRange;

    const actions = await strapi.db.query('api::user-action.user-action').findMany({
      where: {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      },
      populate: ['user', 'product']
    });

    const userActions = {};
    const productViews: { [key: string]: ProductoVisto } = {};
    let totalVisitas = 0;

    actions.forEach(action => {
      if (!userActions[action.type]) {
        userActions[action.type] = 0;
      }
      userActions[action.type]++;

      if (action.type === 'view_product' && action.product) {
        if (!productViews[action.product.id]) {
          productViews[action.product.id] = {
            nombre: action.product.productName,
            vistas: 0,
            agregadosCarrito: 0
          };
        }
        productViews[action.product.id].vistas++;
        totalVisitas++;
      }
    });

    return {
      periodo: {
        inicio: startDate,
        fin: endDate
      },
      resumen: {
        totalAcciones: actions.length,
        totalVisitas,
        accionesPorTipo: userActions
      },
      productosMasVistos: Object.entries(productViews)
        .sort(([,a], [,b]) => (b as ProductoVisto).vistas - (a as ProductoVisto).vistas)
        .map(([,producto]) => producto)
        .slice(0, 10)
    };
  }
}));