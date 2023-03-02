import { config } from '@keystone-6/core';
import jwt from 'jsonwebtoken';
import type { JwtPayload, JwtHeader, SigningKeyCallback } from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { fixPrismaPath } from '../example-utils';
import { lists } from './schema';
import { Context, TypeInfo } from '.keystone/types';

const client = jwksClient({
  jwksUri: process.env.WELL_KNOWN_JWKS_URI || 'https://my.auth.endpoint.com/.well-known/jwks.json',
});
function getKey(header: JwtHeader, callback: SigningKeyCallback) {
  client.getSigningKey(header.kid, function (err, key) {
    if (!key) {
      callback(err);
      return;
    }
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

async function getSession({ context }: { context: Context }) {
  const authHeader = context?.req?.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return;
  }
  // Strip the 'Bearer ' from the header
  const token = authHeader.substring(7, authHeader.length);

  const decoded: JwtPayload = await new Promise((resolve, reject) =>
    jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
      if (err) {
        reject(new Error(err.message));
      }
      if (decoded && typeof decoded === 'object') {
        resolve(decoded);
      } else {
        reject(new Error('Invalid token'));
      }
    })
  );
  // Couldn't get a valid decoded token
  if (!decoded) {
    return;
  }

  const sudoContext = context.sudo();
  const item = await sudoContext.query.User.findOne({
    where: {
      subjectId: decoded.sub as string,
    },
    query: 'id name',
  });

  // No User found with this subjectId
  if (!item) return;

  // they have a session
  return {
    id: item.id,
    data: {
      id: item.id,
    },
  };
}

export default config<TypeInfo>({
  db: {
    provider: 'sqlite',
    url: process.env.DATABASE_URL || 'file:./keystone-example.db',

    // WARNING: this is only needed for our monorepo examples, dont do this
    ...fixPrismaPath,
  },
  lists,
  getSession,
});
