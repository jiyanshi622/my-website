import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import { URLSearchParams } from "url";
import fetch from "node-fetch"; // required since you're using fetch in Node
dotenv.config({ path: ".env" });

// Verify required environment variables are set
if (!process.env.PRESENTATION_URL) {
    console.warn("WARNING: PRESENTATION_URL not set in .env file. Using default presentation.");
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true }));
app.use(express.static("."));

const ownerEmail = process.env.OWNER_EMAIL || "jiyanshi622@gmail.com";
if (!process.env.OWNER_EMAIL) {
    console.info("OWNER_EMAIL not set; using default: jiyanshi622@gmail.com");
}

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: process.env.SMTP_USER && process.env.SMTP_PASS
        ? {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
          }
        : undefined,
});

const emailConfigured = Boolean(process.env.SMTP_HOST);

// Optional Google Forms forwarding (set env vars to enable)
const GOOGLE_FORM_ACTION = process.env.GOOGLE_FORM_ACTION || "";
const GOOGLE_FORM_VIEW_URL = process.env.GOOGLE_FORM_VIEW_URL || "";
const GOOGLE_ENTRY_NAME = process.env.GOOGLE_ENTRY_NAME || "";
const GOOGLE_ENTRY_EMAIL = process.env.GOOGLE_ENTRY_EMAIL || "";
const GOOGLE_ENTRY_MESSAGE = process.env.GOOGLE_ENTRY_MESSAGE || "";
const GOOGLE_ENTRY_PHONE = process.env.GOOGLE_ENTRY_PHONE || "";
const GOOGLE_ENTRY_LINKEDIN = process.env.GOOGLE_ENTRY_LINKEDIN || "";

function deriveGoogleFormAction(viewUrl) {
    try {
        if (!viewUrl) return "";
        const u = new URL(viewUrl);
        u.search = "";
        u.pathname = u.pathname.replace("/viewform", "/formResponse");
        return u.toString();
    } catch {
        return "";
    }
}

async function forwardToGoogleForm({ name, email, message, phone = "", linkedin = "" }) {
    try {
        const action = GOOGLE_FORM_ACTION || deriveGoogleFormAction(GOOGLE_FORM_VIEW_URL);
        if (!action || !GOOGLE_ENTRY_NAME || !GOOGLE_ENTRY_EMAIL) {
            return false;
        }
        const formData = new URLSearchParams();
        formData.append(GOOGLE_ENTRY_NAME, name);
        formData.append(GOOGLE_ENTRY_EMAIL, email);
        if (GOOGLE_ENTRY_MESSAGE && message) formData.append(GOOGLE_ENTRY_MESSAGE, message);
        if (GOOGLE_ENTRY_PHONE && phone) formData.append(GOOGLE_ENTRY_PHONE, phone);
        if (GOOGLE_ENTRY_LINKEDIN && linkedin) formData.append(GOOGLE_ENTRY_LINKEDIN, linkedin);

        const res = await fetch(action, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
            body: formData.toString(),
        });
        return res.ok || res.status === 302;
    } catch (err) {
        console.error("Google Form forward error", err);
        return false;
    }
}

app.post("/api/subscribe", async (req, res) => {
    try {
        const { email } = req.body;
        if (!email || String(email).trim().length === 0) {
            return res.status(400).json({ ok: false, error: "Email is required" });
        }
        await transporter.sendMail({
            from: process.env.MAIL_FROM || process.env.SMTP_USER,
            to: ownerEmail,
            subject: `New newsletter subscription`,
            text: `A new user subscribed with email: ${email}`,
            html: `<p>A new user subscribed with email: <b>${email}</b></p>`,
        });
        return res.json({ ok: true });
    } catch (err) {
        console.error("Subscribe error", err);
        return res.status(500).json({ ok: false, error: "Failed to send email" });
    }
});

app.post("/api/contact", async (req, res) => {
    try {
        const { name, email, message, phone = "", linkedin = "" } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ ok: false, error: "All fields are required" });
        }
        let emailOk = false;
        let formOk = false;
        let attemptedAny = false;

        if (emailConfigured) {
            attemptedAny = true;
            try {
                await transporter.sendMail({
                    from: process.env.MAIL_FROM || process.env.SMTP_USER,
                    to: ownerEmail,
                    subject: `New contact from ${name}`,
                    text: `From: ${name} <${email}>
Phone: ${phone}
LinkedIn: ${linkedin}
Message:
${message}`,
                    html: `<p><b>From:</b> ${name} &lt;${email}&gt;</p>${
                        phone ? `<p><b>Phone:</b> ${phone}</p>` : ""
                    }${linkedin ? `<p><b>LinkedIn:</b> ${linkedin}</p>` : ""}<p>${message.replace(
                        /\n/g,
                        "<br>"
                    )}</p>`,
                });
                emailOk = true;
            } catch (err) {
                console.error("Email send error", err);
            }
        }

        if (GOOGLE_FORM_ACTION || GOOGLE_FORM_VIEW_URL) {
            attemptedAny = true;
            try {
                formOk = await forwardToGoogleForm({ name, email, message, phone, linkedin });
            } catch (err) {
                console.error("Form forward error", err);
            }
        }

        if (!attemptedAny) {
            return res
                .status(500)
                .json({ ok: false, error: "No delivery channel configured. Set SMTP_* or GOOGLE_* env variables." });
        }
        if (!emailOk && !formOk) {
            return res.status(500).json({ ok: false, error: "Failed to send via all configured channels" });
        }
        return res.json({ ok: true, emailOk, formOk });
    } catch (err) {
        console.error("Contact error", err);
        return res.status(500).json({ ok: false, error: "Failed to send message" });
    }
});

// Serve presentations
const DEFAULT_PRESENTATION_URL =
    "https://docs.google.com/presentation/d/1FaQA7n7TihTBHE3ge_MFC9lJ7nFBuDeR6Al4ZVeqcF4/edit?usp=sharing";
function toSlidesPreview(url) {
    try {
        const u = new URL(url);
        u.pathname = u.pathname.replace(/\/edit.*$/, "/preview");
        return u.toString();
    } catch {
        return url;
    }
}
const PRESENTATION_URL = process.env.PRESENTATION_URL || DEFAULT_PRESENTATION_URL;
app.get("/presentations", (req, res) => {
    if (PRESENTATION_URL) {
        return res.redirect(toSlidesPreview(PRESENTATION_URL));
    }
    const localPath = process.env.PRESENTATION_FILE || "";
    if (localPath) {
        return res.sendFile(localPath, { root: process.cwd() }, (err) => {
            if (err) res.status(404).send("Presentation not found");
        });
    }
    return res.status(404).send("Presentation is not configured");
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
