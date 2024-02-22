/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { TodosProvider } from './Store';
import { TodoApp } from './components/TodoApp/TodoApp';
// import classNames from 'classnames';
// import * as postService from './api/todos';
// import { UserWarning } from './UserWarning';
// import { Todo } from './types/Todo';
// import { Status } from './types/FilterStatus';
// import { getFilteredTodos } from './services/getFilteredTodos';
// import { wait } from './utils/fetchClient';
// import { ErrorMessages } from './types/ErrorMessages';
// import { TodoItem } from './components/TodoItem';
// import { Todolist } from './components/TodoList';

export const App: React.FC = () => {
  return (
    <TodosProvider>
      <TodoApp />
    </TodosProvider>
  );
};
