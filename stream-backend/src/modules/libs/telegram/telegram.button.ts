import { Markup } from 'telegraf';

export const BUTTONS = {
	authSuccess: Markup.inlineKeyboard([
		[
			Markup.button.callback('👥 Follows', 'follows'),
			Markup.button.callback('👤 Me', 'me')
		],
		[Markup.button.url('🌐 Website', 'https://mysstream.shop')]
	]),
	profile: Markup.inlineKeyboard([
		[
			Markup.button.url(
				'⚙️ Account Settings',
				'https://mysstream.shop/dashboard/settings'
			)
		]
	])
};
