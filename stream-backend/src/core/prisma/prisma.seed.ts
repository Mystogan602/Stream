import { BadRequestException, Logger } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/generated';
import { hash } from 'argon2';

const prisma = new PrismaClient({
	transactionOptions: {
		maxWait: 5000,
		timeout: 10000,
		isolationLevel: Prisma.TransactionIsolationLevel.Serializable
	}
});

async function main() {
	try {
		Logger.log('Seeding database...');

		await prisma.$transaction([
			prisma.user.deleteMany(),
			prisma.socialLink.deleteMany(),
			prisma.stream.deleteMany(),
			prisma.category.deleteMany()
		]);

		await prisma.category.createMany({
			data: [
				{
					title: 'Minecraft',
					slug: 'minecraft',
					description:
						'Immerse yourself in the endless world of creativity and adventure in Minecraft! This category is dedicated to the most popular sandbox game where you can build, explore and survive in unique worlds. Watch streams, get inspired by creative builds, participate in collaborative projects and share your achievements. Join a community where imagination knows no bounds, and discover the incredible possibilities that Minecraft offers!',
					thumbnailUrl: '/categories/minecraft.webp'
				},
				{
					title: 'Grand Theft Auto V',
					slug: 'grand-theft-auto-v',
					description:
						'Welcome to the criminal world of Los Santos! This category is dedicated to one of the most popular open-world games where you can freely explore, complete missions, and enjoy crazy adventures. Watch streams, participate in exciting races and robberies, discuss strategies, and share your unique moments from the game. Join a community where everyone will find something to do - from street races to creating their own stories within the GTA V framework!',
					thumbnailUrl: '/categories/grand-theft-auto-v.webp'
				},
				{
					title: 'Rust',
					slug: 'rust',
					description:
						'Welcome to the harsh and thrilling world of Rust! This category is dedicated to one of the most popular survival games where strategies and skills play a key role. Watch streams, observe base building during exciting battles and resource captures. Share your tactics, discuss updates, and find like-minded people ready to challenge this harsh world. Join us to learn how to survive and thrive in a harsh competitive environment!',
					thumbnailUrl: '/categories/rust.webp'
				},
				{
					title: 'Cyberpunk 2077',
					slug: 'cyberpunk-2077',
					description:
						"Welcome to the dark and thrilling world of Night City! This category is dedicated to Cyberpunk 2077, where you can immerse yourself in the future's atmosphere, full of dark adventures and complex choices. Watch streams, discuss quests and storylines, and share your tactics and experience in this unique RPG. Join a community where everyone can explore the cyberpunk world and uncover its mysteries, becoming part of this incredible story!",
					thumbnailUrl: '/categories/cyberpunk-2077.webp'
				},
				{
					title: 'Just Chatting',
					slug: 'just-chatting',
					description:
						'Immerse yourself in the world of live discussions and communication! This category offers you a unique opportunity to exchange opinions, participate in exciting conversations, and find like-minded people. Share your thoughts, ask questions, and get answers in real time. Join streams where everyone can express their opinion and become part of a friendly community!',
					thumbnailUrl: '/categories/just-chatting.webp'
				},
				{
					title: 'Red Dead Redemption 2',
					slug: 'red-dead-redemption-2',
					description:
						'Immerse yourself in the Wild West atmosphere of one of the most thrilling adventures in gaming history! This category is dedicated to Red Dead Redemption 2, where you can follow epic stories, explore beautiful landscapes, and participate in exciting streams. Discuss strategies, share moments from the game, and find like-minded people who share your passion for this cult classic. Join us and discover a world full of adventures, freedom, and cowboy spirit!',
					thumbnailUrl: '/categories/red-dead-redemption-2.webp'
				},
				{
					title: 'Learning',
					slug: 'learning',
					description:
						'Expand your knowledge and skills in this category dedicated to learning! Here you will find streams and courses on various topics - from art and music to languages and personal productivity. Participate in interactive lessons, ask questions, and get advice from experienced mentors. Learning has become even more accessible and exciting! Join a community of people striving for self-improvement and discover new horizons for your development!',
					thumbnailUrl: '/categories/learning.webp'
				},
				{
					title: 'Fortnite',
					slug: 'fortnite',
					description:
						'Immerse yourself in the vibrant and dynamic world of Fortnite! This category is dedicated to the most popular battle royale game where you can compete in thrilling battles, build unique structures, and engage in creative battles. Watch streams, participate in exciting battles, discuss strategies, and share your unique moments from the game. Join a community where everyone will find something to do - from creative battles to building unique structures within the Fortnite framework!',
					thumbnailUrl: '/categories/fortnite.webp'
				},
				{
					title: 'Counter-Strike',
					slug: 'counter-strike',
					description:
						'Welcome to the world of intense battles and strategic gameplay! This category is dedicated to the popular game Counter-Strike, where you can watch exciting matches, learn from the best players, and share your tactics. Join streams, discuss the latest updates, and compete with other players. Stay up to date with the most exciting moments and become part of the exciting cyber sports culture!',
					thumbnailUrl: '/categories/counter-strike.webp'
				},
				{
					title: 'Programming',
					slug: 'programming',
					description:
						'Open the door to the exciting world of code and technology! This category is dedicated to programming, where you can learn, share your experience and be inspired by new ideas. Follow streams dedicated to different programming languages, tools and project development. Participate in discussions, ask questions and get advice from experienced developers. Join a community where code becomes an art, and each line is a step towards your next achievement!',
					thumbnailUrl: '/categories/programming.webp'
				},
				{
					title: 'Dota 2',
					slug: 'dota-2',
					description:
						'Immerse yourself in the world of strategic battles and team games! This category is dedicated to Dota 2, where you can watch exciting matches, learn from the best players, and share your tactics. Join streams, discuss the latest updates, and compete with other players. Stay up to date with the most exciting moments and become part of the exciting cyber sports culture!',
					thumbnailUrl: '/categories/dota-2.webp'
				},
				{
					title: 'Music',
					slug: 'music',
					description:
						'Immerse yourself in the world of music, where each chord and rhythm fills the atmosphere with inspiration and emotions! This category is dedicated to all music lovers and musicians, where you can enjoy live performances, discover new genres, and share your experience with like-minded people. Join streams, discuss the latest releases and events in the music industry, and share your creations and games. Discover the amazing world of sounds, where each performance is a unique story waiting for its listener!',
					thumbnailUrl: '/categories/music.webp'
				},
				{
					title: 'League of Legends',
					slug: 'league-of-legends',
					description:
						'Immerse yourself in the world of epic battles and strategic gameplay! This category is dedicated to League of Legends, where you can watch exciting matches, learn from the best players, and share your tactics. Join streams, discuss the latest updates, and compete with other players. Stay up to date with the most exciting moments and become part of the exciting cyber sports culture!',
					thumbnailUrl: '/categories/league-of-legends.webp'
				},
				{
					title: 'Art',
					slug: 'art',
					description:
						'Immerse yourself in the world of art, where each stroke and color tells a unique story! This category is dedicated to all art lovers and creators, where you can watch live performances, discover new styles, and share your experience with like-minded people. Join streams, discuss the latest trends in the art world, and share your creations and projects. Discover the amazing world of art, where each creation is a unique story waiting for its audience!',
					thumbnailUrl: '/categories/art.webp'
				},
				{
					title: 'Valorant',
					slug: 'valorant',
					description:
						'Immerse yourself in the world of tactical battles and strategic gameplay! This category is dedicated to Valorant, where you can watch exciting matches, learn from the best players, and share your tactics. Join streams, discuss the latest updates, and compete with other players. Stay up to date with the most exciting moments and become part of the exciting cyber sports culture!',
					thumbnailUrl: '/categories/valorant.webp'
				},
				{
					title: 'Sport',
					slug: 'sport',
					description:
						'Immerse yourself in the exciting world of sports, where passion, competition and teamwork come together! This category is dedicated to all sports fans and athletes, where you can follow exciting matches, discuss team strategies, and share your experience with other fans. Join streams, follow the latest news and results, and find like-minded people for joint training and discussions. Discover the amazing world of sports, where each competition is an opportunity to showcase your skills and strive for victory!',
					thumbnailUrl: '/categories/sport.webp'
				},
				{
					title: 'PUBG',
					slug: 'pubg',
					description:
						'Immerse yourself in the thrilling world of PUBG, where survival and strategic gameplay come together! This category is dedicated to all PUBG fans, where you can watch exciting matches, learn from the best players, and share your tactics. Join streams, discuss the latest updates, and compete with other players. Stay up to date with the most exciting moments and become part of the exciting cyber sports culture!',
					thumbnailUrl: '/categories/pubg.webp'
				}
			]
		});

		Logger.log('Categories created successfully');

		const categories = await prisma.category.findMany();
		const categoriesBySlug = Object.fromEntries(
			categories.map(category => [category.slug, category])
		);

		const streamTitles = {
			minecraft: [
				'Playing Minecraft: survival',
				'Building epic buildings in Minecraft',
				'Minecraft mysteries: adventures begin!',
				'Creating a farm in Minecraft',
				'Killing the Ender Dragon!',
				'Exploring Minecraft dungeons',
				'Magic potions and charms in Minecraft',
				'Automating resource mining in Minecraft',
				'Fishing and hunting in Minecraft: collecting loot',
				'Crafting unique items in Minecraft'
			],
			'grand-theft-auto-v': [
				'Playing GTA 5 on 100%',
				'Races and tricks in GTA Online',
				'GTA 5 storyline: back in action!',
				'GTA V robberies: doing business',
				'Having fun in Los Santos',
				'Discovering secret locations in GTA 5',
				"Playing the 'Contract' mission in GTA Online",
				'GTA 5 police missions',
				'New car reviews and tuning in GTA Online',
				'Creating your own business in Los Santos'
			],
			rust: [
				'Raiding bases in Rust',
				'Survival in the wilderness: Rust',
				'New mechanics Rust: testing!',
				'From beginner to pro in Rust',
				'PvP battles in the Rust world',
				'Preparing raids in Rust: tactics and strategies',
				'Traps and defensive structures in Rust',
				'Searching for rare resources in Rust',
				'Exploring huge Rust maps',
				'Surviving in harsh conditions in Rust'
			],
			'cyberpunk-2077': [
				'Exploring Night City in Cyberpunk 2077',
				'Playing Cyberpunk 2077 story missions',
				'Modding and customization in Cyberpunk',
				'Weapon and hack: Cyberpunk combat tactics',
				'Agency missions in the future world',
				'Cyber implants: improving the character',
				'Exploring the world of corporate conspiracies',
				'Missions, fast network attacks',
				'Doing side quests in Cyberpunk 2077',
				'Reviewing game updates and additions'
			],
			'just-chatting': [
				'Talking to subscribers',
				'Answering questions: ask anything!',
				'Chill stream: talking about everything',
				'Your stories, our discussions',
				'Warm conversations and news',
				'Discussing the latest movies and series',
				'Music recommendations from viewers',
				'Your questions, our answers!',
				'Thinking about the future of technologies',
				'Trends in the gaming industry: discussing'
			],
			'red-dead-redemption-2': [
				'Adventures in the world of Red Dead Redemption 2',
				'Playing the RDR2 story',
				'Hunting and survival in RDR2',
				'Exploring RDR2',
				'Wild lands in RDR2',
				'Best missions in Red Dead Redemption 2',
				'Raid bandit gangs in Red Dead Redemption 2',
				'Red Dead Redemption 2',
				'Hiding in RDR2',
				'Traveling the world of the Wild West',
				'Trading and resource mining in RDR2',
				'Becoming bounty hunters in RDR2',
				'Reviewing legendary animals and trophies in RDR2'
			],
			learning: [
				'Learning the basics of photography',
				'How to become a master of public speaking',
				'Diving into the art of drawing',
				'Learning foreign languages',
				'Time management for productive life',
				'Learning the basics of cooking',
				'Learning the basics of financial literacy'
			],
			fortnite: [
				'Fortnite stream: royal battle!',
				'Fortnite construction secrets',
				'Best Fortnite tactics for victory',
				'Seasonal events in Fortnite: participating!',
				'Playing duos and squads in Fortnite',
				'Opening new skins in Fortnite',
				'How to win in Fortnite',
				'Fortnite challenges: completing!',
				'Fortnite battle pass review',
				'Training in construction and shooting'
			],
			'counter-strike': [
				'Heroes of Counter-Strike: strategy and',
				'Best moments in CS:GO',
				'CS:GO tactics',
				'Participating in CS:GO tournaments',
				'CS:GO maps review',
				'PvP battles in Counter-Strike',
				'Weapon and equipment selection in CS:GO',
				'CS:GO tactics for victory',
				'Competitive games: learning to win',
				'Cyber sports teams: following matches',
				'Participating in CS:GO training matches'
			],
			programming: [
				'Programming in JavaScript: from simple to complex',
				'Developing games on Python: step by step',
				'Creating web applications',
				'React: practical guide',
				'Learning to develop mobile applications',
				'Reviewing algorithms and data structures',
				'Automating development processes',
				'Debugging secrets',
				'Reviewing modern web frameworks'
			],
			'dota-2': [
				'Passing Dota 2: secrets of victory',
				'Dota 2 heroes review: choosing your strategy',
				'Preparing for a Dota 2 tournament',
				'Analyzing the best Dota 2 matches',
				'Tips for improving your Dota 2 game',
				'Support heroes: how to play correctly',
				'Macro-game secrets in Dota 2',
				'Controlling the map and roaming in Dota 2',
				'Playing as a carry: winning matches',
				'Secret victories in team battles'
			],
			music: [
				'Music trends: discussing hits',
				'Listening and discussing favorite albums',
				'Discussing music genres: what to listen to?',
				'Creating music together!',
				'Music challenges: participating!',
				'Reviewing music instruments: choosing your own',
				'Learning music trends 2024',
				'Music reactions: listening together',
				'Chill stream: listening to relaxing music',
				'Interactive playlist: choose tracks'
			],
			'league-of-legends': [
				'League of Legends: learning strategies',
				'Reviewing new updates in LoL',
				'Diving into League of Legends',
				'Tips for playing League of Legends',
				'Typing and tournaments in League of Legends',
				'Playing as support: how to be the best?',
				'Macro-game secrets in League of Legends',
				'Best team tactics for League of Legends',
				'Playing ranked games in League of Legends',
				'Reviewing new skins and events in League of Legends'
			],
			art: [
				'Drawing digital art live',
				'Drawing anime characters',
				'Traditional art: from sketches to completion',
				'Graphic design: basic techniques',
				'Drawing portraits from the basics',
				'Understanding color and composition',
				'Creative drawing workshop',
				'Landscape drawing techniques',
				'Using digital drawing tools',
				'Sharing art portfolio'
			],
			valorant: [
				'Valorant guide for beginners',
				'Deep Valorant strategy analysis',
				'Aim and movement training',
				'Review new agents in Valorant',
				'Valorant strategy: team fights',
				'Valorant tips and tricks',
				'Highlight plays analysis',
				'Using agent abilities',
				'Updating meta and new patches',
				'Valorant workshop: improving skills'
			],
			sport: [
				'Discussing sports events: latest news',
				'Sports training: secrets of success',
				'Best moments in the world of sports',
				'Sports challenges: participating!',
				'Reviewing sports games and events',
				'Maintaining our shape: tips and lifehacks',
				'Success stories of athletes: what is important to know?',
				'Discussing tactics and strategies for team sports'
			],
			pubg: [
				'PUBG survival guide: from basics to advanced',
				'PUBG movement and rotation strategy',
				'Optimal sensitivity setup guide',
				'Tips for looting and early game equipment',
				'Analyzing pro player combat phases',
				'PUBG squad strategy',
				'Improving recoil control in PUBG',
				'Workshop training aim and spray control',
				'Analyzing circle and late game strategy',
				'Tips for rank push and improving PUBG stats'
			]
		};

		const usernames = [
			'henry',
			'alex',
			'noah',
			'oliver',
			'james',
			'william',
			'lucas',
			'emma',
			'sophia',
			'mia',
			'charlotte',
			'amelia',
			'harper',
			'evelyn',
			'abigail',
			'ethan',
			'michael',
			'daniel',
			'david',
			'joseph',
			'jackson',
			'sebastian',
			'jack',
			'aiden',
			'owen',
			'samuel',
			'benjamin',
			'elijah',
			'theodore',
			'mateo',
			'isabella',
			'ava',
			'olivia',
			'sophia',
			'luna',
			'scarlett',
			'victoria',
			'elena',
			'grace',
			'zoe',
			'lily',
			'hannah',
			'layla',
			'chloe',
			'riley'
		];

		await prisma.$transaction(async tx => {
			for (const username of usernames) {
				const randomCategory =
					categoriesBySlug[
						Object.keys(categoriesBySlug)[
							Math.floor(
								Math.random() *
									Object.keys(categoriesBySlug).length
							)
						]
					];

				const userExists = await tx.user.findUnique({
					where: {
						username
					}
				});

				if (!userExists) {
					const createdUser = await tx.user.create({
						data: {
							email: `${username}@mysstream.vn`,
							password: await hash('12345678'),
							username,
							displayName: username,
							avatar: `/channels/${username}.webp`,
							isEmailVerified: true,
							socialLinks: {
								createMany: {
									data: [
										{
											title: 'Telegram',
											url: `https://t.me/${username}`,
											position: 1
										},
										{
											title: 'YouTube',
											url: `https://youtube.com/@${username}`,
											position: 2
										}
									]
								}
							}
						}
					});

					const randomTitles = streamTitles[randomCategory.slug];
					const randomTitle =
						randomTitles[
							Math.floor(Math.random() * randomTitles.length)
						];

					await tx.stream.create({
						data: {
							title: randomTitle,
							thumbnailUrl: `/streams/${createdUser.username}.webp`,
							user: {
								connect: {
									id: createdUser.id
								}
							},
							category: {
								connect: {
									id: randomCategory.id
								}
							}
						}
					});

					Logger.log(
						`User "${createdUser.username}" successfully created and his stream "${randomTitle}"`
					);
				}
			}
		});
		Logger.log('Database seeding completed successfully');
	} catch (error) {
		Logger.error(error);
		throw new BadRequestException('Error when seeding database');
	} finally {
		Logger.log('Closing database connection...');
		await prisma.$disconnect();
		Logger.log('Database connection closed successfully');
	}
}

main();
