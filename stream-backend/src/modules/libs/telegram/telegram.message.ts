import type { SponsorshipPlan, User } from '@/prisma/generated/default';
import type { SessionMetadata } from '@/src/shared/types/session-metadata.types';

export const MESSAGES = {
	welcome:
		`🎉 <b>Welcome to Mysstream Bot!</b>\n\n` +
		`📱 To receive notifications and improve your experience using ` +
		`the platform, let's connect your Telegram account to Mysstream.\n\n\n` +
		`👉 Click the button below and go to the <b>Notifications</b> section to ` +
		`complete the setup.`,
	authSuccess: `✅ You have successfully authorized and connected your Telegram account to Mysstream!\n\n`,
	invalidToken: `❌ Invalid or expired token.`,
	profile: (user: User, followersCount: number) =>
		`👤 <b>Profile user:</b>\n` +
		`🔖 Username: <b>${user.username}</b>\n` +
		`📧 Email: <b>${user.email}</b>\n` +
		`👥 Followers: <b>${followersCount}</b>\n` +
		`📝 Bio: <b>${user.bio || 'Not set'}</b>\n\n` +
		`⚙️ Click the button below to go to the profile settings.`,
	follows: (user: User) =>
		`🔖 Username: <a href="https://mysstream.com/${user.username}">${user.username}</a>\n`,
	resetPassword: (token: string, metadata: SessionMetadata) =>
		`🔑 <b>Password reset</b>\n\n` +
		`📨 You requested a password reset for your account on the platform ` +
		`<b>Mysstream</b>.\n\n` +
		`🔄 To create a new password, please click on the following link:\n\n` +
		`🔗 <b><a href="https://mysstream.com/account/recovery/${token}">Reset password</a></b>\n\n` +
		`📅 <b>Request date:</b> ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}\n\n\n` +
		`ℹ️ <b>Request information:</b>\n\n` +
		`📍 <b>Location:</b> ${metadata.location.country}, ${metadata.location.city}\n` +
		`💻 <b>Operating system:</b> ${metadata.device.os}\n` +
		`🌐 <b>Browser:</b> ${metadata.device.browser}\n` +
		`🔒 <b>IP-address:</b> ${metadata.ip}\n\n` +
		`⚠️ If you did not make this request, please ignore this message.\n\n` +
		`🙏 Thank you for using <b>Mysstream</b>!`,
	deactivate: (token: string, metadata: SessionMetadata) =>
		`🚫 <b>Account deactivation request</b>\n\n` +
		`📝 You initiated the process of deactivating your account on the platform ` +
		`<b>Mysstream</b>.\n\n` +
		`✅ To complete the operation, please confirm your request by entering ` +
		`the following confirmation code:\n\n` +
		`🔑 <b>Confirmation code: ${token}</b>\n\n` +
		`📅 <b>Request date:</b> ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}\n\n` +
		`ℹ️ <b>Request information:</b>\n\n` +
		`📍 <b>Location:</b> ${metadata.location.country}, ${metadata.location.city}\n` +
		`💻 <b>Operating system:</b> ${metadata.device.os}\n` +
		`🌐 <b>Browser:</b> ${metadata.device.browser}\n` +
		`🔒 <b>IP-address:</b> ${metadata.ip}\n\n` +
		`❗️ <b>What will happen after deactivation?</b>\n\n` +
		`1. You will automatically log out of the system and lose access to your account.\n` +
		`2. If you do not cancel the deactivation within 7 days, your account will be ` +
		`<b>permanently deleted</b> with all your information, data and subscriptions.\n\n` +
		`⚠️ <b>Attention:</b> If you change your mind within 7 days, you can contact our support to restore access to your account.\n\n` +
		`❌ After deleting the account, it will not be possible to restore it, and all ` +
		`data will be lost without the ability to restore.\n\n` +
		`💡 If you change your mind, simply ignore this message. Your account will remain active.\n\n` +
		`🙏 Thank you for using <b>Mysstream</b>! We always welcome you to our platform and hope you will stay with us.\n\n` +
		`With respect,\n` +
		`Mysstream Team`,

	accountDeleted: () =>
		`❌ <b>Your account was completely deleted.</b>\n\n` +
		`📝 Your account was completely deleted from the database of Mysstream. All your data and information were deleted without the ability to restore.\n\n` +
		`🔕 You will no longer receive notifications in Telegram and email.\n\n` +
		`✨ If you want to return to the platform, you can register using the following link:\n` +
		`🔗 <b><a href="https://mysstream.com/account/create">Register on ` +
		`Mysstream</a></b>\n\n` +
		`🙏 Thank you for being with us! We always welcome you to our platform.\n\n` +
		`With respect,\n` +
		`Mysstream Team`,
	streamStart: (channel: User) =>
		`🎥 <b>Stream ${channel.displayName} started</b>\n\n` +
		`👀 Watch here: <a href="https://mysstream.com/${channel.username}">Go to stream</a>`,

	newFollowing: (follower: User, followersCount: number) =>
		`🎉 <b>You have a new follower!</b>\n\n` +
		`👤 This is user <a href="https://mysstream.com/${follower.username}">${follower.displayName}</a>\n\n` +
		`👥 Total number of followers on your channel: ${followersCount}`,
	newSponsorship: (plan: SponsorshipPlan, sponsor: User) =>
		`🎉 <b>New sponsorship!</b>\n\n` +
		`💝 You have received a new sponsorship on the plan <b>${plan.title}</b>.\n` +
		`💰 Amount: <b>${plan.price} VND</b>\n` +
		`👤 Sponsor: <a href="https://mysstream.com/${sponsor.username}">${sponsor.displayName}</a>\n` +
		`📅 Date of purchase: <b>${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</b>\n\n` +
		`🙏 Thank you for your work and support on the platform Mysstream!`,
};
