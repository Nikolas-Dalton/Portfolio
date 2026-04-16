const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config({ path: __dirname + '/.env' });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post('/send', async (req, res) => {
  // ✅ Espera os campos enviados pelo frontend
  const { firstName, lastName, email, phone, message } = req.body;

  // Validação dos campos obrigatórios
  if (!firstName || !lastName || !email || !message) {
    return res.status(400).json({ error: 'Todos os campos obrigatórios.' });
  }

  // Validação simples de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Email inválido.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ✅ Monta o nome completo
    const fullName = `${firstName} ${lastName}`.trim();

    // ✅ Email formatado em HTML (mais bonito e profissional)
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `📬 Nova mensagem de ${fullName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <h2 style="color: #2D8659; border-bottom: 2px solid #2D8659; padding-bottom: 10px;">
            📬 Nova mensagem de seu portfólio
          </h2>
          
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>👤 Nome:</strong> ${fullName}</p>
            <p><strong>📧 Email:</strong> <a href="mailto:${email}" style="color: #2D8659;">${email}</a></p>
            <p><strong>📱 Telefone:</strong> ${phone || 'Não informado'}</p>
            <p><strong>💬 Mensagem:</strong></p>
            <div style="background: #fff; padding: 15px; border-radius: 4px; border-left: 4px solid #2D8659; white-space: pre-wrap;">
              ${message}
            </div>
          </div>
          
          <p style="color: #888; font-size: 12px; text-align: center;">
            Enviado através do formulário de contato do portfólio • ${new Date().toLocaleString('pt-BR')}
          </p>
        </div>
      `,
      replyTo: email,
    };

    await transporter.sendMail(mailOptions);
    
    console.log(`✅ Email enviado de ${email}`);
    res.status(200).json({ success: true });
    
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    res.status(500).json({ error: 'Erro interno ao enviar e-mail.' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
  console.log(`📧 Emails serão enviados para: ${process.env.EMAIL_USER}`);
});