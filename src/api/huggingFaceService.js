/**
 * huggingFaceService.js
 * Open-source model integration via Hugging Face Inference API.
 *
 * Model: mistralai/Mistral-7B-Instruct-v0.3
 * Uses VITE_HF_TOKEN if set; falls back to anonymous (rate-limited) access.
 */

import { HfInference } from '@huggingface/inference';

const HF_TOKEN = import.meta.env.VITE_HF_TOKEN || undefined;
const MODEL    = 'mistralai/Mistral-7B-Instruct-v0.3';

const hf = new HfInference(HF_TOKEN);

// Topic presets for the Quick Intel panel
export const QUICK_INTEL_TOPICS = [
  {
    id: 'site-rec',
    label: 'SITE RECOMMENDATION',
    prompt: (context = '') =>
      `You are GIA (Gamble Intelligence Agent), an elite iGaming analyst. ` +
      `Give a sharp, tactical recommendation for the best online poker site in 2026. ` +
      `Focus on welcome bonuses, software quality, and player protection. ` +
      `Be concise — 3 to 5 bullet points max. ${context}`,
  },
  {
    id: 'hand-analysis',
    label: 'HAND ANALYSIS',
    prompt: (context = '') =>
      `You are GIA (Gamble Intelligence Agent), a professional poker coach. ` +
      `Analyse a common Texas Hold'em scenario: hero holds A♠K♦ on a Q♣J♥2♠ flop, ` +
      `pot is 120BB and villain leads for 80BB. Provide a tactical breakdown. ` +
      `Max 5 bullet points. ${context}`,
  },
  {
    id: 'bankroll',
    label: 'BANKROLL INTEL',
    prompt: (context = '') =>
      `You are GIA (Gamble Intelligence Agent), a risk management expert. ` +
      `Give 5 concise, actionable bankroll management tips for online poker players ` +
      `playing micro-stakes to mid-stakes. Use bullet points. ${context}`,
  },
];

/**
 * Generate a Quick Intel response from the Mistral-7B model.
 * @param {string} systemPrompt - The full prompt for the model
 * @returns {Promise<string>} - Generated text
 */
export async function generateQuickIntel(systemPrompt) {
  try {
    const result = await hf.textGeneration({
      model: MODEL,
      inputs: `<s>[INST] ${systemPrompt} [/INST]`,
      parameters: {
        max_new_tokens:   400,
        temperature:      0.7,
        top_p:            0.9,
        repetition_penalty: 1.1,
        return_full_text: false,
      },
    });

    return result.generated_text?.trim() || 'No intel generated.';
  } catch (err) {
    // Surface a readable error to the UI
    if (err?.message?.includes('429') || err?.message?.includes('rate')) {
      throw new Error('HF_RATE_LIMIT');
    }
    if (err?.message?.includes('401') || err?.message?.includes('403')) {
      throw new Error('HF_AUTH');
    }
    throw new Error('HF_ERROR');
  }
}
