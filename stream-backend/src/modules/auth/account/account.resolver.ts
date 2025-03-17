import { AccountService } from './account.service';
import { CreateUserInput } from './inputs/create-user.input';
import { UserModel } from './model/user.model';
import { Authorization } from '@/src/shared/decorators/auth.decorator';
import { Authorized } from '@/src/shared/decorators/authorized.decorator';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

@Resolver('Account')
export class AccountResolver {
	public constructor(private readonly accountService: AccountService) {}

	@Authorization()
	@Query(() => UserModel, { name: 'findProfile' })
	public async me(@Authorized('id') id: string) {
		return this.accountService.me(id);
	}

	@Mutation(() => Boolean, { name: 'createUser' })
	public async createUser(@Args('data') input: CreateUserInput) {
		return this.accountService.createUser(input);
	}
}
