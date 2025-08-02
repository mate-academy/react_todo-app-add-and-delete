/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todoServise from './api/todos';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter/';
import { ErrorNotification } from './components/ErrorNotification';
import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';
import { ErrorMessage } from './types/ErrorMessage';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [error, setError] = useState<ErrorMessage | null>(null);
  const [filtering, setFiltering] = useState<FilterType>(FilterType.all);

  const [isInput, setIsInput] = useState(false);
  const [processingTodos, setProcessingTodos] = useState<number[]>([]);
  const [query, setQuery] = useState('');

  const field = useRef<HTMLInputElement>(null);
  const returnFocus = () => setTimeout(() => field.current?.focus(), 50);

  const handleSetQuery = (title: string) => {
    setQuery(title);
  };

  const handleAddTodo = (createdTodo: Todo) => {
    setTempTodo(createdTodo);
    setError(null);
    setIsInput(true);

    const { title, completed, userId } = createdTodo;

    todoServise
      .createTodos({ title, completed, userId })
      .then(newTodo => {
        setTodos(currentTodo => [...currentTodo, newTodo]);

        if (tempTodo === null) {
          setQuery('');
        }
      })
      .catch(() => setError(ErrorMessage.AddTodos))
      .finally(() => {
        setTempTodo(null);
        setIsInput(false);

        returnFocus();
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setProcessingTodos(currentIds => [...currentIds, todoId]);

    return todoServise
      .deleteTodos(todoId)
      .then(() =>
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        ),
      )
      .catch(() => setError(ErrorMessage.DeleteTodos))
      .finally(() => {
        setProcessingTodos(currentIds =>
          currentIds.filter(id => id !== todoId),
        );

        returnFocus();
      });
  };

  const handleSetFilter = (value: FilterType) => {
    setFiltering(value);
  };

  const handleClearCompleted = () => {
    [...todos]
      .filter(todo => todo.completed)
      .forEach(todo => {
        setProcessingTodos(currentIds => [...currentIds, todo.id]);

        todoServise
          .deleteTodos(todo.id)
          .then(() =>
            setTodos(currentTodos =>
              currentTodos.filter(prevTodo => prevTodo.id !== todo.id),
            ),
          )
          .catch(() => setError(ErrorMessage.DeleteTodos))
          .finally(() => {
            setProcessingTodos(currentIds =>
              currentIds.filter(id => id !== todo.id),
            );

            returnFocus();
          });
      });
  };

  const handleSetError = (newError: ErrorMessage) => {
    setError(newError);
  };

  const handleRemoveError = () => {
    setError(null);
  };

  useEffect(() => {
    if (!todoServise.USER_ID) {
      return;
    }

    setError(null);
    field.current?.focus();

    todoServise
      .getTodos()
      .then(setTodos)
      .catch(() => setError(ErrorMessage.LoadTodos));
  }, []);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = setTimeout(() => {
      setError(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [error]);

  if (!todoServise.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <TodoHeader
          onAdd={handleAddTodo}
          onError={handleSetError}
          onFocus={field}
          isInput={isInput}
          query={query}
          setQuery={handleSetQuery}
        />
        <TodoList
          processingTodos={processingTodos}
          todos={todos}
          filterValue={filtering}
          onDelete={handleDeleteTodo}
          tempTodo={tempTodo}
        />
        {todos.length !== 0 && (
          <TodoFooter
            todos={todos}
            filterValue={filtering}
            setFilter={handleSetFilter}
            onClear={handleClearCompleted}
          />
        )}
      </div>
      <ErrorNotification Error={error} onClose={handleRemoveError} />
    </div>
  );
};
