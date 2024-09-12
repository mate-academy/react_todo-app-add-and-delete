import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, deleteTodo, getTodos, postTodo } from './api/todos';
import { Todo } from './types/Todo';
import { FilterType } from './types/FilterTypes';
import { filterTodos } from './utils/helpers';
import { ErrorTypes } from './types/ErrorTypes';
import { Header } from './Components/Header';
import { Footer } from './Components/Footer';
import { ErrorNotification } from './Components/ErrorNotification';
import { TodoList } from './Components/TodoList';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState<FilterType>(FilterType.All);
  const [error, setError] = useState<string>('');
  const [value, setValue] = useState('');
  const [inputDisabled, setInputDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [todos, tempTodo]);

  const handleError = (errorMessage: ErrorTypes) => {
    setError(errorMessage);
    setTimeout(() => {
      setError('');
    }, 3000);
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .then(() => {
        if (isLoading.length > 0) {
          setIsLoading([]);
        }
      })
      .catch(() => {
        handleError(ErrorTypes.OneMessage);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removeTodo = (todoId: number) => {
    setIsLoading(prev => [...prev, todoId]);
    deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
        setIsLoading([]);
      })
      .catch(() => {
        setIsLoading([]);
        handleError(ErrorTypes.UnableToDelete);
      });
  };

  const addTodo = (title: string) => {
    const trimmedTitle = title.trim();

    setTempTodo({
      id: 0,
      title,
      completed: false,
      userId: USER_ID,
    });
    setIsLoading(prev => [...prev, 0]);
    postTodo(trimmedTitle)
      .then(savedTodo => {
        setTodos(prevTodos => [...prevTodos, savedTodo]);
        setValue('');
      })
      .catch(() => {
        handleError(ErrorTypes.UnableToAdd);
      })
      .finally(() => {
        setInputDisabled(false);
        setTempTodo(null);
        setIsLoading([]);
      });
  };

  const handleSubmit: (
    event: React.FormEvent<HTMLFormElement>,
  ) => void = event => {
    event.preventDefault();

    if (!value.trim()) {
      setError(ErrorTypes.TitleNotEmpty);
      setTimeout(() => {
        setError('');
      }, 3000);
    } else {
      setInputDisabled(true);
      addTodo(value.trim());
    }
  };

  const TodoDeleteButton = (todoId: number) => {
    removeTodo(todoId);
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const deleteCompleted = completedTodos.map(todo => removeTodo(todo.id));

    Promise.all(deleteCompleted).catch(() => {
      setError(ErrorTypes.UnableToDelete);
    });
  };

  const dismissError = () => {
    setError('');
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filteredTodos = filterTodos(todos, filterType);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          handleSubmit={handleSubmit}
          value={value}
          todos={todos}
          setValue={setValue}
          inputDisabled={inputDisabled}
          inputRef={inputRef}
        />
        <TodoList
          filteredTodos={filteredTodos}
          TodoDeleteButton={TodoDeleteButton}
          isLoading={isLoading}
          tempTodo={tempTodo}
        />

        {todos.length > 0 && (
          <Footer
            filterType={filterType}
            todos={todos}
            setFilterType={setFilterType}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>
      <ErrorNotification error={error} onDismiss={dismissError} />
    </div>
  );
};
