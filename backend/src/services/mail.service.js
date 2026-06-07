import nodemailer from "nodemailer";

const requiredMailEnv = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS"];

export const isMailConfigured = () =>
  requiredMailEnv.every((key) => Boolean(process.env[key]));

const createTransporter = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

const formatReservationDate = (date) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(new Date(date));

export const sendReservationStatusEmail = async (reservation) => {
  if (!isMailConfigured()) {
    console.warn("Email not sent: SMTP settings are missing in .env");
    return false;
  }

  const isApproved = reservation.status === "approved";
  const subject = isApproved
    ? "Your reservation has been approved"
    : "Your reservation has been cancelled";

  const statusMessage = isApproved
    ? "We are happy to confirm that your reservation has been approved."
    : "We are sorry, but your reservation request has been cancelled.";

  const transporter = createTransporter();
  const guestName = `${reservation.firstName} ${reservation.lastName}`;
  const restaurantName = process.env.RESTAURANT_NAME || "ZEESH";

  await transporter.sendMail({
    from: `"${restaurantName}" <${process.env.MAIL_FROM || process.env.SMTP_USER}>`,
    to: reservation.email,
    subject,
    text: `Hello ${guestName},

${statusMessage}

Reservation details:
Date: ${formatReservationDate(reservation.date)}
Time: ${reservation.time}
Status: ${reservation.status}

Thank you,
${restaurantName}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #172026; line-height: 1.6;">
        <h2>${subject}</h2>
        <p>Hello ${guestName},</p>
        <p>${statusMessage}</p>
        <div style="border: 1px solid #dce2e6; border-radius: 8px; padding: 16px; margin: 18px 0;">
          <p><strong>Date:</strong> ${formatReservationDate(reservation.date)}</p>
          <p><strong>Time:</strong> ${reservation.time}</p>
          <p><strong>Status:</strong> ${reservation.status}</p>
        </div>
        <p>Thank you,<br />${restaurantName}</p>
      </div>
    `
  });

  return true;
};
