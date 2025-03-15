import { getGraphQLConfig } from './config/graphql.config'
import { PrismaModule } from './prisma/prisma.module'
import { ApolloDriver } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { IS_DEV_ENV } from 'src/shared/utils/is-dev.util'
import { RedisModule } from './redis/redis.module';

@Module({
	imports: [
		PrismaModule,
		ConfigModule.forRoot({
			isGlobal: true,
			ignoreEnvFile: !IS_DEV_ENV
		}),
		GraphQLModule.forRootAsync({
			driver: ApolloDriver,
			useFactory: getGraphQLConfig,
			inject: [ConfigService],
			imports: [ConfigModule]
		}),
		RedisModule
	]
})
export class CoreModule {}
