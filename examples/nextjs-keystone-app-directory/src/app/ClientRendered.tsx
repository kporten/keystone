'use client';
import React, { useEffect, useState } from 'react';
import { gql } from 'graphql-request';
import { client } from '../util/request';

export default function ClientRenderedContent() {
  const [users, setUsers] = useState<Array<{ id: string; name: string; email: string | null }>>([]);

  // Fetch users from REST api route
  useEffect(() => {
    const query = gql`
      {
        users {
          id
          name
          email
        }
      }
    `;

    client.request(query).then(data => {
      setUsers(data.users);
    });
  }, []);

  return (
    <div style={{ minHeight: '8rem' }}>
      <p>
        <strong>Users fetched from the browser (in useEffect())</strong>
      </p>
      {users.length ? (
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
      ) : (
        <div>loading...</div>
      )}
    </div>
  );
}
