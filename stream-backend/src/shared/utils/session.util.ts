import type { SessionMetadata } from '../types/session-metadata.types';
import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { User } from '@prisma/generated';
import type { Request } from 'express';

export function saveSession(
	req: Request,
	user: User,
	metadata: SessionMetadata
) {
	return new Promise((resolve, reject) => {
		req.session.userId = user.id;
		req.session.createdAt = new Date();
		req.session.metadata = metadata;

		req.session.save(error => {
			if (error)
				return reject(
					new InternalServerErrorException('Failed to save session')
				);

			resolve(user);
		});
	});
}

export function destroySession(req: Request, configService: ConfigService) {
	return new Promise((resolve, reject) => {
		req.session.destroy(error => {
			if (error)
				return reject(
					new InternalServerErrorException('Failed to logout')
                );

			req.res?.clearCookie(
				configService.getOrThrow<string>('SESSION_NAME')
			);

			resolve(true);
		});
	});
}
