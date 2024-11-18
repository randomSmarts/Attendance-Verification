/** @type {import('next').NextConfig} */

const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    env: {
        POSTGRES_URL: process.env.POSTGRES_URL,
    },
    output: 'export', // Ensures static files for GitHub Pages
    trailingSlash: true, // Adds a trailing slash to all routes
    typescript: {
        ignoreBuildErrors: true, // Disables TypeScript build errors
    },
};

export default nextConfig;