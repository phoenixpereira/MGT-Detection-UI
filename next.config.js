/** @type {import('next').NextConfig} */
const nextConfig = {
      webpack: (config) => {
            // set 'fs' to an empty module on the client to prevent this error on build --> Error: Can't resolve 'fs'
            config.resolve.fallback = {
                  fs: false
            };
            config.module.rules.push({
                  test: /\.node/,
                  use: "raw-loader"
            });
            return config;
      }
};

module.exports = nextConfig;
