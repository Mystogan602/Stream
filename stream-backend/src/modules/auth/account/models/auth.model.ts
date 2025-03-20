import { UserModel } from './user.model';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthModel {
	@Field(() => UserModel, { nullable: true })
	public user: UserModel;

	@Field(() => String, { nullable: true })
	public message: string;
}
