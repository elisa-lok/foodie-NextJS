import nodemailer from 'nodemailer';

export const sendActivationEmail = async (email, activationLink) => {
    
    const transporter = nodemailer.createTransport({
      host: 'smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });

    const mailOptions = {
      from: 'no-reply@example.com',
      to: email,
      subject: 'Activate Your Account',
      html: `
        <p>Please click the link below to activate your account:</p>
        <a href="${activationLink}">Activate Account</a>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('Activation email sent successfully.');
    } catch (error) {
      console.error('Error sending activation email:', error);
      throw new Error('Email could not be sent.');
    }
}