import { CoreModule } from './core/core.module';
import { RedisService } from './core/redis/redis.service';
import { ms, type StringValue } from './shared/utils/ms.util';
import { parseBoolean } from './shared/utils/parse-boolean.util';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { RedisStore } from 'connect-redis';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';

async function bootstrap() {
	// create app
	const app = await NestFactory.create(CoreModule, { rawBody: true });

	// config
	const config = app.get(ConfigService);
	const redis = app.get(RedisService);

	// cookie
	app.use(cookieParser(config.getOrThrow<string>('COOKIE_SECRET')));

	// graphql upload
	app.use(
		config.getOrThrow<string>('GRAPHQL_PREFIX'),
		graphqlUploadExpress()
	);

	// validation
	app.useGlobalPipes(new ValidationPipe({ transform: true }));

	// session
	app.use(
		session({
			secret: config.getOrThrow<string>('SESSION_SECRET'),
			name: config.getOrThrow<string>('SESSION_NAME'),
			resave: false,
			saveUninitialized: false,
			cookie: {
				domain: config.getOrThrow<string>('SESSION_DOMAIN'),
				maxAge: ms(config.getOrThrow<StringValue>('SESSION_MAX_AGE')),
				secure: parseBoolean(
					config.getOrThrow<string>('SESSION_SECURE')
				),
				httpOnly: parseBoolean(
					config.getOrThrow<string>('SESSION_HTTP_ONLY')
				),
				sameSite: 'lax'
			},
			store: new RedisStore({
				client: redis,
				prefix: config.getOrThrow<string>('SESSION_FOLDER')
			})
		})
	);

	// cors
	app.enableCors({
		origin: config.getOrThrow<string>('ALLOWED_ORIGIN'),
		credentials: true,
		exposedHeaders: ['set-cookie']
	});

	// listen
	await app.listen(config.getOrThrow<number>('PORT') || 4000);
}
bootstrap();
