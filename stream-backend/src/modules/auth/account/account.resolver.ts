import { AccountService } from './account.service';
import { Resolver, Query } from '@nestjs/graphql';
import { UserModel } from './models/user.model';

@Resolver('Account')
export class AccountResolver {
	public constructor(private readonly accountService: AccountService) {}

	@Query(() => [UserModel], { name: 'findAllUsers' })
	public async findAll() {
		return this.accountService.findAll();
	}
}
