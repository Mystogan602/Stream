import { UserModel } from '../account/models/user.model';
import { VerificationInput } from './inputs/verification.input';
import { VerificationService } from './verification.service';
import { UserAgent } from '@/src/shared/decorators/user-agent.decorator';
import { GqlContext } from '@/src/shared/types/gql-context.types';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

@Resolver('Verification')
export class VerificationResolver {
	public constructor(
		private readonly verificationService: VerificationService
	) {}

	@Mutation(() => UserModel, { name: 'verifyAccount' })
	public async verify(
		@Args('data') input: VerificationInput,
		@Context() { req }: GqlContext,
		@UserAgent() userAgent: string
	) {
		return this.verificationService.verify(req, input, userAgent);
	}
}
