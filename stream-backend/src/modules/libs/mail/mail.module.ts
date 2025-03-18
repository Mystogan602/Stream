import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getMailerConfig } from 'src/core/config/mailer.config';

@Global()
@Module({
	imports: [
		MailerModule.forRootAsync({
			useFactory: getMailerConfig,
			inject: [ConfigService],
			imports: [ConfigModule]
		})
	],
	providers: [MailService],
	exports: [MailService]
})
export class MailModule {}
