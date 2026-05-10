import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, amount, asset, address, network, txId } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: 'Aura Wallet <onboarding@resend.dev>',
      to: email,
      subject: 'Withdrawal Initiated - Aura Wallet',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #03040a; color: #ffffff; padding: 40px; border-radius: 24px; border: 1px solid rgba(255,255,255,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #ffffff; font-size: 24px; margin: 0;">AURA WALLET</h1>
            <p style="color: rgba(255,255,255,0.5); font-size: 14px; margin-top: 5px;">Institutional-Grade Security</p>
          </div>
          
          <div style="background-color: rgba(255,255,255,0.02); padding: 30px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.05);">
            <h2 style="color: #ffffff; font-size: 20px; margin-top: 0;">Withdrawal Initiated</h2>
            <p style="color: rgba(255,255,255,0.6); line-height: 1.6;">Your request to withdraw assets from your Aura Wallet has been received and is currently being processed by our neural security engine.</p>
            
            <div style="margin-top: 25px; padding-top: 25px; border-top: 1px solid rgba(255,255,255,0.05);">
              <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span style="color: rgba(255,255,255,0.4); font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Amount</span>
                <span style="color: #ffffff; font-weight: bold;">${amount} ${asset}: </span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span style="color: rgba(255,255,255,0.4); font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Network</span>
                <span style="color: #ffffff;">${network}: </span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span style="color: rgba(255,255,255,0.4); font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Status</span>
                <span style="color: #38bdf8; font-weight: bold;">Processing</span>
              </div>
            </div>
            
            <div style="margin-top: 25px; padding: 15px; background-color: rgba(255,255,255,0.03); border-radius: 12px; word-break: break-all;">
              <p style="color: rgba(255,255,255,0.3); font-size: 10px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; margin-top: 0;">Destination Address</p>
              <code style="color: rgba(255,255,255,0.7); font-family: monospace; font-size: 12px;">${address}: </code>
            </div>

            <div style="margin-top: 15px; padding: 15px; background-color: rgba(255,255,255,0.03); border-radius: 12px; word-break: break-all;">
              <p style="color: rgba(255,255,255,0.3); font-size: 10px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; margin-top: 0;">Reference ID</p>
              <code style="color: rgba(255,255,255,0.7); font-family: monospace; font-size: 12px;">${txId}: </code>
            </div>
          </div>
          
          <div style="margin-top: 30px; text-align: center;">
            <p style="color: rgba(255,255,255,0.3); font-size: 12px;">If you did not authorize this withdrawal, please contact our emergency support immediately via the Support Center in your dashboard.</p>
            <div style="margin-top: 20px; color: rgba(255,255,255,0.2); font-size: 10px;">
              © 2026 Aura AI Wallet. All rights reserved.
            </div>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('API error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
