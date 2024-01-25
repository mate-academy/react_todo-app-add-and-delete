/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext } from 'react';
import { Errors } from '../../Errors';
import { Footer } from '../../Footer';
import { Query } from '../../Query';
import { TodosContext } from '../../TodoContext';
import { TodoList } from '../../TodoList';

export const TodoApp: React.FC = () => {
  const { todos } = useContext(TodosContext);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Query />
        {!!todos.length
          && (
            <>
              <TodoList />
              <Footer />
            </>
          )}
      </div>
      <Errors />
    </div>
  );
};
