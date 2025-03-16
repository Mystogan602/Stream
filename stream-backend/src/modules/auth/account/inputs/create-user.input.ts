import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

@InputType()
export class CreateUserInput {
	@Field()
	@IsNotEmpty()
	@IsString()
	@MinLength(3)
	@Matches(/^[a-zA-Z0-9]+(?:\-[a-zA-Z0-9]+)*$/, {
		message: 'Username must contain only letters, numbers and hyphens',
	})
	public username: string;

	@Field()
	@IsString()
	@IsNotEmpty()
	@IsEmail()
	public email: string;

	@Field()
	@IsNotEmpty()
	@IsString()
	@MinLength(8)
	public password: string;
}
