/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import TodoList from './components/TodoInfo/TodoList';
import TodoFooter from './components/Footer/TodoFooter';
import TodoError from './components/Error/TodoError';
import { SortType } from './enums/SortType';
import { useAppContextContainer } from './context/AppContext';
import TodoHeader from './components/Header/TodoHeader';

export const App: React.FC = () => {
  const { filterType, todos, error } = useAppContextContainer();

  const filteredTodos = todos?.filter(todo => {
    switch (filterType) {
      case SortType.ACTIVE:
        return !todo.completed;
      case SortType.COMPLETED:
        return todo.completed;
      default:
        return true;
    }
  });

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <TodoHeader />
        {filteredTodos && <TodoList todos={filteredTodos} />}
        {/* Hide the footer if there are no todos */}
        {todos && !!todos.length && <TodoFooter />}
      </div>
      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <TodoError error={error} />
    </div>
  );
};
