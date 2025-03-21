import { PrismaService } from '@/src/core/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class CategoryService {
	constructor(private readonly prismaService: PrismaService) {}

	public async findAll() {
		const categories = await this.prismaService.category.findMany({
			orderBy: {
				createdAt: 'desc'
			},
			include: {
				streams: {
					include: {
						user: true,
						category: true
					}
				}
			}
		});

		return categories;
	}

	public async findRandom() {
		const total = await this.prismaService.category.count();

		const categories = await this.prismaService.category.findMany({
			skip: 0,
			take: total,
			include: {
				streams: {
					include: {
						user: true,
						category: true
					}
				}
			}
		});

		if (total === 0) return [];

		const maxItems = Math.min(total, 7);

		const randomIndexes = new Set<number>();
		while (randomIndexes.size < maxItems) {
			const randomIndex = Math.floor(Math.random() * total);
			randomIndexes.add(randomIndex);
		}

		return Array.from(randomIndexes).map(index => categories[index]);
	}

	public async findBySlug(slug: string) {
		const category = await this.prismaService.category.findUnique({
			where: {
				slug
			},
			include: {
				streams: {
					include: {
						user: true,
						category: true
					}
				}
			}
		});

		if (!category) {
			throw new NotFoundException('Category not found');
		}

		return category;
	}
}
