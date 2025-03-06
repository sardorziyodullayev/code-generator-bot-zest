import 'dotenv/config';

interface MessageIdsI {
  start: number;
  nameRequest: number;
  codeFake: number;
  realProductCode: Record<number, { codeReal: number }>;
  expiresAt: number;
  codeNotRegistered: number;
  codeUsed: number;
  codeUsageLimit: number;
}
export const BOT_TOKEN = process.env.BOT_TOKEN as string;
export const channelId = -1001944618867;

export const messageIds: Record<'uz' | 'ru', MessageIdsI> = {
  uz: {
    start: 5,
    nameRequest: 24,
    realProductCode: {
      1: { codeReal: 40 }, // - uz code real (product: "ZEST 85R-550MF 12V 60AH (20 HR) 550A (CCA) 90 MIN (RC)")
      2: { codeReal: 41 }, // - uz code real (product: "ZEST 85-550MF 12V 60AH 550A (CCA) 90 MIN (RC)")
      3: { codeReal: 42 }, // - code real (product: "ZEST MF44B19R 12V 42AH 350A (EN)")
      4: { codeReal: 43 }, // - uz code real (product: " ZEST MF44B19L 12V 42AH 350A (EN)")
    },
    codeFake: 14, // - uz fake code
    expiresAt: 22,
    codeNotRegistered: 49,
    codeUsed: 31,
    codeUsageLimit: 51,
  },
  ru: {
    start: 16,
    nameRequest: 28,
    realProductCode: {
      1: { codeReal: 44 }, // - ru code real (product: "ZEST 85R-550MF 12V 60AH (20 HR) 550A (CCA) 90 MIN (RC)")
      2: { codeReal: 45 }, // - ru code real (product: "ZEST 85-550MF 12V 60AH 550A (CCA) 90 MIN (RC)")
      3: { codeReal: 46 }, // - ru code real (product: "ZEST MF44B19R 12V 42AH 350A (EN)")
      4: { codeReal: 47 }, // - ru code real (product: "ZEST MF44B19L 12V 42AH 350A (EN)")
    },
    codeFake: 22, // - uz fake code
    expiresAt: 22,
    codeNotRegistered: 50,
    codeUsed: 32,
    codeUsageLimit: 52,
  },
};
