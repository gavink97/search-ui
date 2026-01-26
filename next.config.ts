import { configDotenv } from "dotenv";
import type { NextConfig } from "next";

configDotenv()

const nextConfig: NextConfig = {
	images: {
		loader: 'custom',
		loaderFile: 'src/lib/images/loader.ts'
	},
	typedRoutes: true,
	output: "standalone",
	turbopack: {
		root: `${process.env.PWD}`,
	},
};

export default nextConfig;
