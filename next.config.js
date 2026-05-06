/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    'http://127.0.0.1:3000',
    'http://localhost:3000',
    '127.0.0.1',
    'localhost'
  ],
};

module.exports = nextConfig;
