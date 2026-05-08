import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Initialize Supabase Admin with Service Role Key
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { action, userId, data } = await req.json();

    // 1. Verify if the requester is an admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(authHeader.replace("Bearer ", ""));
    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 2. Perform Administrative Actions
    switch (action) {
      case "updatePassword":
        const { error: pwdError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
          password: data.password
        });
        if (pwdError) throw pwdError;
        return NextResponse.json({ success: true });

      case "disable2FA":
        const { error: profileError } = await supabaseAdmin
          .from("profiles")
          .update({ totp_enabled: false, two_factor_enabled: false })
          .eq("id", userId);
        
        if (profileError) throw profileError;

        // Also remove factors from auth schema if using Supabase Auth MFA
        await supabaseAdmin.auth.admin.updateUserById(userId, {
            user_metadata: { ...user.user_metadata, mfa_enabled: false }
        });

        return NextResponse.json({ success: true });

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Admin API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
