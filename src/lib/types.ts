export type PlanId = "free" | "pro" | "business";
export type RoleId = "user" | "admin";

export type User = {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  plan: PlanId;
  role: RoleId;
  credits: number;
  emailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpiresAt?: string;
  passwordResetToken?: string;
  passwordResetExpiresAt?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  createdAt: string;
  updatedAt: string;
};

export type Session = {
  token: string;
  userId: string;
  expiresAt: string;
};

export type HistoryItem = {
  id: string;
  userId: string;
  generatorId: string;
  prompt: string;
  output: string;
  cost: number;
  demo: boolean;
  createdAt: string;
};

export type Database = {
  users: User[];
  sessions: Session[];
  history: HistoryItem[];
  plans?: PlanConfig[];
  stripeEvents?: string[];
};

export type PublicUser = {
  id: string;
  email: string;
  name: string;
  plan: PlanId;
  role: RoleId;
  credits: number;
  emailVerified: boolean;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  createdAt: string;
};

export type GenerateResult = {
  output: string;
  demo: boolean;
};

export type PlanConfig = {
  id: PlanId;
  name: string;
  price: number; // cents
  period: "month" | "forever";
  credits: number;
  features: string[];
  stripePriceId?: string;
};
