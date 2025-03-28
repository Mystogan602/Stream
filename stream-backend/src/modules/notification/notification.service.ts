import { ChangeNotificationsSettingsInput } from './inputs/change-notifications-settings.input';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { generateToken } from '@/src/shared/utils/generate-token.util';
import { Injectable } from '@nestjs/common';
import type { SponsorshipPlan, User } from '@prisma/generated';
import { NotificationType, TokenType } from '@prisma/generated';

@Injectable()
export class NotificationService {
	public constructor(private readonly prismaService: PrismaService) {}

	public async findUnreadCount(user: User) {
		const count = await this.prismaService.notification.count({
			where: {
				isRead: false,
				userId: user.id
			}
		});

		return count;
	}

	public async findByUser(user: User) {
		await this.prismaService.notification.updateMany({
			where: {
				isRead: false,
				userId: user.id
			},
			data: {
				isRead: true
			}
		});

		const notifications = await this.prismaService.notification.findMany({
			where: {
				userId: user.id
			},
			orderBy: {
				createdAt: 'desc'
			}
		});

		return notifications;
	}

	public async createStreamStart(userId: string, channel: User) {
		const notification = await this.prismaService.notification.create({
			data: {
				message: `
					<b class='font-medium'>Hey</b>
					<p>Watch <a href='/${channel.username}' class='font-semibold'>${channel.displayName}</a> live</p>
				`,
				type: NotificationType.STREAM_START,
				user: {
					connect: {
						id: userId
					}
				}
			}
		});

		return notification;
	}

	public async createNewFollowing(userId: string, follower: User) {
		const notification = await this.prismaService.notification.create({
			data: {
				message: `
					<b class='font-medium'>Hey</b>
					<p><a href='/${follower.username}' class='font-semibold'>${follower.displayName}</a> started following you</p>
				`,
				type: NotificationType.NEW_FOLLOWER,
				user: {
					connect: {
						id: userId
					}
				}
			}
		});

		return notification;
	}

	public async createNewSponsorship(
		userId: string,
		plan: SponsorshipPlan,
		sponsor: User
	) {
		const notification = await this.prismaService.notification.create({
			data: {
				message: `
					<b class='font-medium'>New sponsorship!</b>
					<p>User <a href='/${sponsor.username}' class='font-semibold'>${sponsor.displayName}</a> became your sponsor, choosing the plan <strong>${plan.title}</strong>.</p>
				`,
				type: NotificationType.NEW_SPONSORSHIP,
				user: {
					connect: {
						id: userId
					}
				}
			}
		});

		return notification;
	}

	public async createEnableTwoFactor(userId: string) {
		const notification = await this.prismaService.notification.create({
			data: {
				message: `
					<b class='font-medium'>Two-factor authentication enabled!</b>
					<p>Please enable two-factor authentication in your account settings to enhance security.</p>
				`,
				type: NotificationType.ENABLE_TWO_FACTOR,
				user: {
					connect: {
						id: userId
					}
				}
			}
		});

		return notification;
	}

	public async createVerifyChannel(userId: string) {
		const notification = await this.prismaService.notification.create({
			data: {
				message: `
					<b class='font-medium'>Congratulations!</b>
					<p>Your channel has been verified, and a checkmark will now appear next to your channel.</p>
				`,
				type: NotificationType.VERIFIED_CHANNEL,
				user: {
					connect: {
						id: userId
					}
				}
			}
		});

		return notification;
	}

	public async changeSettings(
		user: User,
		input: ChangeNotificationsSettingsInput
	) {
		const { siteNotifications, telegramNotifications } = input;

		const notificationSettings =
			await this.prismaService.notificationSettings.upsert({
				where: {
					userId: user.id
				},
				create: {
					siteNotifications,
					telegramNotifications,
					user: {
						connect: {
							id: user.id
						}
					}
				},
				update: {
					siteNotifications,
					telegramNotifications
				},
				include: {
					user: true
				}
			});

		if (
			notificationSettings.telegramNotifications &&
			!notificationSettings.user?.telegramId
		) {
			const telegramAuthToken = await generateToken(
				this.prismaService,
				user,
				TokenType.TELEGRAM_AUTH
			);

			return {
				notificationSettings,
				telegramAuthToken: telegramAuthToken.token
			};
		}

		if (
			!notificationSettings.telegramNotifications &&
			notificationSettings.user?.telegramId
		) {
			await this.prismaService.user.update({
				where: {
					id: user.id
				},
				data: {
					telegramId: null
				}
			});
		}

		return {
			notificationSettings
		};
	}
}
