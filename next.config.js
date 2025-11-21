// next.config.js
// const isProduction = false;
const isProduction = true;


/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: isProduction ? '/out' : '.',
  assetPrefix: isProduction ? '/out/' : '.',
}

module.exports = nextConfig