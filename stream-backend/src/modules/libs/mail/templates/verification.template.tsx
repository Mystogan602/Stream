import { Html, Head, Body, Section, Text, Tailwind, Preview, Heading, Link } from '@react-email/components';
import * as React from 'react';

const MAIL_LOGIN = process.env.MAIL_LOGIN;

interface VerificationTemplateProps {
    domain: string;
    token: string;
}

export function VerificationTemplate({ domain, token }: VerificationTemplateProps) {
    const verificationLink = `${domain}/account/verify?token=${token}`;

    return (
        <Html>
            <Head />
            <Preview>Account Verification</Preview>
            <Tailwind>
                <Body className='max-w-2xl mx-auto p-6 bg-slate-50'>
                    <Section className='text-center mb-8'>
                        <Heading className='text-3xl text-black font-bold'>Verify your email</Heading>
                        <Text className='text-base text-black'>
                            Thank you for registering in stream! To confirm your email address, please click the link below.
                        </Text>
                        <Link href={verificationLink} className='inline-flex justify-center items-center rounded-full text-sm font-medium text-white bg-[#18B9AE] px-5 py-2'>
                            Confirm email
                        </Link>
                    </Section>
                    <Section className='text-center mt-8'>
                        <Text className='text-gray-600'>
                            If you have any questions or difficulties, please do not hesitate to contact our support service at{' '}
                            <Link href={`mailto:${MAIL_LOGIN}`} className='text-[#18b9ae] underline'>
                                {MAIL_LOGIN}
                            </Link>
                            .
                        </Text>
                    </Section>
                </Body>
            </Tailwind>
        </Html>
    );
}
