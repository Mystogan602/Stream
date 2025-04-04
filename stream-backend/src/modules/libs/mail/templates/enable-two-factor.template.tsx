import * as React from 'react';
import { Html, Head, Body, Section, Text, Tailwind, Preview, Heading, Link } from '@react-email/components';

const MAIL_LOGIN = process.env.MAIL_LOGIN;

interface EnableTwoFactorTemplateProps {
    domain: string
}

export function EnableTwoFactorTemplate({ domain }: EnableTwoFactorTemplateProps) {
    const settingsLink = `${domain}/dashboard/settings`;

    return (
        <Html>
            <Head />
            <Preview>Protect your account with two-factor authentication</Preview>
            <Tailwind>
                <Body className='max-w-2xl mx-auto p-6 bg-slate-50'>
                    <Section className="text-center mb-8">
                        <Heading className="text-3xl text-black font-bold">
                            Protect your account with two-factor authentication
                        </Heading>
                        <Text className="text-black text-base mt-2">
                            Enable two-factor authentication to increase the security of your account.
                        </Text>
                    </Section>

                    <Section className="bg-white rounded-lg shadow-md p-6 text-center mb-6">
                        <Heading className="text-2xl text-black font-semibold">
                            Why is this important?
                        </Heading>
                        <Text className="text-base text-black mt-2">
                            Two-factor authentication adds an extra layer of security by requiring a code only you know.
                        </Text>
                        <Link
                            href={settingsLink}
                            className="inline-flex justify-center items-center text-sm font-medium text-white bg-[#18B9AE] px-5 py-2 rounded-full"
                        >
                            Go to account settings
                        </Link>
                    </Section>

                    <Section className="text-center mt-8">
                        <Text className="text-gray-600">
                            If you have any questions, please contact the support team at{' '}
                            <Link
                                href={`mailto:${MAIL_LOGIN}`}
                                className="text-[#18b9ae] underline"
                            >
                                {MAIL_LOGIN}
                            </Link>
                        </Text>
                    </Section>
                </Body>
            </Tailwind>
        </Html>
    );
}
