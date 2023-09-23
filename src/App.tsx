/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { UserWarning } from './UserWarning';
import { NewTodo } from './components/NewTodo';
import { TodoList } from './components/TodoList';
import { Filter } from './components/Filter';
import { Errors } from './components/Errors';
import { TodosProvider } from './providers/TodosProvider/TodosProvider';
import { NewTodoProvider } from './providers/NewTodoProvider/NewTodoProvider';
import { ErrorsProvider } from './providers/ErrorsProvider/ErrorsProvider';

const USER_ID = 11524;

export const App: React.FC = () => {
  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <ErrorsProvider>
      <TodosProvider>
        <div className="todoapp">
          <h1 className="todoapp__title">todos</h1>

          <div className="todoapp__content">
            <NewTodoProvider>
              <NewTodo />
            </NewTodoProvider>

            <TodoList />

            {/* Hide the footer if there are no todos */}
            <Filter />

          </div>

          {/* Notification is shown in case of any error */}
          {/* Add the 'hidden' class to hide the message smoothly */}

          <Errors />

        </div>
      </TodosProvider>
    </ErrorsProvider>
  );
};
