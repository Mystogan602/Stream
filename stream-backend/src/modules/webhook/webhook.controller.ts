import { WebhookService } from './webhook.service';
import {
	Body,
	Controller,
	Headers,
	HttpCode,
	HttpStatus,
	Post,
	UnauthorizedException
} from '@nestjs/common';

@Controller('webhook')
export class WebhookController {
	public constructor(private readonly webhookService: WebhookService) {}

	@Post('livekit')
	@HttpCode(HttpStatus.OK)
	public async receiveWebhookLivekit(
		@Body() body: string,
		@Headers('Authorization') authorization: string
	) {
		if (!authorization) {
			throw new UnauthorizedException('Authorization header is required');
		}
		return this.webhookService.receiveWebhookLivekit(body, authorization);
	}
}
