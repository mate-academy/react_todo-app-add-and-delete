/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { getTodos, postTodo, removeTodo } from './api/todos';
import { Todo } from './types/Todo';
import { TodosList } from './components/TodosList';
import { FilterType } from './types/FilterType';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { ErrorType } from './types/ErrorType';
import { ErrorNotification } from './components/ErrorNotification';

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
        case FilterType.Complited:
          setFilteredTodos(todos.filter(todo => todo.completed));
          break;
        default:
          setFilteredTodos(todos);
          break;
      }
    }
  }, [todos, query]);

  const returnError = () => {
    switch (error) {
      case ErrorType.EmptyTitle:
        return 'Title should not be empty';
      case ErrorType.UnableToDelete:
        return 'Unable to delete a todo';
      case ErrorType.UnableToLoad:
        return 'Unable to load todos';
      case ErrorType.UnableToUpdate:
        return 'Unable to update a todo';
      case ErrorType.UnableToAdd:
        return 'Unable to add a todo';
      default:
        return null;
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setError(null);
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [error]);

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

  const removeOneTodo = (id: number) => {
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

  const removeAllComplited = () => {
    const tmp = todos.filter(todo => todo.completed).map(todo => todo.id);

    setUpdatedTodosId(tmp);

    tmp.map(id => {
      removeOneTodo(id);
    });
  };

  const isClearAllCompletedActive = () => {
    return !todos.some(todo => todo.completed);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header inputRef={inputRef} handleSubmit={handleSubmit} />

        {filteredTodos && filteredTodos.length > 0 && (
          <TodosList
            todos={filteredTodos}
            tmpTodo={tmpTodo}
            updatedTodosId={updatedTodosId}
            removeOneTodo={removeOneTodo}
          />
        )}

        {todos && todos.length > 0 && (
          <Footer
            handleSetQuery={handleSetQuery}
            query={query}
            left={returnLeftNumber}
            isClearAllCompletedActive={isClearAllCompletedActive}
            removeAllComplited={removeAllComplited}
          />
        )}
      </div>
      <ErrorNotification
        error={error}
        returnError={returnError}
        setError={setError}
      />
    </div>
  );
};
