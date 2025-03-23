import { WebhookService } from './webhook.service';
import {
	Body,
	Controller,
	Headers,
	HttpCode,
	HttpStatus,
	Post,
	RawBody,
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

	@Post('stripe')
	@HttpCode(HttpStatus.OK)
	public async receiveWebhookStripe(
		@RawBody() rawBody: string,
		@Headers('stripe-signature') sig: string
	) {
		if (!sig) {
			throw new UnauthorizedException(
				'Stripe signature header is missing'
			);
		}

		const event = await this.webhookService.constructStripeEvent(
			rawBody,
			sig
		);

		return await this.webhookService.receiveWebhookStripe(event);
	}
}
