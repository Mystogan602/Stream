import { Field, InputType } from '@nestjs/graphql';
import {
	IsNotEmpty,
	IsOptional,
	IsString,
	Matches,
	MaxLength,
	MinLength
} from 'class-validator';

@InputType()
export class ChangeProfileInfoInput {
	@Field()
	@IsNotEmpty()
	@IsString()
	@MinLength(3)
	@Matches(/^[a-zA-Z0-9]+(?:\-[a-zA-Z0-9]+)*$/, {
		message: 'Username must contain only letters, numbers and hyphens'
	})
	public username: string;

	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	public displayName: string;

	@Field(() => String, { nullable: true })
	@IsString()
	@IsOptional()
	@MaxLength(300)
	public bio?: string;
}
