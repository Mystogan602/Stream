import { Link } from 'lucide-react';
import {
    FaDiscord,
    FaTelegram,
    FaTiktok,
    FaXTwitter,
    FaYoutube,
    FaFacebook,
    FaInstagram,
    FaLinkedin,
    FaTwitch,
    FaGithub,
} from 'react-icons/fa6';

export function getSocialIcon(url: string) {
    switch (true) {
        case url.includes('t.me'):
            return FaTelegram;
        case url.includes('youtube.com') || url.includes('youtu.be'):
            return FaYoutube;
        case url.includes('twitter.com') || url.includes('x.com'):
            return FaXTwitter;
        case url.includes('discord.com') || url.includes('discord.gg'):
            return FaDiscord;
        case url.includes('tiktok.com'):
            return FaTiktok;
        case url.includes('facebook.com'):
            return FaFacebook;
        case url.includes('instagram.com'):
            return FaInstagram;
        case url.includes('twitch.tv'):
            return FaTwitch;
        case url.includes('linkedin.com'):
            return FaLinkedin;
        case url.includes('github.com'):
            return FaGithub;
        default:
            return Link;
    }
}