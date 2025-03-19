import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

@InputType()
export class ChangePasswordInput {
	@Field()
	@IsNotEmpty()
	@IsString()
	@MinLength(8)
	public oldPassword: string;

	@Field()
	@IsNotEmpty()
	@IsString()
	@MinLength(8)
	public newPassword: string;
}
