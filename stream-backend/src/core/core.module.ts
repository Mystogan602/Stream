import { AccountModule } from '../modules/auth/account/account.module';
import { PasswordRecoveryModule } from '../modules/auth/password-recovery/password-recovery.module';
import { ProfileModule } from '../modules/auth/profile/profile.module';
import { VerificationModule } from '../modules/auth/verification/verification.module';
import { LivekitModule } from '../modules/libs/livekit/livekit.module';
import { getGraphQLConfig } from './config/graphql.config';
import { getLiveKitConfig } from './config/livekit.config';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { DeactivateModule } from 'src/modules/auth/deactivate/deactivate.module';
import { SessionModule } from 'src/modules/auth/session/session.module';
import { TotpModule } from 'src/modules/auth/totp/totp.module';
import { CronModule } from 'src/modules/cron/cron.module';
import { MailModule } from 'src/modules/libs/mail/mail.module';
import { StorageModule } from 'src/modules/libs/storage/storage.module';
import { StreamModule } from 'src/modules/stream/stream.module';
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
		SessionModule,
		VerificationModule,
		MailModule,
		PasswordRecoveryModule,
		TotpModule,
		DeactivateModule,
		CronModule,
		StorageModule,
		ProfileModule,
		StreamModule,
		LivekitModule.registerAsync({
			imports: [ConfigModule],
			useFactory: getLiveKitConfig,
			inject: [ConfigService]
		})
	]
})
export class CoreModule {}
