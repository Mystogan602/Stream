import { StorageService } from '../libs/storage/storage.service';
import { ChangeStreamInfoInput } from './inputs/change-stream-info.input';
import { FiltersInput } from './inputs/filters.input';
import { GenerateStreamTokenInput } from './inputs/generate-stream-token.input';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Prisma, User } from '@prisma/generated';
import * as Upload from 'graphql-upload/Upload.js';
import { AccessToken } from 'livekit-server-sdk';
import * as sharp from 'sharp';

@Injectable()
export class StreamService {
	public constructor(
		private readonly prisma: PrismaService,
		private readonly storageService: StorageService,
		private readonly configService: ConfigService
	) {}

	public async findAll(input: FiltersInput) {
		const { take, skip, searchTerm } = input;

		const whereClause = searchTerm
			? this.findBySearchTermFilter(searchTerm)
			: undefined;

		const streams = await this.prisma.stream.findMany({
			where: {
				...whereClause,
				user: {
					isDeactivated: false
				}
			},
			include: {
				user: true,
				category: true
			},
			take: take || 10,
			skip: skip || 0,
			orderBy: {
				createdAt: 'desc'
			}
		});

		return streams;
	}

	public async findRandom() {
		const total = await this.prisma.stream.count({
			where: {
				user: {
					isDeactivated: false
				}
			}
		});

		const streams = await this.prisma.stream.findMany({
			where: {
				user: {
					isDeactivated: false
				}
			},
			include: {
				user: true,
				category: true
			},
			skip: 0,
			take: total
		});

		if (total === 0) return [];

		const maxItems = Math.min(total, 4);

		const randomIndexes = new Set<number>();
		while (randomIndexes.size < maxItems) {
			const randomIndex = Math.floor(Math.random() * total);
			randomIndexes.add(randomIndex);
		}

		return Array.from(randomIndexes).map(index => streams[index]);
	}

	public async changeInfo(user: User, input: ChangeStreamInfoInput) {
		const { title, categoryId } = input;

		const stream = await this.findByUserId(user);

		if (!stream) {
			throw new NotFoundException('Stream not found');
		}

		await this.prisma.stream.update({
			where: {
				id: stream.id
			},
			data: {
				title,
				category: {
					connect: {
						id: categoryId
					}
				}
			}
		});

		return true;
	}

	public async changeThumbnail(user: User, file: Upload) {
		const stream = await this.findByUserId(user);

		if (!stream) {
			throw new NotFoundException('Stream not found');
		}

		if (stream.thumbnailUrl) {
			await this.storageService.remove(stream.thumbnailUrl);
		}

		const chunks: Buffer[] = [];
		for await (const chunk of file.createReadsStream()) {
			chunks.push(chunk);
		}

		const buffer = Buffer.concat(chunks);

		const fileName = `streams/${user.username}-${stream.id}.webp`;

		if (file.filename && file.filename.endWith('.gif')) {
			const processedBuffer = await sharp(buffer, { animated: true })
				.resize(1280, 720)
				.webp()
				.toBuffer();

			await this.storageService.upload(
				processedBuffer,
				fileName,
				'image/webp'
			);
		} else {
			const processedBuffer = await sharp(buffer)
				.resize(1280, 720)
				.webp()
				.toBuffer();

			await this.storageService.upload(
				processedBuffer,
				fileName,
				'image/webp'
			);
		}

		await this.prisma.stream.update({
			where: { id: stream.id },
			data: { thumbnailUrl: fileName }
		});

		return true;
	}

	public async removeThumbnail(user: User) {
		const stream = await this.findByUserId(user);

		if (!stream) {
			throw new NotFoundException('Stream not found');
		}

		if (!stream.thumbnailUrl) {
			return;
		}

		await this.storageService.remove(stream.thumbnailUrl);

		await this.prisma.stream.update({
			where: {
				id: stream.id
			},
			data: {
				thumbnailUrl: null
			}
		});

		return true;
	}

	public async generateStreamToken(input: GenerateStreamTokenInput) {
		const { userId, channelId } = input;
		let self: { id: string; username: string };

		const user = await this.prisma.user.findUnique({
			where: {
				id: userId
			}
		});

		if (user) {
			self = {
				id: user.id,
				username: user.username
			};
		} else {
			self = {
				id: userId,
				username: `Viewer ${Math.floor(Math.random() * 100000)}`
			};
		}

		const channel = await this.prisma.user.findUnique({
			where: {
				id: channelId
			}
		});

		if (!channel) {
			throw new NotFoundException('Channel not found');
		}

		const isHost = self.id === channel.id;

		const token = new AccessToken(
			this.configService.getOrThrow<string>('LIVEKIT_API_KEY'),
			this.configService.getOrThrow<string>('LIVEKIT_API_SECRET'),
			{
				identity: isHost ? `Host-${self.id}` : self.id.toString(),
				name: self.username
			}
		);

		token.addGrant({
			room: channel.id,
			roomJoin: true,
			canPublish: false
		});

		return { token: token.toJwt() };
	}

	private async findByUserId(user: User) {
		const stream = await this.prisma.stream.findUnique({
			where: {
				userId: user.id
			}
		});

		return stream;
	}

	private findBySearchTermFilter(
		searchTerm: string
	): Prisma.StreamWhereInput {
		return {
			OR: [
				{
					title: {
						contains: searchTerm,
						mode: 'insensitive'
					},
					user: {
						username: {
							contains: searchTerm,
							mode: 'insensitive'
						}
					}
				}
			]
		};
	}
}
