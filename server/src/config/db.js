const mongoose = require('mongoose');

const connectDB = async (uri = process.env.MONGO_URI) => {
  if (!uri) {
    throw new Error('MONGO_URI is not defined in environment variables.');
  }

  // Enforce sanitizeFilter to avoid query selector injection
  mongoose.set('sanitizeFilter', true);

  const isProduction = process.env.NODE_ENV === 'production';
  const options = {
    autoIndex: true,
    serverSelectionTimeoutMS: 4000,
    ...(isProduction ? { tls: true, tlsAllowInvalidCertificates: false } : {}),
  };

  try {
    const conn = await mongoose.connect(uri, options);
    return conn;
  } catch (err) {
    // If Atlas connection fails (e.g. IP whitelist / timeout) in non-production,
    // seamlessly fallback to local MongoDB so local development is never disrupted
    if (!isProduction && uri.startsWith('mongodb+srv://')) {
      console.warn(`\n[Database Warning]: MongoDB Atlas connection failed (${err.message}).`);
      console.warn('[Database Notice]: Likely your current IP is not whitelisted in Atlas.');
      console.warn('[Database Fallback]: Connecting to local MongoDB at mongodb://127.0.0.1:27017/codefolio...\n');
      try {
        const localConn = await mongoose.connect('mongodb://127.0.0.1:27017/codefolio', {
          autoIndex: true,
          serverSelectionTimeoutMS: 3000,
        });
        console.log('[Database] Connected to local MongoDB fallback successfully.');
        return localConn;
      } catch (localErr) {
        console.error(`[Database Local Fallback Error]: ${localErr.message}`);
      }
    }

    console.error(`MongoDB connection error: ${err.message}`);
    throw err;
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
};

module.exports = {
  connectDB,
  disconnectDB,
};

