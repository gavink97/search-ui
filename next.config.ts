import { configDotenv } from "dotenv";
import type { NextConfig } from "next";

configDotenv()

const nextConfig: NextConfig = {
	typedRoutes: true,
	output: "standalone",
	turbopack: {
		root: `${process.env.PWD}`,
	},
};

export default nextConfig;
