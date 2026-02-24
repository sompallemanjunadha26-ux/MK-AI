import Usage from "../models/Usage";

const DAILY_LIMIT = 16000;

export const updateUsage = async (userId: string, tokens: number) => {
  let usage = await Usage.findOne({ user: userId });

  if (!usage) {
    usage = await Usage.create({ user: userId });
  }

  const today = new Date();
  const last = new Date(usage.lastReset);

  // Daily reset check
  if (today.toDateString() !== last.toDateString()) {
    usage.dailyTokens = 0;
    usage.lastReset = today;
  }

  if (usage.dailyTokens + tokens > DAILY_LIMIT) {
    throw new Error("Daily token limit exceeded");
  }

  usage.dailyTokens += tokens;
  usage.monthlyTokens += tokens;

  await usage.save();

  return {
    dailyUsed: usage.dailyTokens,
    remaining: DAILY_LIMIT - usage.dailyTokens,
    monthlyUsed: usage.monthlyTokens
  };
};

export const getUsageStats = async (userId: string) => {
  const usage = await Usage.findOne({ user: userId });

  if (!usage) {
    return {
      dailyUsed: 0,
      remaining: DAILY_LIMIT,
      monthlyUsed: 0,
      limit: DAILY_LIMIT
    };
  }

  return {
    dailyUsed: usage.dailyTokens,
    remaining: DAILY_LIMIT - usage.dailyTokens,
    monthlyUsed: usage.monthlyTokens,
    limit: DAILY_LIMIT
  };
};