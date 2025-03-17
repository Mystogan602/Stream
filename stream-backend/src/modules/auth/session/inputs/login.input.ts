import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

@InputType()
export class LoginInput {
	@Field()
	@IsNotEmpty()
	@IsString()
	@MinLength(3)
	public login: string;

	@Field()
	@IsNotEmpty()
	@IsString()
	@MinLength(8)
	public password: string;
}
