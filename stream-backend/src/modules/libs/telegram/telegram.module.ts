import { TelegramService } from './telegram.service';
import { getTelegrafConfig } from '@/src/core/config/telegraf.config';
import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';

@Global()
@Module({
	imports: [
		TelegrafModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: getTelegrafConfig,
			inject: [ConfigService]
		})
	],
	providers: [TelegramService],
	exports: [TelegramService]
})
export class TelegramModule {}
