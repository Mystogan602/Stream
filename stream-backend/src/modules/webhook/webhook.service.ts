import { LivekitService } from '../libs/livekit/livekit.service';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WebhookService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly livekitService: LivekitService
	) {}

	public async receiveWebhookLivekit(body: string, authorization: string) {
		const event = await this.livekitService.receiver.receive(
			body,
			authorization,
			true
		);

		if (event.event === 'ingress_started') {

			const stream = await this.prismaService.stream.findUnique({
				where: {
					ingressId: event.ingressInfo?.ingressId
				}
			});

			if (stream) {
				await this.prismaService.stream.update({
					where: {
						ingressId: event.ingressInfo?.ingressId
					},
					data: {
						isLive: true
					}
				});
			}
		}

		if (event.event === 'ingress_ended') {
			const stream = await this.prismaService.stream.findUnique({
				where: {
					ingressId: event.ingressInfo?.ingressId
				}
			});

			if (stream) {
				await this.prismaService.stream.update({
					where: {
						ingressId: event.ingressInfo?.ingressId
					},
					data: {
						isLive: false
					}
				});
			}
		}
	}
}
