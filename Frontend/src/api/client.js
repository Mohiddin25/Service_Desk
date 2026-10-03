// Unified Client Interface for ServiceDesk Pro Frontend
import { authApi } from './authApi';
import { ticketApi } from './ticketApi';
import { assetApi } from './assetApi';
import { knowledgeApi } from './knowledgeApi';
import { aiApi } from './aiApi';
import { notificationApi } from './notificationApi';
import { userApi } from './userApi';

export const api = {
  auth: authApi,
  tickets: ticketApi,
  assets: assetApi,
  knowledge: knowledgeApi,
  ai: aiApi,
  notifications: notificationApi,
  users: userApi
};

export {
  authApi,
  ticketApi,
  assetApi,
  knowledgeApi,
  aiApi,
  notificationApi,
  userApi
};
