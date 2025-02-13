// // src/services/email.service.ts
// "use strict";
//
// const { createCoreService } = require("@strapi/strapi").factories;
//
// module.exports = createCoreService("api::email.email", ({ strapi }) => ({
//   async sendReportEmail(user, report) {
//     const { emailQueue } = strapi.config.get('queue');
//     
//     await emailQueue.add('send-email', {
//       to: user.email,
//       subject: `Reporte ${report.type} Generado`,
//       html: `
//         <h1>Tu reporte está listo</h1>
//         <p>El reporte de ${report.type} ha sido generado exitosamente.</p>
//         <p>Puedes descargarlo desde tu panel de administración.</p>
//       `
//     });
//   },
//
//   async sendProductInquiryEmail(adminEmail, inquiry) {
//     const { emailQueue } = strapi.config.get('queue');
//
//     await emailQueue.add('send-email', {
//       to: adminEmail,
//       subject: 'Nueva Consulta de Producto',
//       html: `
//         <h1>Nueva Consulta de Producto</h1>
//         <p>Usuario: ${inquiry.name} (${inquiry.email})</p>
//         <p>Producto: ${inquiry.referenceProduct}</p>
//         <p>Mensaje: ${inquiry.message}</p>
//         <p>Detalles adicionales:</p>
//         <ul>
//           <li>Color: ${inquiry.color || 'No especificado'}</li>
//           <li>Tamaño: ${inquiry.size || 'No especificado'}</li>
//           <li>Material: ${inquiry.material || 'No especificado'}</li>
//           <li>Cantidad: ${inquiry.quantity || 'No especificada'}</li>
//         </ul>
//       `
//     });
//   },
//
//   async sendLowStockAlert(adminEmail, product) {
//     const { emailQueue } = strapi.config.get('queue');
//
//     await emailQueue.add('send-email', {
//       to: adminEmail,
//       subject: 'Alerta de Stock Bajo',
//       html: `
//         <h1>Alerta: Stock Bajo</h1>
//         <p>El producto "${product.productName}" tiene stock bajo.</p>
//         <p>Stock actual: ${product.stock}</p>
//         <p>Por favor, actualiza el inventario pronto.</p>
//       `
//     });
//   }
// }));