import { CreateUserInput } from './inputs/create-user.input';
import { ConflictException, Injectable } from '@nestjs/common';
import { hash } from 'argon2';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class AccountService {
	public constructor(private readonly prisma: PrismaService) {}

	public async me(id: string) {
		const user = await this.prisma.user.findUnique({
			where: {
				id
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

		await this.prisma.user.create({
			data: {
				username,
				email,
				password: hashedPassword,
				displayName: username
			}
		});

		return true;
	}
}
