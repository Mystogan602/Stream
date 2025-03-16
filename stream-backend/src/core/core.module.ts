import { AccountModule } from '../modules/auth/account/account.module';
import { getGraphQLConfig } from './config/graphql.config';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { SessionModule } from 'src/session/session.module';
import { IS_DEV_ENV } from 'src/shared/utils/is-dev.util';

@Module({
	imports: [
		PrismaModule,
		ConfigModule.forRoot({
			isGlobal: true, // make config available everywhere
			ignoreEnvFile: !IS_DEV_ENV // ignore env file in production
		}),
		GraphQLModule.forRootAsync({
			driver: ApolloDriver, // use apollo driver
			useFactory: getGraphQLConfig, // get graphql config
			inject: [ConfigService], // inject config service
			imports: [ConfigModule] // import config module
		}),
		RedisModule,
		AccountModule,
		SessionModule
	]
})
export class CoreModule {}
