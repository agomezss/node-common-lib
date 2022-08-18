import * as jwt from 'jsonwebtoken';
import { Log } from '../logging/log';

const AUTH_AUDIENCE = process.env.AUTH_AUDIENCE;
const AUTH_CLIENT_PUBLIC_KEY = process.env.AUTH_CLIENT_PUBLIC_KEY;

const generatePolicy = (principalId, effect, resource) => {
	const authResponse: any = {};
	authResponse.principalId = principalId.split('|')[1] || '';
	if (effect && resource) {
		const policyDocument: any = {};
		policyDocument.Version = '2012-10-17';
		policyDocument.Statement = [];
		const statementOne: any = {};
		statementOne.Action = 'execute-api:Invoke';
		statementOne.Effect = effect;
		statementOne.Resource = resource;
		policyDocument.Statement[0] = statementOne;
		authResponse.policyDocument = policyDocument;
	}
	return authResponse;
};

export const getJwksPK = () => {
	const jsonJwks = JSON.parse(AUTH_CLIENT_PUBLIC_KEY);
	return certToPEM(jsonJwks.keys[0].x5c[0]);
}

export function certToPEM(cert) {
	cert = cert.match(/.{1,64}/g).join('\n');
	cert = `-----BEGIN CERTIFICATE-----\n${cert}\n-----END CERTIFICATE-----\n`;
	return cert;
}

export const jwtAuthHandler = (event, context, callback) => {

	if (!event.authorizationToken) {
		return callback('Unauthorized');
	}

	const tokenParts = event.authorizationToken.split(' ');
	const tokenValue = tokenParts[1];

	if (!(tokenParts[0].toLowerCase() === 'bearer' && tokenValue)) {
		return callback('Unauthorized');
	}

	const options = {
		audience: AUTH_AUDIENCE,
		algorithms: 'RS256'
	};

	try {
		const pk = getJwksPK();

		jwt.verify(tokenValue, pk, options, (verifyError, decoded) => {
			if (verifyError) {
				return callback('Unauthorized');
			}

			return callback(null, generatePolicy(decoded.sub, 'Allow', event.methodArn));
		});
	} catch (err) {
		return callback('Unauthorized');
	}
};