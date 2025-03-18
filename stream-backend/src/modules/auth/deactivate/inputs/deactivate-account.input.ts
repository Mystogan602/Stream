import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, Length, MinLength, ValidateIf } from 'class-validator';

@InputType()
export class DeactivateAccountInput {
	@Field()
	@IsNotEmpty()
	@IsString()
	@IsEmail()
	public email: string;

	@Field()
	@IsNotEmpty()
	@IsString()
	@MinLength(8)
	public password: string;

	@Field(() => String, { nullable: true })
	@IsString()
	@ValidateIf(o => o.pin !== undefined && o.pin !== null)
	@Length(6, 6, { message: 'PIN must be exactly 6 characters' })
	public pin?: string;
}
