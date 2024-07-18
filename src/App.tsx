/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { getTodos, postTodo, removeTodo } from './api/todos';
import { Todo } from './types/Todo';
import { TodosList } from './components/TodosList';
import { FilterType } from './types/FilterType';
import { Footer } from './components/Footer';
import { ErrorType } from './types/ErrorType';
import { ErrorNotification } from './components/ErrorNotification';
import { MyInput } from './components/Header';

export const App: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<ErrorType | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [query, setQuery] = useState<FilterType>(FilterType.All);
  const [tmpTodo, setTmpTodo] = useState<Omit<Todo, 'userId'> | null>(null);
  const [updatedTodosId, setUpdatedTodosId] = useState<number[]>([]);

  const downloadTodos = async () => {
    try {
      const tmp = await getTodos();

      setTodos(tmp);
      setFilteredTodos(tmp);
    } catch {
      setError(ErrorType.UnableToLoad);
    }
  };

  useEffect(() => {
    downloadTodos();
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (todos) {
      switch (query) {
        case FilterType.Active:
          setFilteredTodos(todos.filter(todo => !todo.completed));
          break;
        case FilterType.Completed:
          setFilteredTodos(todos.filter(todo => todo.completed));
          break;
        default:
          setFilteredTodos(todos);
          break;
      }
    }
  }, [todos, query]);

  const returnLeftNumber = () => {
    return todos.filter(todo => todo.completed != true).length;
  };

  const handleSetQuery = (passedQuery: FilterType) => {
    setQuery(passedQuery);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (inputRef.current?.value.trim()) {
      inputRef.current.disabled = true;
      setTmpTodo({
        title: inputRef.current.value.trim(),
        id: -1,
        completed: false,
      });

      postTodo(inputRef.current.value.trim())
        .then(response => {
          setTodos(prev => [...prev, response]);

          if (inputRef.current) {
            inputRef.current.value = '';
          }
        })
        .catch(() => setError(ErrorType.UnableToAdd))
        .finally(() => {
          if (inputRef.current) {
            inputRef.current.disabled = false;
            inputRef.current.focus();
          }

          setTmpTodo(null);
        });
    } else {
      setError(ErrorType.EmptyTitle);
    }
  };

  const handleRemoveTodoById = (id: number) => {
    setUpdatedTodosId(prev => [...prev, id]);

    removeTodo(id)
      .then(() => {
        setTodos(prev => prev.filter(el => el.id != id));
      })
      .catch(() => setError(ErrorType.UnableToDelete))
      .finally(() => {
        setUpdatedTodosId(prev => prev.filter(el => el != id));
        inputRef.current?.focus();
      });
  };

  const handleRemoveAllComplited = () => {
    const todosToRemoveIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setUpdatedTodosId(todosToRemoveIds);

    todosToRemoveIds.map(id => {
      handleRemoveTodoById(id);
    });
  };

  const deactivateClearAllButton = () => {
    return !todos.some(todo => todo.completed);
  };

  const isAllTodosCompleted = () => {
    return todos.every(todo => todo.completed);
  };

  const handleSetError = (errorType: ErrorType | null) => {
    setError(errorType);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <MyInput
          ref={inputRef}
          onSubmit={handleSubmit}
          isAllTodosCompleted={isAllTodosCompleted}
        />

        {filteredTodos && filteredTodos.length > 0 && (
          <TodosList
            todos={filteredTodos}
            tmpTodo={tmpTodo}
            updatedTodosId={updatedTodosId}
            onRemove={handleRemoveTodoById}
          />
        )}

        {todos && todos.length > 0 && (
          <Footer
            onSetQuery={handleSetQuery}
            query={query}
            left={returnLeftNumber}
            deactivateClearAllButton={deactivateClearAllButton}
            onRemoveAllComplited={handleRemoveAllComplited}
          />
        )}
      </div>
      <ErrorNotification error={error} onSetError={handleSetError} />
    </div>
  );
};
