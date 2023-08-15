export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EMAIL_SERVER_HOST: string;
      EMAIL_SERVER_PORT: string;
    }
  }
}
