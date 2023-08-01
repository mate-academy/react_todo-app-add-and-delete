/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { NewTodo } from './components/NewTodo';
import { TodoList } from './components/TodoList';
import { Filter } from './components/Filter';
import { Notification } from './components/Notification';
import { Todo } from './types/Todo';
import { ErrorType } from './types/Error';
import { FilterTypes } from './types/Filter';
import { getTodos, deleteOnServer, updateOnServer } from './api/todos';

const USER_ID = 11133;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState(ErrorType.None);
  const [updatingTodos, setUpdatingTodos] = useState<number[]>([]);
  const [filter, setFilter] = useState<FilterTypes>(FilterTypes.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setError(ErrorType.Load));
  }, []);

  const filteredTodos = useMemo(() => (() => {
    const visibleTodos = [...todos];

    switch (filter) {
      case FilterTypes.Active:
        return visibleTodos.filter((todo) => !todo.completed);

      case FilterTypes.Completed:
        return visibleTodos.filter((todo) => todo.completed);

      default:
        return visibleTodos;
    }
  })(), [filter, todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const deleteTodo = (id: number) => {
    const updatedTodos = todos.filter((td) => td.id !== id);

    setUpdatingTodos([id]);
    deleteOnServer(id)
      .then(() => setTodos(updatedTodos))
      .catch(() => setError(ErrorType.Delete))
      .finally(() => {
        setUpdatingTodos([]);
      });
  };

  const updateTodo = (id: number, args: Partial<Todo>) => {
    const updatedTodos = todos.map((td) => {
      if (td.id === id) {
        return {
          ...td,
          ...args,
        };
      }

      return td;
    });

    setUpdatingTodos([id]);
    updateOnServer(id, args)
      .then(() => setTodos(updatedTodos))
      .catch(() => setError(ErrorType.Update))
      .finally(() => setUpdatingTodos([]));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <NewTodo
          userId={USER_ID}
          todos={todos}
          setTodos={setTodos}
          setError={setError}
          setUpdatingTodos={setUpdatingTodos}
          setTempTodo={setTempTodo}
        />

        {todos.length > 0 && (
          <TodoList
            todos={filteredTodos}
            updatingTodos={updatingTodos}
            tempTodo={tempTodo}
            deleteTodo={deleteTodo}
            updateTodo={updateTodo}
          />
        )}

        {todos.length > 0 && (
          <Filter
            todos={todos}
            setTodos={setTodos}
            filter={filter}
            setFilter={setFilter}
            setError={setError}
            setUpdatingTodos={setUpdatingTodos}
          />
        )}
      </div>

      {!ErrorType.None && <Notification error={error} setError={setError} />}
    </div>
  );
};
