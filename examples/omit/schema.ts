import { list } from '@keystone-6/core';
import { allOperations, allowAll, denyAll } from '@keystone-6/core/access';
import { text, relationship } from '@keystone-6/core/fields';
import type { Lists } from '.keystone/types';

const READ_ONLY = {
  operation: {
    // no creating, updating or deletiung
    ...allOperations(denyAll),

    // only reading
    query: allowAll
  }
}

export const lists: Lists = {
  Person: list({
    access: READ_ONLY,
    fields: {
      // the person's name, publicly visible
      name: text({ validation: { isRequired: true } }),
    },
  }),
  Nice: list({
    access: READ_ONLY,
    fields: {
      person: relationship({ ref: 'Person' }),
    },

    // this list is omitted completely, it won't be in the public GraphQL schema
    graphql: {
      omit: true
    }
  }),
  Naughty: list({
    access: READ_ONLY,
    fields: {
      person: relationship({
        ref: 'Person',

        // this field is omitted at the field level
        //   the public GraphQL schema will have a Naughty type, but it will only have an `id` field
        graphql: {
          omit: true
        }
      }),
    }
  }),
};
