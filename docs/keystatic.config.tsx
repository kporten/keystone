import { collection, component, config, fields } from '@keystatic/core'

export default config({
  storage: {
    kind: 'github',
    repo: {
      owner: process.env.NEXT_PUBLIC_VERCEL_GIT_REPO_OWNER!,
      name: process.env.NEXT_PUBLIC_VERCEL_GIT_REPO_SLUG!,
    },
  },
  collections: {
    posts: collection({
      label: 'Posts',
      path: 'posts/*/',
      slugField: 'slug',
      schema: {
        title: fields.text({ label: 'Title' }),
        slug: fields.text({
          label: 'Slug',
          validation: { length: { min: 4 } },
        }),
        content: fields.document({
          label: 'Content',
          formatting: true,
          dividers: true,
          links: true,
          layouts: [
            [1, 1],
            [1, 1, 1],
            [2, 1],
            [1, 2, 1],
          ],
          componentBlocks: {
            something: component({
              label: 'Some Component',
              preview: () => null,
              schema: {},
            }),
          },
        }),
        authors: fields.array(fields.text({ label: 'Name' }), {
          label: 'Authors',
          itemLabel: (props) => props.value,
        }),
      },
    }),
  },
})
