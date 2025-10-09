export default () => ({
    port: process.env.PORT,
    dbHost: process.env.DB_HOST,
    dbPort: process.env.DB_PORT,
    dbName: process.env.DB_NAME,
    dbUsername: process.env.DB_USERNAME,
    dbPassword: process.env.DB_PASSWORD,
    redisHost: process.env.REDIS_HOST,
    redisPort: process.env.REDIS_PORT,
    redisPassword: process.env.REDIS_PASSWORD,
    secretKey : process.env.PRIVATE_KEY,
    mailHost: process.env.MAIL_HOST,
    mailPort: process.env.MAIL_PORT,
    mailUser: process.env.MAIL_USER,
    mailPassword: process.env.MAIL_PASSWORD,
    mailFrom: process.env.MAIL_FROM,
    adminSecretKey: process.env.ADMIN_SECRET_KEY
    // googleClientId: process.env.GOOGLE_CLIENT_ID,
    // googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL,
    // flutterwavePublicKey: process.env.FLUTTERWAVE_PUBLIC_KEY,
    // flutterwaveSecretKey: process.env.FLUTTERWAVE_SECRET_KEY,
    // flutterwaveEncryptionKey: process.env.FLUTTERWAVE_ENCRYPTION_KEY,
    // flutterwaveBaseUrl: process.env.FLUTTERWAVE_BASE_URL
})


