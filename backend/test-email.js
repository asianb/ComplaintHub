const nodemailer = require('nodemailer');
require('dotenv').config();

async function testEmail() {
  console.log('📧 Testing email...');
  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set ✓' : 'Missing ✗');

  // תקן כאן - createTransport לא createTransporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  try {
    console.log('🔄 Sending email...');
    
    const result = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: '✅ בדיקה - מערכת תלונות עובדת!',
      text: 'אם את רואה את המייל הזה - הכל עובד מושלם! 🎉',
      html: `
        <div style="direction: rtl; font-family: Arial;">
          <h2 style="color: #4CAF50;">✅ בדיקת מייל מוצלחת!</h2>
          <p>המערכת שולחת מיילים בהצלחה!</p>
          <p>⏰ <strong>זמן:</strong> ${new Date().toLocaleString('he-IL')}</p>
        </div>
      `
    });
    
    console.log('✅ Email sent successfully!');
    console.log('📧 Message ID:', result.messageId);
    console.log('📫 Check your email inbox!');
  } catch (error) {
    console.error('❌ Email failed:', error.message);
    
    if (error.message.includes('Invalid login')) {
      console.log('🔑 Fix: Check your EMAIL_USER and EMAIL_PASS in .env file');
      console.log('💡 Make sure you use App Password, not regular password');
    }
  }
}

testEmail();