import { GoogleGenAI } from "@google/genai";
import { GameType } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
你是一个名为“宿舍小助手”的AI，你是大学生宿舍里的全能管家。
你的语气要年轻、幽默、接地气（可以使用一些网络流行语，比如“破防了”、“yyds”等，但不要过度）。
你的主要职责是：
1. 建议值日安排或清洁计划。
2. 用高情商的方式调解舍友矛盾。
3. 主持宿舍小游戏（真心话大冒险、谁是卧底等）。
4. 对宿舍费用的分摊给出公平的建议。
请始终使用中文回复。
`;

export const getGeminiChatResponse = async (history: string[], userMessage: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history.map(h => ({ role: 'user', parts: [{ text: h }] })), 
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });
    
    return response.text || "抱歉，我好像断片了，稍后再试吧。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "哎呀，脑子卡壳了，检查一下API Key是不是欠费了？";
  }
};

export const generateGameContent = async (gameType: GameType): Promise<string> => {
  let prompt = "";
  if (gameType === GameType.TRUTH_DARE) {
    prompt = "生成一个适合大学生的'真心话'问题和一个'大冒险'挑战。格式请严格遵守：'真心话：[问题] | 大冒险：[挑战]'。内容要有趣但不要过分。";
  } else if (gameType === GameType.WHO_IS_SPY) {
    prompt = "为'谁是卧底'游戏生成两个相似但不同的词语（例如：牛奶 vs 酸奶）。返回格式：'平民词：[词语1]，卧底词：[词语2]'。";
  } else {
    prompt = "建议一个适合在宿舍里进行的5分钟快速集体小活动。";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "生成游戏失败了，尴尬。";
  } catch (error) {
    return "游戏生成出错了。";
  }
};