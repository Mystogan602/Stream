import { BUTTONS } from './telegram.button';
import { MESSAGES } from './telegram.message';
import { type SponsorshipPlan, TokenType, type User } from '@/prisma/generated';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import type { SessionMetadata } from '@/src/shared/types/session-metadata.types';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Action, Command, Ctx, Start, Update } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';

@Update()
@Injectable()
export class TelegramService extends Telegraf {
	private readonly _token: string;

	public constructor(
		private readonly prismaService: PrismaService,
		private readonly configService: ConfigService
	) {
		super(configService.getOrThrow<string>('TELEGRAM_BOT_TOKEN'));
		this._token = configService.getOrThrow<string>('TELEGRAM_BOT_TOKEN');
	}

	@Start()
	public async onStart(@Ctx() ctx: any) {
		const chatId = ctx.chat?.id.toString();
		const token = ctx.message?.text.split(' ')[1];

		if (token) {
			const authToken = await this.prismaService.token.findUnique({
				where: {
					token,
					type: TokenType.TELEGRAM_AUTH
				}
			});

			if (!authToken) {
				await ctx.reply(MESSAGES.invalidToken);
			}

			const hasExpired = authToken
				? new Date(authToken.expiresIn) < new Date()
				: true;

			if (hasExpired) {
				await ctx.reply(MESSAGES.invalidToken);
			}

			if (authToken) {
				await this.connectTelegram(authToken.userId!, chatId);

				await this.prismaService.token.delete({
					where: {
						id: authToken.id
					}
				});

				await ctx.replyWithHTML(
					MESSAGES.authSuccess,
					BUTTONS.authSuccess
				);
			}
		} else {
			const user = await this.findUserByChatId(chatId);

			if (user) {
				await this.onMe(ctx);
				return;
			} else {
				await ctx.replyWithHTML(MESSAGES.welcome, BUTTONS.profile);
				return;
			}
		}
	}

	@Command('me')
	@Action('me')
	public async onMe(@Ctx() ctx: any) {
		const chatId = ctx.chat?.id.toString();
		const user = await this.findUserByChatId(chatId);

		const followersCount = await this.prismaService.follow.count({
			where: {
				followingId: user!.id
			}
		});

		if (!user) {
			return ctx.reply('Account not connected');
		}

		await ctx.replyWithHTML(
			MESSAGES.profile(user, followersCount),
			BUTTONS.profile
		);
	}

	@Command('follows')
	@Action('follows')
	public async onFollows(@Ctx() ctx: any) {
		const chatId = ctx.chat?.id.toString();
		const user = await this.findUserByChatId(chatId);

		const follows = await this.prismaService.follow.findMany({
			where: {
				followerId: user!.id
			},
			include: {
				following: true
			}
		});

		if (user && follows.length) {
			const followsList = follows
				.map(follow => MESSAGES.follows(follow.following))
				.join('\n');

			const message = `Channels you are subscribed to:\n\n${followsList}`;
			await ctx.replyWithHTML(message);
		} else {
			await ctx.replyWithHTML('<b>You are not following anyone</b>');
		}
	}

	public async sendPasswordResetToken(
		chatId: string,
		token: string,
		metadata: SessionMetadata
	) {
		await this.telegram.sendMessage(
			chatId,
			MESSAGES.resetPassword(token, metadata),
			{ parse_mode: 'HTML' }
		);
	}

	public async sendDeactivationToken(
		chatId: string,
		token: string,
		metadata: SessionMetadata
	) {
		await this.telegram.sendMessage(
			chatId,
			MESSAGES.deactivate(token, metadata),
			{ parse_mode: 'HTML' }
		);
	}

	public async sendAccountDeleted(chatId: string) {
		await this.telegram.sendMessage(chatId, MESSAGES.accountDeleted(), {
			parse_mode: 'HTML'
		});
	}

	public async sendStreamStart(chatId: string, channel: User) {
		await this.telegram.sendMessage(chatId, MESSAGES.streamStart(channel), {
			parse_mode: 'HTML'
		});
	}

	public async sendNewFollowing(chatId: string, follower: User) {
		const user = await this.findUserByChatId(chatId);

		await this.telegram.sendMessage(
			chatId,
			MESSAGES.newFollowing(follower, user?.followings.length ?? 0),
			{ parse_mode: 'HTML' }
		);
	}

	public async sendNewSponsorship(
		chatId: string,
		plan: SponsorshipPlan,
		sponsor: User
	) {
		await this.telegram.sendMessage(
			chatId,
			MESSAGES.newSponsorship(plan, sponsor),
			{ parse_mode: 'HTML' }
		);
	}

	private async connectTelegram(userId: string, chatId: string) {
		await this.prismaService.user.update({
			where: {
				id: userId
			},
			data: {
				telegramId: chatId
			}
		});
	}

	private async findUserByChatId(chatId: string) {
		const user = await this.prismaService.user.findUnique({
			where: {
				telegramId: chatId
			},
			include: {
				followers: true,
				followings: true
			}
		});
		return user;
	}
}
