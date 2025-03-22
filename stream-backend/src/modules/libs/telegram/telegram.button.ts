import { Markup } from 'telegraf';

export const BUTTONS = {
	authSuccess: Markup.inlineKeyboard([
		[
			Markup.button.callback('👥 Follows', 'follows'),
			Markup.button.callback('👤 Me', 'me')
		],
		[Markup.button.url('🌐 Website', 'https://mysstream.com')]
	]),
	profile: Markup.inlineKeyboard([
		[
			Markup.button.url(
				'⚙️ Account Settings',
				'https://mysstream.com/dashboard/settings'
			)
		]
	])
};
