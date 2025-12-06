declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_API_URL?: string;
      NODE_ENV: 'development' | 'production';
    }
  }
}

// eslint-disable-next-line prettier/prettier
export { };

