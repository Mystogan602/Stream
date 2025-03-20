import { ReadStream } from 'fs';

export function validateFileFormat(
	filename: string,
	allowedFileFormats: string[]
) {
	if (!filename || !filename.includes('.')) {
		return false;
	}
    
	const fileParts = filename.split('.');
	const extension = fileParts[fileParts.length - 1];

	return allowedFileFormats.includes(extension);
}

export async function validateFileSize(
	fileStream: ReadStream,
	allowedFileSizeInBytes: number
) {
	return new Promise((resolve, reject) => {
		let fileSizeInBytes = 0;
		fileStream
			.on('data', (data: Buffer) => {
				fileSizeInBytes += data.byteLength;
				if (fileSizeInBytes > allowedFileSizeInBytes) {
					fileStream.destroy();
					resolve(false);
				}
			})
			.on('end', () => {
				resolve(fileSizeInBytes <= allowedFileSizeInBytes);
			})
			.on('error', err => {
				reject(err);
			});
	});
}
