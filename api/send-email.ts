import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';

const router = express.Router();

// CORS beállítások
const corsOptions = {
  origin: function(origin: any, callback: any) {
    const allowedOrigins = ['https://www.vizitor.hu', 'https://vizitor.hu', 'http://localhost:5173'];
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy violation'));
    }
  },
  methods: ['POST', 'OPTIONS'],
  credentials: true,
  optionsSuccessStatus: 200
};

router.use(cors(corsOptions));
router.use(express.json());

// Input validáció
const validateInput = (data: any) => {
  const errors: string[] = [];
  
  if (!data.name?.trim()) errors.push('A név megadása kötelező');
  if (!data.email?.trim()) errors.push('Az email cím megadása kötelező');
  if (!data.subject?.trim()) errors.push('A tárgy megadása kötelező');
  if (!data.message?.trim()) errors.push('Az üzenet megadása kötelező');
  
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Érvénytelen email cím formátum');
  }
  
  if (errors.length > 0) {
    throw new Error(errors.join(', '));
  }
};

router.post('/send-email', async (req, res) => {
  try {
    // Input validáció
    const { name, email, phone, subject, message } = req.body;
    validateInput({ name, email, subject, message });

    if (!process.env.SMTP_PASSWORD) {
      throw new Error('SMTP konfiguráció hiányzik');
    }

    // Email tartalom összeállítása
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ff5c35;">Új üzenet érkezett a weboldalról</h2>
        <div style="background-color: #f8f8f8; padding: 20px; border-radius: 5px;">
          <p><strong>Név:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Telefon:</strong> ${phone || 'Nem megadott'}</p>
          <p><strong>Tárgy:</strong> ${subject}</p>
          <hr style="border: 1px solid #eee;">
          <p><strong>Üzenet:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      </div>
    `;

    // SMTP Transporter létrehozása
    const transporter = nodemailer.createTransport({
      host: 'smtp.mailersend.net',
      port: 587,
      secure: false,
      auth: {
        user: 'MS_pmVEtl@vizitor.hu',
        pass: process.env.SMTP_PASSWORD
      },
      logger: true,
      debug: true
    });

    // Email küldése
    const info = await transporter.sendMail({
      from: 'info@vizitor.hu',
      to: 'info@vizitor.hu',
      subject: `Új kapcsolatfelvétel: ${subject}`,
      html: emailContent,
    });

    console.log('Email sent:', info.messageId);

    res.json({ 
      success: true,
      message: 'Email sikeresen elküldve'
    });
  } catch (error: any) {
    console.error('Email küldési hiba:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Hiba történt az üzenet küldése közben'
    });
  }
});

export default router; 