import type { ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { isDev } from 'src/shared/utils/is-dev.util';

export function getGraphQLConfig(
	configService: ConfigService
): ApolloDriverConfig {
	return {
		playground: isDev(configService), // enable playground in development
		path: configService.getOrThrow<string>('GRAPHQL_PREFIX'), // get graphql prefix
		autoSchemaFile: join(process.cwd(), 'src/core/graphql/schema.gql'), // auto schema file
		sortSchema: true, // sort schema
		context: ({ req, res }) => ({ req, res }), // context
		installSubscriptionHandlers: true // install subscription handlers
	};
}
