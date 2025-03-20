import { StorageService } from '../libs/storage/storage.service';
import { ChangeStreamInfoInput } from './inputs/change-stream-info.input';
import { FiltersInput } from './inputs/filters.input';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import type { Prisma, User } from '@prisma/generated';
import * as Upload from 'graphql-upload/Upload.js';
import * as sharp from 'sharp';

@Injectable()
export class StreamService {
	public constructor(
		private readonly prisma: PrismaService,
		private readonly storageService: StorageService
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
				user: true
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
				user: true
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
				title
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
