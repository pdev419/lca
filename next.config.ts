import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve 'fs', 'path', and other Node.js built-ins on the client side
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        zlib: false,
        stream: false,
        http: false,
        https: false,
        os: false,
        events: false,
        util: false,
        assert: false,
        buffer: false,
      };
    }
    
    // We're no longer using PDFKit, so we can remove this rule
    // if (!isServer) {
    //   config.module.rules.push({
    //     test: /node_modules[/\\](pdfkit|png-js|linebreak|fontkit)[/\\]/,
    //     use: 'null-loader',
    //   });
    // }
    
    return config;
  },
};

export default nextConfig;
