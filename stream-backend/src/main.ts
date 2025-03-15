import { CoreModule } from './core/core.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import { ms, type StringValue } from './shared/utils/ms.util';
import { parseBoolean } from './shared/utils/parse-boolean.util';
import { RedisStore } from 'connect-redis';
import { RedisService } from './core/redis/redis.service';

async function bootstrap() {
	const app = await NestFactory.create(CoreModule);

	const config = app.get(ConfigService);
	const redis = app.get(RedisService);

	app.use(cookieParser(config.getOrThrow<string>('COOKIE_SECRET')));

	app.useGlobalPipes(new ValidationPipe({ transform: true }));

	app.use(
		session({
			secret: config.getOrThrow<string>('SESSION_SECRET'),
			name: config.getOrThrow<string>('SESSION_NAME'),
			resave: false,
			saveUninitialized: false,
			cookie: {
				domain: config.getOrThrow<string>('SESSION_DOMAIN'),
				maxAge: ms(config.getOrThrow<StringValue>('SESSION_MAX_AGE')),
				secure: parseBoolean(config.getOrThrow<string>('SESSION_SECURE')),
				httpOnly: parseBoolean(config.getOrThrow<string>('SESSION_HTTP_ONLY')),
				sameSite: 'lax',
			},
			store: new RedisStore({
				client: redis,
				prefix: config.getOrThrow<string>('SESSION_FOLDER'),
			}),
		})
	);
	 
	app.enableCors({
		origin: config.getOrThrow<string>('ALLOWED_ORIGINS'),
		credentials: true,
		exposedHeaders: ['set-cookie']
	});

	await app.listen(config.getOrThrow<number>('PORT') || 3000);
}
bootstrap();
