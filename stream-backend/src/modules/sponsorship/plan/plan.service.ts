import { CreatePlanInput } from './inputs/create-plan.input';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import type { User } from '@prisma/generated';
import { StripeService } from 'src/modules/libs/stripe/stripe.service';

@Injectable()
export class PlanService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly stripeService: StripeService
	) {}

	public async findMyPlans(user: User) {
		const plans = await this.prismaService.sponsorshipPlan.findMany({
			where: {
				channelId: user.id
			}
		});
		return plans;
	}

	public async create(user: User, input: CreatePlanInput) {
		const { title, description, price } = input;

		const channel = await this.prismaService.user.findUnique({
			where: {
				id: user.id
			}
		});

		if (!channel) {
			throw new ForbiddenException('Channel not found');
		}

		if (!channel.isVerified) {
			throw new ForbiddenException('Channel not verified');
		}

		const stripePlan = await this.stripeService.plans.create({
			amount: Math.round(price),
			currency: 'vnd',
			interval: 'month',
			product: {
				name: title
			}
		});

		await this.prismaService.sponsorshipPlan.create({
			data: {
				title,
				description,
				price,
				stripeProductId: stripePlan.product as string,
				stripePlanId: stripePlan.id,
				channel: {
					connect: {
						id: user.id
					}
				}
			}
		});

		return true;
	}

	public async remove(planId: string) {
		const plan = await this.prismaService.sponsorshipPlan.findUnique({
			where: {
				id: planId
			}
		});

		if (!plan) {
			throw new NotFoundException('Plan not found');
		}

		await this.stripeService.plans.del(plan.stripePlanId);
		await this.stripeService.products.del(plan.stripeProductId);
		
		await this.prismaService.sponsorshipPlan.delete({
			where: {
				id: planId
			}
		});

		return true;
	}
}
