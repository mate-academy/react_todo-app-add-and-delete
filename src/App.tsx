/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { Todo } from './types/Todo';
import { Error, Filter } from './utils/Enum';
import * as todoService from './api/todos';
import { TodoFooter } from './components/TodoFooter';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoError } from './components/TodoError';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [hasError, setHasError] = useState(Error.NOTHING);
  const [filterTodo, setFilterTodo] = useState(Filter.ALL);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingId, setLoadingId] = useState<null | number>(null);
  const [newTodo, setNewTodo] = useState<null | Todo>(null);

  const filteredTodos = useMemo(() => {
    switch (filterTodo) {
      case Filter.COMPLETED:
        return todos.filter(todo => todo.completed);

      case Filter.ACTIVE:
        return todos.filter(todo => !todo.completed);

      default:
        return todos;
    }
  }, [filterTodo, todos]);

  const deleteTodo = (todoId: number) => {
    setIsLoading(true);
    setLoadingId(todoId);

    todoService.deleteTodo(todoId)
      .then(() => setTodos(currentTodos => currentTodos
        .filter(todo => todo.id !== todoId)))
      .catch(() => setHasError(Error.DELETE))
      .finally(() => {
        setIsLoading(false);
        setLoadingId(null);
      });
  };

  useEffect(() => {
    todoService.getTodos(todoService.USER_ID)
      .then((data) => setTodos(data))
      .catch(() => setHasError(Error.FETCH));
  }, []);

  useEffect(() => {
    setIsActive(!!(!todos.find(todo => !todo.completed) && todos.length));

    if (todos.find(todo => todo.completed)) {
      setIsCompleted(true);
    }
  }, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          activeButton={isActive}
          setNewTodo={setNewTodo}
          setHasError={setHasError}
          setTodos={setTodos}
          todos={todos}
        />

        <TodoList
          filteredTodos={filteredTodos}
          onDelete={deleteTodo}
          isLoading={isLoading}
          loadingId={loadingId}
          newTodo={newTodo}
        />

        {todos.length > 0 && (
          <TodoFooter
            todos={todos}
            filterTodos={filterTodo}
            setFilterTodos={setFilterTodo}
            clearButton={isCompleted}
            onDelete={deleteTodo}
          />
        )}

        {hasError !== Error.NOTHING && (
          <TodoError
            hasError={hasError}
            setHasError={setHasError}
          />
        )}

      </div>
    </div>
  );
};
