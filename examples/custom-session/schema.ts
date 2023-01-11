import { list } from '@keystone-6/core';
import { checkbox, relationship, text, timestamp } from '@keystone-6/core/fields';
import { select } from '@keystone-6/core/fields';
import { Lists, Context } from '.keystone/types';

function hasSession({ context }: { context: Context }): boolean {
  return Boolean(context.session?.id);
}

function makeAccess(f: ({ context }: { context: Context }) => boolean) {
  return {
    operation: {
      query: f,
      create: f,
      update: f,
      delete: f,
    },
  };
}

const defaultAccess = makeAccess(hasSession);
const noAccess = makeAccess(() => false);

export const lists: Lists = {
  Post: list({
    fields: {
      title: text({ validation: { isRequired: true } }),
      status: select({
        type: 'enum',
        options: [
          { label: 'Draft', value: 'draft' },
          { label: 'Published', value: 'published' },
        ],
      }),
      content: text(),
      publishDate: timestamp(),
      author: relationship({ ref: 'User.posts', many: false }),
    },
    access: defaultAccess,
  }),
  User: list({
    fields: {
      name: text({ validation: { isRequired: true } }),
      posts: relationship({ ref: 'Post.author', many: true }),
    },
    access: defaultAccess,
  }),
  Session: list({
    fields: {
      //        token: password({ validation: { isRequired: true } }), // TODO
      token: text({
        isIndexed: 'unique',
        validation: { isRequired: true },
      }),
      user: relationship({ ref: 'User' }),
      ended: checkbox(),
    },
    access: noAccess,
  }),
};
