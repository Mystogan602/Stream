import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/libs/i18n/request.ts');

const nextConfig: NextConfig = {
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'mys-stream.s3.ap-southeast-2.amazonaws.com'
			}
		]
	}
};

export default withNextIntl(nextConfig);
