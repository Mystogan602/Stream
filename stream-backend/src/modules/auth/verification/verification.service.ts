import { VerificationInput } from './inputs/verification.input';
import { TokenType, User } from '@/prisma/generated';
import { generateToken } from '@/src/shared/utils/generate-token.util';
import { getSessionMetadata } from '@/src/shared/utils/session-metadata.util';
import { saveSession } from '@/src/shared/utils/session.util';
import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common';
import type { Request } from 'express';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { MailService } from 'src/modules/libs/mail/mail.service';

@Injectable()
export class VerificationService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly mailService: MailService
	) {}

	public async verify(
		request: Request,
		input: VerificationInput,
		userAgent: string
	) {
		const { token } = input;

		const existingToken = await this.prismaService.token.findUnique({
			where: {
				token,
				type: TokenType.EMAIL_VERIFY
			}
		});

		if (!existingToken) {
			throw new NotFoundException('Invalid verification token');
		}

		const hasExpired = new Date(existingToken.expiresIn) < new Date();

		if (hasExpired) {
			throw new BadRequestException('Verification token has expired');
		}

		const user = await this.prismaService.user.update({
			where: {
				id: existingToken.userId ?? ''
			},
			data: {
				isEmailVerified: true
			}
		});

		await this.prismaService.token.delete({
			where: {
				id: existingToken.id,
				type: TokenType.EMAIL_VERIFY
			}
		});

		const metadata = getSessionMetadata(request, userAgent);

		return saveSession(request, user, metadata);
	}

	public async sendVerificationToken(user: User) {
		const token = await generateToken(
			this.prismaService,
			user,
			TokenType.EMAIL_VERIFY,
			true
		);

		await this.mailService.sendVerificationToken(user.email, token.token);

		return true;
	}
}
