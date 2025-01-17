const webpack = require('webpack');

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config : any, { isServer }: { isServer: boolean }) => {
    config.plugins.push(new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    })
    )
    config.experiments = { ...config.experiments, asyncWebAssembly: true };
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false, // Disable 'fs' for client-side
        path: false,
        crypto: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
