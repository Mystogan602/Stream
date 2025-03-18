import { Field, InputType } from '@nestjs/graphql';
import {
	Equals,
	IsNotEmpty,
	IsString,
	IsUUID,
	MinLength,
	Validate
} from 'class-validator';
import { IsPasswordsMatchingConstraint } from '@/src/shared/decorators/is-passwords-matching-constraint.decorator';

@InputType()
export class NewPasswordInput {
	@Field(() => String)
	@IsNotEmpty()
	@IsString()
	@MinLength(8)
	public password: string;

	@Field(() => String)
	@IsNotEmpty()
	@IsString()
	@MinLength(8)
	@Validate(IsPasswordsMatchingConstraint)
	public passwordRepeat: string;

	@Field(() => String)
	@IsNotEmpty()
	@IsUUID('4')
	public token: string;
}
