const DEFAULT_REMOTE_API = 'http://91.147.104.165:666/api';

/**
 * Centralized API base resolver for both client and server usage.
 * Prefers explicit env, otherwise always points to the remote API.
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || DEFAULT_REMOTE_API;

export const getApiBaseUrl = () => API_BASE_URL;
