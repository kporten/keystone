import { config } from '@keystone-6/core';
import { statelessSessions } from '@keystone-6/auth/session';
import { createAuth } from '@keystone-6/auth';
import { fixPrismaPath } from '../example-utils';
import { lists } from './schema';

import { isSignedIn } from './access';

const sessionSecret = '-- DEV COOKIE SECRET; CHANGE ME --';
const sessionMaxAge = 60 * 60 * 24 * 30; // 30 days
const sessionConfig = {
  maxAge: sessionMaxAge,
  secret: sessionSecret,
  /* This loads the related role for the current user, including all permissions */
  data: `
    name role {
      id
      name
      canCreateTodos
      canManageAllTodos
      canSeeOtherPeople
      canEditOtherPeople
      canManagePeople
      canManageRoles
    }`,
};

const { withAuth } = createAuth({
  listKey: 'Person',
  identityField: 'email',
  secretField: 'password',
  initFirstItem: {
    fields: ['name', 'email', 'password'],
    itemData: {
      /*
        This creates a related role with full permissions, so that when the first user signs in
        they have complete access to the system (without this, you couldn't do anything)
      */
      role: {
        create: {
          name: 'Admin Role',
          canCreateTodos: true,
          canManageAllTodos: true,
          canSeeOtherPeople: true,
          canEditOtherPeople: true,
          canManagePeople: true,
          canManageRoles: true,
        },
      },
    },
  },
  sessionStrategy: statelessSessions(sessionConfig),
});

export default withAuth(
  config({
    db: {
      provider: 'sqlite',
      url: process.env.DATABASE_URL || 'file:./keystone-example.db',

      // WARNING: this is only needed for our monorepo examples, dont do this
      ...fixPrismaPath,
    },
    lists,
    ui: {
      // TODO: isSignedIn is the default, a better example would be limiting users
      // isAccessAllowed: canViewAdminUI,

      /* Everyone who is signed in can access the Admin UI */
      isAccessAllowed: isSignedIn,
    },
  })
);
