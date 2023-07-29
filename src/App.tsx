/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { TodoNotification } from './components/TodoNotification';
import { Error, Filter, Todo } from './types/Todo';
import * as todosService from './api/todos';

export const USER_ID = 11041;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [hasError, setHasError] = useState(Error.NOTHING);
  const [filterTodos, setFilterTodos] = useState(Filter.ALL);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isNewTodoLoading, setIsNewTodoLoading] = useState(false);

  const filteredTodos = useMemo(() => {
    switch (filterTodos) {
      case Filter.COMPLETED:
        return todos.filter(todo => todo.completed);
      case Filter.ACTIVE:
        return todos.filter(todo => !todo.completed);
      default:
        return todos;
    }
  }, [filterTodos, todos]);

  const deleteCompletedTodos = () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const uncompletedTodos = todos.filter(todo => !todo.completed);

    completedTodos.forEach(todo => {
      todosService.deleteTodos(todo.id);
    });

    setTodos(uncompletedTodos);
  };

  useEffect(() => {
    todosService.getTodos(USER_ID)
      .then((data) => setTodos(data))
      .catch(() => setHasError(Error.FETCH));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          setTodos={setTodos}
          tempTodo={tempTodo}
          setTempTodo={setTempTodo}
          setLoading={setIsNewTodoLoading}
          setHasError={setHasError}
        />
        <TodoList
          todos={todos}
          setTodos={setTodos}
          tempTodo={tempTodo}
          setHasError={setHasError}
          isNewTodoLoading={isNewTodoLoading}
          filteredTodos={filteredTodos}
        />

        {todos.length !== 0 && (
          <TodoFooter
            todos={todos}
            filterTodos={filterTodos}
            setFilterTodos={setFilterTodos}
            deleteCompletedTodos={deleteCompletedTodos}
          />
        )}
      </div>

      {hasError !== Error.NOTHING && (
        <TodoNotification
          hasError={hasError}
          setHasError={setHasError}
        />
      )}
    </div>
  );
};
