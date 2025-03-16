import { LoginInput } from './inputs/login.input';
import {
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { verify } from 'argon2';
import type { Request } from 'express';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class SessionService {
	public constructor(
		private readonly prisma: PrismaService,
		private readonly config: ConfigService
	) {}

	public async login(request: Request, input: LoginInput) {
		const { login, password } = input;

		const user = await this.prisma.user.findFirst({
			where: {
				OR: [
					{ username: { equals: login } },
					{ email: { equals: login } }
				]
			}
		});

		if (!user) throw new NotFoundException('Invalid credentials');

		const isPasswordValid = await verify(user.password, password);

		if (!isPasswordValid)
			throw new UnauthorizedException('Password is incorrect');

		return new Promise((resolve, reject) => {
			request.session.userId = user.id;
			request.session.createdAt = new Date();

			request.session.save(error => {
				if (error)
					return reject(
						new InternalServerErrorException('Failed to login')
					);

				resolve(user);
			});
		});
	}

	public async logout(request: Request) {
		return new Promise((resolve, reject) => {
			request.session.destroy(error => {
				if (error)
					return reject(
						new InternalServerErrorException('Failed to logout')
					);

				request.res?.clearCookie(
					this.config.getOrThrow<string>('SESSION_NAME')
				);

				resolve(true);
			});
		});
	}
}
