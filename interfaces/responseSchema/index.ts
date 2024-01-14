export * from "./pointNote";
export * from "./customer";
export * from "./merchant";
export * from "./rank";
export * from "./pendingImage";
export * from "./report";
export * from "./advertisement";
export * from "./notifications";
export * from "./groups";
export * from "./admin";
export * from "./auditlogs";
export * from "./avatar";
export * from "./permission";
export * from "./setting";
export * from "./socialIcon";
export * from "./me";
export * from "./export";

type responseSchema<T> = {
  next: string | null;
  previous: string | null;
  results: T[];
  count?: number;
};

export type { responseSchema };
