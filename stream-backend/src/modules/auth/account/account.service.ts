import { VerificationService } from '../verification/verification.service';
import { ChangeEmailInput } from './inputs/change-email.input';
import { ChangePasswordInput } from './inputs/change-password.input';
import { CreateUserInput } from './inputs/create-user.input';
import type { User } from '@/prisma/generated/default';
import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { hash, verify } from 'argon2';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class AccountService {
	public constructor(
		private readonly prisma: PrismaService,
		private readonly verificationService: VerificationService
	) {}

	public async me(id: string) {
		const user = await this.prisma.user.findUnique({
			where: {
				id
			},
			include: {
				socialLinks: true
			}
		});
		return user;
	}

	public async createUser(input: CreateUserInput) {
		const { username, email, password } = input;

		const isUsernameTaken = await this.prisma.user.findUnique({
			where: { username }
		});

		if (isUsernameTaken) {
			throw new ConflictException('Username already taken');
		}

		const isEmailTaken = await this.prisma.user.findUnique({
			where: { email }
		});

		if (isEmailTaken) {
			throw new ConflictException('Email already taken');
		}

		const hashedPassword = await hash(password);

		const user = await this.prisma.user.create({
			data: {
				username,
				email,
				password: hashedPassword,
				displayName: username,
				stream: {
					create: {
						title: `${username}'s Stream`
					}
				}
			}
		});

		await this.verificationService.sendVerificationToken(user);

		return true;
	}

	public async changeEmail(user: User, input: ChangeEmailInput) {
		const { email } = input;
		await this.prisma.user.update({
			where: {
				id: user.id
			},
			data: {
				email
			}
		});

		return true;
	}

	public async changePassword(user: User, input: ChangePasswordInput) {
		const { oldPassword, newPassword } = input;

		const isPasswordCorrect = await verify(user.password, oldPassword);

		if (!isPasswordCorrect) {
			throw new UnauthorizedException('Invalid old password');
		}

		const hashedPassword = await hash(newPassword);

		await this.prisma.user.update({
			where: { id: user.id },
			data: { password: hashedPassword }
		});

		return true;
	}
}
