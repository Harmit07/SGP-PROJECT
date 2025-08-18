import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import OpenAI from 'openai';

admin.initializeApp();
const db = admin.firestore();
const fcm = admin.messaging();

// Configure your OpenAI API Key in Firebase environment config:
// firebase functions:config:set openai.key="sk-..."
const openaiKey = process.env.OPENAI_API_KEY || (functions.config().openai?.key as string | undefined);
const openai = openaiKey ? new OpenAI({ apiKey: openaiKey }) : undefined;

export const aiAssistant = functions.https.onCall(async (data, context) => {
  const prompt = (data?.prompt as string | undefined)?.slice(0, 2000) ?? '';
  if (!prompt) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing prompt');
  }
  if (!openai) {
    return 'AI is not configured. Ask your admin to set OPENAI_API_KEY.';
  }
  const sys = 'You are a concise financial assistant. Offer practical budgeting, saving, and risk tips. Avoid legal/financial disclaimers beyond a short note. Keep answers under 120 words.';
  const chat = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: sys },
      { role: 'user', content: prompt },
    ],
    temperature: 0.4,
    max_tokens: 220,
  });
  const msg = chat.choices?.[0]?.message?.content ?? 'No answer available.';
  return msg;
});

export const notifyTransfer = functions.https.onCall(async (data, context) => {
  const toUid = data?.toUid as string | undefined;
  const amount = data?.amount as number | undefined;
  if (!toUid || !amount) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing toUid or amount');
  }
  const userDoc = await db.collection('users').doc(toUid).get();
  const token = userDoc.get('fcmToken');
  if (!token) return { ok: true, skipped: true };

  const payload: admin.messaging.MessagingPayload = {
    notification: {
      title: 'Money received',
      body: `You received $${amount.toFixed(2)}`,
    },
  } as any;

  await fcm.sendToDevice(token, payload);
  return { ok: true };
});