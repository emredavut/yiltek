const Contact = require("../models/contactModel");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Gmail konfigürasyonu - .env dosyasından okuyarak
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
const submitContact = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      subject,
      message,
      product,
      isQuote,
      companyName,
    } = req.body;

    // Veritabanına kaydet
    const contact = await Contact.create({
      name,
      email,
      phone,
      subject,
      message,
      product,
      isQuote: isQuote || false,
    });

    if (contact) {
      // Form verisi veritabanına kaydedildikten sonra e-posta göndermeyi dene
      try {
        // Daha zengin içerikli HTML
        const htmlContent = `
        <!DOCTYPE html>
        <html lang="tr">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Yeni İletişim Formu Mesajı</title>
        </head>
        <body style="font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
          <div style="border: 1px solid #e0e0e0; border-radius: 5px; background-color: #ffffff; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div style="background-color: #004d99; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
              <h2 style="margin: 0; font-size: 24px;">Yeni İletişim Formu Mesajı</h2>
            </div>
            <div style="padding: 30px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; width: 40%;">İsim Soyisim:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${name}</td>
                </tr>
                ${
                  companyName
                    ? `
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Firma Adı:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${companyName}</td>
                </tr>`
                    : ""
                }
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">E-posta:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><a href="mailto:${email}" style="color: #004d99; text-decoration: none;">${email}</a></td>
                </tr>
                ${
                  phone
                    ? `
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Telefon:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><a href="tel:${phone}" style="color: #004d99; text-decoration: none;">${phone}</a></td>
                </tr>`
                    : ""
                }
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Konu:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${subject}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Mesaj:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${message.replace(
                    /\n/g,
                    "<br>"
                  )}</td>
                </tr>
                ${
                  product
                    ? `
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">İlgilenilen Ürün:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${product}</td>
                </tr>`
                    : ""
                }
                ${
                  isQuote
                    ? `
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Teklif İsteği:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;">Evet</td>
                </tr>`
                    : ""
                }
              </table>
              
              <div style="margin-top: 30px; padding: 15px; background-color: #f5f5f5; border-radius: 5px; border-left: 4px solid #004d99;">
                <p style="margin: 0; font-size: 14px;"><strong>Not:</strong> Bu mesaj web sitesi iletişim formundan doğrudan gönderilmiştir. Lütfen yanıtlamak için "Yanıtla" (Reply) düğmesini kullanın.</p>
              </div>
            </div>
            <div style="text-align: center; font-size: 12px; color: #777; margin-top: 20px; padding: 20px; background-color: #f5f5f5; border-radius: 0 0 5px 5px; border-top: 1px solid #eee;">
              <p>Bu e-posta Yiltek web sitesi iletişim formundan otomatik olarak gönderilmiştir.</p>
              <p>&copy; ${new Date().getFullYear()} Yiltek. Tüm hakları saklıdır.</p>
              <p style="margin-top: 15px; font-size: 11px; color: #999;">Gönderim tarihi: ${new Date().toLocaleString(
                "tr-TR",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )}</p>
            </div>
          </div>
        </body>
        </html>
        `;

        // Simple text version (for clients that don't support HTML)
        const textContent = `
Yeni İletişim Formu Mesajı

İsim Soyisim: ${name}
${companyName ? `Firma Adı: ${companyName}\n` : ""}
E-posta: ${email}
${phone ? `Telefon: ${phone}\n` : ""}
Konu: ${subject}
Mesaj: ${message}
${product ? `İlgilenilen Ürün: ${product}\n` : ""}
${isQuote ? `Teklif İsteği: Evet\n` : ""}

Bu e-posta Yiltek web sitesi iletişim formundan otomatik olarak gönderilmiştir.
© ${new Date().getFullYear()} Yiltek. Tüm hakları saklıdır.

Gönderim tarihi: ${new Date().toLocaleString("tr-TR")}
        `;

        // E-posta ayarları - spam'e düşmemesi için ek başlıklar
        let mailOptions = {
          from: {
            name: "Yiltek İletişim Formu",
            address: process.env.EMAIL_USER,
          },
          to: process.env.EMAIL_RECIPIENT,
          replyTo: email, // Gönderen kişinin e-posta adresi
          subject: `Yeni İletişim Formu: ${subject}`,
          text: textContent, // Plain text version
          html: htmlContent, // HTML version
          headers: {
            "X-Priority": "1", // High priority
            "X-MSMail-Priority": "High",
            Importance: "High",
            "X-Contact-Form": "Yiltek Website",
          },
        };

        // E-posta gönder
        await transporter.sendMail(mailOptions);
        console.log("E-posta başarıyla gönderildi");
      } catch (emailErr) {
        console.error("E-posta gönderimi hatası:", emailErr);
      }

      // Her durumda başarılı yanıt
      res.status(201).json({ message: "Contact form submitted successfully" });
    } else {
      res.status(400).json({ message: "Invalid contact data" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all contact submissions
// @route   GET /api/contact
// @access  Private/Admin
const getContacts = async (req, res) => {
  try {
    const pageSize = 20;
    const page = Number(req.query.page) || 1;
    const isQuote = req.query.quote === "true" ? { isQuote: true } : {};
    const isRead =
      req.query.read === "true"
        ? { isRead: true }
        : req.query.read === "false"
        ? { isRead: false }
        : {};

    const count = await Contact.countDocuments({ ...isQuote, ...isRead });
    const contacts = await Contact.find({ ...isQuote, ...isRead })
      .populate("product", "name slug")
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      contacts,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get contact by ID
// @route   GET /api/contact/:id
// @access  Private/Admin
const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id).populate(
      "product",
      "name slug"
    );

    if (contact) {
      res.json(contact);
    } else {
      res.status(404).json({ message: "Contact not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update contact read status
// @route   PUT /api/contact/:id
// @access  Private/Admin
const updateContactReadStatus = async (req, res) => {
  try {
    const { isRead } = req.body;

    const contact = await Contact.findById(req.params.id);

    if (contact) {
      contact.isRead = isRead !== undefined ? isRead : contact.isRead;

      const updatedContact = await contact.save();
      res.json(updatedContact);
    } else {
      res.status(404).json({ message: "Contact not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete a contact
// @route   DELETE /api/contact/:id
// @access  Private/Admin
const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (contact) {
      await contact.deleteOne();
      res.json({ message: "Contact removed" });
    } else {
      res.status(404).json({ message: "Contact not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  submitContact,
  getContacts,
  getContactById,
  updateContactReadStatus,
  deleteContact,
};
