/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  // Suppress punycode warning
  webpack: (config, { isServer, dev }) => {
    // Suppress the warning by ignoring punycode
    config.ignoreWarnings = [
      { module: /node_modules\/punycode/ }
    ];
    
    // Let Next.js handle the caching configuration
    return config;
  }
}

module.exports = nextConfig
