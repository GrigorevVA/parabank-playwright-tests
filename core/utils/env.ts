import 'dotenv/config';

export const ENV = {
  PARABANK_URL: process.env.PARABANK_URL ?? 'http://localhost:8080/parabank',
} as const;
