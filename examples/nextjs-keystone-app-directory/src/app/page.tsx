import React from 'react';
import { keystoneContext } from '../keystone/context';
import { Header } from '../components/Header';
import ClientRenderedContent from './ClientRendered';

export default async function HomePage() {
  /*
    `keystoneContext` object doesn't have user's session information.
    You need an authenticated context to CRUD data behind access control.
    keystoneContext.withRequest(req, res) automatically unwraps the session cookie
    in the request object and gives you a `context` object with session info
    and an elevated sudo context to bypass access control if needed (context.sudo()).
  */
  // TODO: make the this a context with the session info
  const users = await keystoneContext.query.User.findMany({
    query: 'id name email',
  });
  return (
    <div
      style={{
        padding: '0 2rem',
      }}
    >
      <Header />
      <main style={{ display: 'flex', justifyContent: 'center' }}>
        <section>
          <h1>Keystone 🤝 Next.js</h1>
          <ul>
            <li>
              If you are <strong>not logged in</strong>, you can <strong>only see the name</strong>{' '}
              of all users in the database.
            </li>
            <li>
              User.email is behind access control and only visible for logged in users. Once you{' '}
              <strong>log in</strong>, you can <strong>see both the name and email</strong> of all
              users in the database.
            </li>
          </ul>

          <div>
            <p>
              <strong>Users fetched from the server</strong>
            </p>
            <ol>
              {users.map(u => {
                return (
                  <li key={u.id}>
                    <span>{u.name} </span>
                    {u.email ? (
                      <span>(email: {u.email})</span>
                    ) : (
                      <span>(email: not authenticated)</span>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>
          <ClientRenderedContent />

          <h2>How does it work?</h2>

          <p>
            Keystone's APIs can be seamlessly composed to work as a powerful data engine within
            Next.js applications without having to host a separate Keystone server. This is made
            possible by Keystone&apos;s `getContext` API.
          </p>
          <ul>
            <li>
              <strong>CRUD data within your Next.js server:</strong> You can use the Keystone data
              APIs directly in Next.js `getStaticProps` or `getServerSideProps` to CRUD data. ⚡️
            </li>
            <li>
              <strong>CRUD data from browser:</strong> You can use the generated Keystone GraphQL
              schema to setup your own GraphQL server in a Next.js route. This enables you to send
              GraphQL requests from the browser. 🤯
            </li>
          </ul>
          <p>
            <em>
              Note: Since you are not starting the keystone server, the Admin UI will not be
              available. You can host Keystone as a separate server if you need Admin UI.
            </em>
          </p>
          <p>
            <a href="https://github.com/keystonejs/keystone/tree/main/examples/nextjs-keystone">
              Check out the example in the repo more info.
            </a>
          </p>
        </section>
      </main>
    </div>
  );
}
