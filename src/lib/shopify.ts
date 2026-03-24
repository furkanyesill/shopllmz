/* eslint-disable */
import '@shopify/shopify-api/adapters/node';
import { shopifyApi, ApiVersion } from '@shopify/shopify-api';
import { PrismaSessionStorage } from '@shopify/shopify-app-session-storage-prisma';
import { prisma } from './prisma';

const isProduction = process.env.NODE_ENV === 'production';
const apiKey = process.env.SHOPIFY_API_KEY || "dummy_api_key";
const apiSecretKey = process.env.SHOPIFY_API_SECRET || "dummy_secret_key";
const scopes = (process.env.SHOPIFY_SCOPES || "read_products,write_themes,read_themes").split(",");
const hostName = process.env.HOST_NAME || "https://dummy-shopllmz.ngrok.app";

export const shopify = shopifyApi({
  apiKey,
  apiSecretKey,
  scopes,
  hostName: hostName.replace(/^https?:\/\//, ''),
  hostScheme: 'https',
  apiVersion: (ApiVersion as any).January25 || '2025-01',
  isEmbeddedApp: true,
});

export const sessionStorage = new PrismaSessionStorage(prisma);
