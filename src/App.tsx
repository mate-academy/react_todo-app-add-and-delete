/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todosService from './api/todos';
import { TodoHeader } from './components/TodoHeader/TodoHeader';
import { TodoList } from './components/TodoList/TodoList';
import { Todo } from './types/Todo';
import { TodoFilter } from './components/TodoFilter/TodoFilter';
import { Filters } from './components/Filters/Filters';
import { TodoError } from './components/TodoError/TodoError';
import { ErrorMessages } from './types/Error';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [currentFilter, setCurrentFilter] = useState(Filters.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processedId, setProcessedId] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!todosService.USER_ID) {
      return;
    }

    setErrorMessage(null);
    todosService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessages.UNABLE_TO_LOAD);
        setTimeout(() => setErrorMessage(null), 3000);
      });
  }, []);

  const handleCompletedStatus = (id: number) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo,
    );

    setTodos(updatedTodos);
  };

  const addTodo = (todo: Todo) => {
    setTodos(prevTodos => [...prevTodos, todo]);
  };

  function deleteTodo(id: number) {
    setProcessedId(ids => [...ids, id]);

    return todosService
      .deleteTodos(id)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.UNABLE_TO_DELETE);
        setTimeout(() => setErrorMessage(null), 3000);
      })
      .finally(() => setProcessedId([]));
  }

  const filteredTodos = useMemo(() => {
    switch (currentFilter) {
      case Filters.Active:
        return todos.filter(todo => !todo.completed);
      case Filters.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [currentFilter, todos]);

  if (!todosService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          onAdd={addTodo}
          setErrorMessage={setErrorMessage}
          setTempTodo={setTempTodo}
        />

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          handleCompletedStatus={handleCompletedStatus}
          onDelete={deleteTodo}
          processedIds={processedId}
        />

        {!!todos.length && (
          <TodoFilter
            filter={currentFilter}
            setFilter={setCurrentFilter}
            onDelete={deleteTodo}
            todos={todos}
          />
        )}
      </div>

      <TodoError
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
