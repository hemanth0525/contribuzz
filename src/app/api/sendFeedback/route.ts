// app/api/sendFeedback/route.ts

import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const { email, feedback } = await req.json();

  try {
    // Create a transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true", // true for 465, false for 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: `"Contri.buzz Feedback" <${process.env.SMTP_USER}>`,
      to: "mail@contri.buzz",
      subject: "New Feedback Submission",
      text: `Email: ${email}\n\nFeedback: ${feedback}`,
      html: `<p><strong>Email:</strong> ${email}</p><p><strong>Feedback:</strong> ${feedback}</p>`,
    });

    console.log("Message sent: %s", info.messageId);
    return new Response(
      JSON.stringify({ message: "Feedback sent successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending feedback:", error);
    return new Response(
      JSON.stringify({ message: "An error occurred. Please try again." }),
      { status: 500 }
    );
  }
}
