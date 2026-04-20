import React from 'react';

export const UserWarning: React.FC = () => {
  return (
    <section className="notifications">
      <div className="notification is-danger is-light">
        Your userId is not specified in the api/todos.ts
      </div>
    </section>
  );
};
