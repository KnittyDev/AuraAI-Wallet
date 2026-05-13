import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import * as OTPAuth from "otpauth";
import QRCode from "qrcode";

// POST /api/auth/totp
// action: "setup" | "verify" | "disable" | "validate"
export async function POST(req: NextRequest) {
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const body = await req.json();
    const { action, user_id, token } = body;

    if (!user_id) {
      return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
    }

    // ── SETUP: Generate a new TOTP secret and return QR code ──
    if (action === "setup") {
      const secret = new OTPAuth.Secret({ size: 20 });

      const totp = new OTPAuth.TOTP({
        issuer: "Aura AI Terminal",
        label: body.email || "investor",
        algorithm: "SHA1",
        digits: 6,
        period: 30,
        secret: secret,
      });

      const uri = totp.toString();
      const qrDataUrl = await QRCode.toDataURL(uri, {
        width: 280,
        margin: 2,
        color: { dark: "#FFFFFF", light: "#00000000" },
      });

      // Store the secret temporarily (not yet enabled)
      await supabaseAdmin
        .from("profiles")
        .update({ totp_secret: secret.base32 })
        .eq("id", user_id);

      return NextResponse.json({
        qr: qrDataUrl,
        secret: secret.base32,
        uri,
      });
    }

    // ── VERIFY: Confirm setup by validating a code ──
    if (action === "verify") {
      if (!token) {
        return NextResponse.json({ error: "Missing token" }, { status: 400 });
      }

      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("totp_secret")
        .eq("id", user_id)
        .single();

      if (!profile?.totp_secret) {
        return NextResponse.json({ error: "No TOTP secret found. Run setup first." }, { status: 400 });
      }

      const totp = new OTPAuth.TOTP({
        issuer: "Aura AI Terminal",
        algorithm: "SHA1",
        digits: 6,
        period: 30,
        secret: OTPAuth.Secret.fromBase32(profile.totp_secret),
      });

      const delta = totp.validate({ token, window: 1 });

      if (delta === null) {
        return NextResponse.json({ error: "Invalid code. Please try again." }, { status: 401 });
      }

      // Enable 2FA
      await supabaseAdmin
        .from("profiles")
        .update({ totp_enabled: true })
        .eq("id", user_id);

      return NextResponse.json({ success: true, message: "Two-factor authentication enabled." });
    }

    // ── VALIDATE: Check TOTP during login ──
    if (action === "validate") {
      if (!token) {
        return NextResponse.json({ error: "Missing token" }, { status: 400 });
      }

      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("totp_secret, totp_enabled")
        .eq("id", user_id)
        .single();

      if (!profile?.totp_enabled || !profile?.totp_secret) {
        return NextResponse.json({ error: "2FA not enabled for this user." }, { status: 400 });
      }

      const totp = new OTPAuth.TOTP({
        issuer: "Aura AI Terminal",
        algorithm: "SHA1",
        digits: 6,
        period: 30,
        secret: OTPAuth.Secret.fromBase32(profile.totp_secret),
      });

      const delta = totp.validate({ token, window: 1 });

      if (delta === null) {
        return NextResponse.json({ valid: false, error: "Invalid or expired code." }, { status: 401 });
      }

      return NextResponse.json({ valid: true });
    }

    // ── DISABLE: Turn off 2FA ──
    if (action === "disable") {
      await supabaseAdmin
        .from("profiles")
        .update({ totp_enabled: false, totp_secret: null })
        .eq("id", user_id);

      return NextResponse.json({ success: true, message: "Two-factor authentication disabled." });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    console.error("TOTP Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
