import { VerificationService } from '../verification/verification.service';
import { LoginInput } from './inputs/login.input';
import {
	BadRequestException,
	ConflictException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { verify } from 'argon2';
import type { Request } from 'express';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { RedisService } from 'src/core/redis/redis.service';
import { getSessionMetadata } from 'src/shared/utils/session-metadata.util';
import { destroySession, saveSession } from 'src/shared/utils/session.util';

@Injectable()
export class SessionService {
	public constructor(
		private readonly prisma: PrismaService,
		private readonly redis: RedisService,
		private readonly config: ConfigService,
		private readonly verificationService: VerificationService
	) {}

	public async findByUser(request: Request) {
		const userId = request.session.userId;

		if (!userId) throw new UnauthorizedException('User not found');

		const keys = await this.redis.keys('*');

		if (!keys)
			throw new InternalServerErrorException('Failed to get sessions');

		const userSessions: Record<string, any>[] = [];

		for (const key of keys) {
			const sessionData = await this.redis.get(key);

			if (sessionData) {
				const session = JSON.parse(sessionData);

				if (session.userId === userId)
					userSessions.push({ ...session, id: key.split(':')[1] });
			}
		}

		userSessions.sort((a, b) => b.createdAt - a.createdAt);

		return userSessions.filter(
			session => session.id !== request.session.id
		);
	}

	public async findCurrent(request: Request) {
		const sessionId = request.session.id;

		if (!sessionId) throw new UnauthorizedException('Session not found');

		const sessionData = await this.redis.get(
			`${this.config.getOrThrow<string>('SESSION_FOLDER')}${sessionId}`
		);

		if (!sessionData) throw new UnauthorizedException('Session not found');

		const session = JSON.parse(sessionData);

		return {
			...session,
			id: sessionId
		};
	}

	public async login(request: Request, input: LoginInput, userAgent: string) {
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

		if (!user.isEmailVerified) {
			await this.verificationService.sendVerificationToken(user);

			throw new BadRequestException(
				'Account is not verified. Please check your email for verification'
			);
		}

		const metadata = getSessionMetadata(request, userAgent);

		return saveSession(request, user, metadata);
	}

	public async logout(request: Request) {
		return destroySession(request, this.config);
	}

	public async clearSession(request: Request) {
		request.res?.clearCookie(
			this.config.getOrThrow<string>('SESSION_NAME')
		);

		return true;
	}

	public async remove(request: Request, id: string) {
		if (request.session.id === id)
			throw new ConflictException('Cannot remove current session');

		await this.redis.del(
			`${this.config.getOrThrow<string>('SESSION_FOLDER')}${id}`
		);

		return true;
	}
}
