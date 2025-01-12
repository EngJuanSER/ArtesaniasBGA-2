// src/processors/email.processor.ts
"use strict";

const nodemailer = require('nodemailer');
const { emailQueue } = require('../../config/queue');

module.exports = () => {
  // Configurar transporte de email
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  // Procesar emails en cola
  emailQueue.process('send-email', async (job) => {
    const { to, subject, html, attachments } = job.data;

    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to,
        subject,
        html,
        attachments
      });

      return { success: true, to, subject };
    } catch (error) {
      strapi.log.error('Error sending email:', error);
      throw error;
    }
  });

  // Manejar eventos de la cola de emails
  emailQueue.on('completed', (job) => {
    strapi.log.info('Email sent successfully:', {
      jobId: job.id,
      to: job.data.to,
      subject: job.data.subject
    });
  });

  emailQueue.on('failed', (job, error) => {
    strapi.log.error('Failed to send email:', {
      jobId: job.id,
      to: job.data.to,
      subject: job.data.subject,
      error: error.message
    });
  });
};