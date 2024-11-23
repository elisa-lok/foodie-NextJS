import nodemailer from 'nodemailer';

export const sendActivationEmail = async (email, activationLink) => {
    const transporter = nodemailer.createTransport({
      host: 'smtp.qq.com',
      port: 465,
      auth: {
        user: process.env.MAILQQ_USER,
        pass: process.env.MAILQQ_PASS,
      },
    });

    const mailOptions = {
      from: `"No Reply - Level One Pizza" <${process.env.MAILQQ_USER}>`,
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
    }
}