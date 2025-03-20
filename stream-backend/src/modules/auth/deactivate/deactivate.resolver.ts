import { UserModel } from '../account/models/user.model';
import { DeactivateService } from './deactivate.service';
import { DeactivateAccountInput } from './inputs/deactivate-account.input';
import type { User } from '@/prisma/generated/default';
import { Authorization } from '@/src/shared/decorators/auth.decorator';
import { Authorized } from '@/src/shared/decorators/authorized.decorator';
import { UserAgent } from '@/src/shared/decorators/user-agent.decorator';
import type { GqlContext } from '@/src/shared/types/gql-context.types';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

@Resolver('Deactivate')
export class DeactivateResolver {
	public constructor(private readonly deactivateService: DeactivateService) {}

	@Authorization()
	@Mutation(() => UserModel, { name: 'deactivateAccount' })
	public async deactivate(
		@Context() { req }: GqlContext,
		@Args('data') input: DeactivateAccountInput,
		@Authorized() user: User,
		@UserAgent() userAgent: string
	) {
		return this.deactivateService.deactivate(req, input, user, userAgent);
	}
}
