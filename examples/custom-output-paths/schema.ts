import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';
import { text, timestamp } from '@keystone-6/core/fields';
import type { Lists } from '.keystone/types';

export const lists: Lists = {
  Post: list({
    access: allowAll,
    fields: {
      title: text({ validation: { isRequired: true } }),
      content: text(),
      publishDate: timestamp(),
    },
  })
};
