/** @type {import('next').NextConfig} */

const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    env: {
        POSTGRES_URL: process.env.POSTGRES_URL,
    },
    output: 'export', // Ensures static files for GitHub Pages
    basePath: '/Attendance-Verification', // Replace <repository-name> with your repo name
    trailingSlash: true, // Adds a trailing slash to all routes
    typescript: {
        ignoreBuildErrors: true, // Disables TypeScript build errors
    },
};

export default nextConfig;