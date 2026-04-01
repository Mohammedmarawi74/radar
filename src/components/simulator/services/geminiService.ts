import { GoogleGenAI } from "@google/genai";
import { InvestmentInput, SimulationResult, MonteCarloStats } from "../types";

const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' && (process as any).env?.API_KEY) || "";
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const getInvestmentInsights = async (
  input: InvestmentInput,
  baseResult: SimulationResult,
  stressResult: SimulationResult,
  mcStats: MonteCarloStats
) => {
  if (!apiKey || !ai) {
    return "عذراً، مفتاح التحليل (API Key) غير مهيأ حالياً. يرجى مراجعة الإعدادات. 💡";
  }

  const prompt = `
    بصفتك مستشار استثمار ودود وخبير في تبسيط العلوم المالية للمبتدئين، حلل هذه البيانات وقدم تقريراً "بسيطاً جداً" باللغة العربية.
    
    البيانات:
    - رأس المال: ${input.capital}
    - الربح السنوي المتوقع: ${input.annualRevenue}
    - التكاليف: ${input.annualOpCost}
    
    النتائج:
    - صافي الربح الحقيقي (NPV): ${baseResult.npv}
    - قوة العائد (IRR): ${(baseResult.irr * 100).toFixed(2)}%
    - احتمالية الخسارة: ${mcStats.lossProbability.toFixed(1)}%

    المطلوب منك (بأسلوب مبسط جداً):
    1. هل هذا الاستثمار "فرصة ذهبية" أم "مخاطرة معقولة" أم "فخ"؟
    2. اشرح للشخص بلغة عامية مهذبة ماذا سيحدث لو ساءت الأمور (Stress Test).
    3. ما هي أول خطوة يجب أن يتخذها الآن؟
    4. استخدم الرموز التعبيرية (Emojis) لجعل التقرير ممتعاً.
    
    تجنب المصطلحات المعقدة مثل NPV أو IRR في الشرح، استبدلها بكلمات مثل "الربح الحقيقي" و "قوة نمو مالك".
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    return response.text || "لم يتم إنشاء تحليل.";
  } catch (error) {
    console.error("Error fetching Gemini insights:", error);
    return "عذراً، لم أستطع تحليل البيانات حالياً. تأكد من اتصالك بالإنترنت وحاول مرة أخرى! 😊";
  }
};
