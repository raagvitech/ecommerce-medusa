import { loadEnv, defineConfig, Modules } from "@medusajs/framework/utils";


loadEnv(process.env.NODE_ENV!, process.cwd());

module.exports = defineConfig({
  admin: {
    disable: process.env.DISABLE_MEDUSA_ADMIN === "true",
    backendUrl: process.env.MEDUSA_BACKEND_URL,
  },
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    workerMode: process.env.MEDUSA_WORKER_MODE as "shared" | "worker" | "server",
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
    
  },
    plugins: [
    {
      resolve: '@rokmohar/medusa-plugin-meilisearch',
      options: {
        config: {
          host: 'https://ms-d9c51c8dd4c7-18859.lon.meilisearch.io',
          apiKey: '7c26f26e2051023bab033eb8c3bec8c56ac5e14e',
        },
        settings: {
          products: {
            indexSettings: {
              searchableAttributes: ['title', 'description', 'variant_sku'],
              displayedAttributes: ['id', 'title', 'description', 'variant_sku', 'thumbnail', 'handle'],
            },
            primaryKey: 'id',
          },
        },
      },
    },
  ],
  modules: [
   {
     resolve: '@medusajs/medusa/cache-redis',
     options: {
       redisUrl: process.env.REDIS_URL,
     },
   },
   {
     resolve: '@medusajs/medusa/event-bus-redis',
     options: {
       redisUrl: process.env.REDIS_URL,
     },
   },
   {
     resolve: '@medusajs/medusa/workflow-engine-redis',
     options: {
       redis: {
         url: process.env.REDIS_URL,
       },
     },
   },
   {
    resolve: './src/modules/variant-images-settings',
   },

   {
     resolve: "@medusajs/medusa/notification",
     options: {
       providers: [
         {
           resolve: "./src/modules/resend",
           id: "resend",
           options: {
             channels: ["email"],
             api_key: process.env.RESEND_API_KEY||"asdkfhaksdfadhfklajdhsflka",
             from: process.env.RESEND_FROM_EMAIL || "team@charandhul.com",
           },
         },
       ],
     },
   },

   {      resolve: "@medusajs/medusa/payment",
    options: {
      providers: [
        {
          resolve: "@sgftech/payment-razorpay",
          id: "razorpay",
          options: {
            key_id:
                process?.env?.RAZORPAY_TEST_KEY_ID ??
                process?.env?.RAZORPAY_ID,
            key_secret:
                process?.env?.RAZORPAY_TEST_KEY_SECRET ??
                process?.env?.RAZORPAY_SECRET,
            razorpay_account:
                process?.env?.RAZORPAY_TEST_ACCOUNT ??
                process?.env?.RAZORPAY_ACCOUNT,
            automatic_expiry_period: 30 /* any value between 12minuts and 30 days expressed in minutes*/,
            manual_expiry_period: 20,
            refund_speed: "normal",
            webhook_secret:
                process?.env?.RAZORPAY_TEST_WEBHOOK_SECRET ??
                process?.env?.RAZORPAY_WEBHOOK_SECRET
        }
        },
      ],
   } },

],

});
