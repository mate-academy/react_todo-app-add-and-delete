/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos, createTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { Filter } from './types/Filter';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TodoItem } from './components/TodoItem';

type ErrorType = keyof typeof errorMessages;

const errorMessages = {
  load: 'Unable to load todos',
  empty: 'Title should not be empty',
  add: 'Unable to add a todo',
  delete: 'Unable to delete a todo',
  update: 'Unable to update a todo',
};

const filterTodos = (todos: Todo[], filter: Filter): Todo[] => {
  switch (filter) {
    case Filter.active:
      return todos.filter(todo => !todo.completed);
    case Filter.completed:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [error, setError] = useState<ErrorType | null>(null);
  const [filter, setFilter] = useState<Filter>(Filter.all);
  const [inputText, setInputText] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setError('load'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [error]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filteredTodos = filterTodos(todos, filter);

  const handleAddTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTitle = inputText.trim();

    if (trimmedTitle === '') {
      setError('empty');

      return;
    }

    const newTodo: Omit<Todo, 'id'> = {
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo({
      id: 0,
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
    });

    setLoadingId(0);

    createTodo(newTodo)
      .then(createdTodo => {
        setTodos(prevTodos => [...prevTodos, createdTodo]);
        setTempTodo(null);
        setInputText('');
        setLoadingId(null);
      })
      .catch(() => {
        setError('add');
        setInputText(trimmedTitle);
        setTempTodo(null);
        setLoadingId(null);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDeleteTodo = (id: number) => {
    setLoadingId(id);
    deleteTodo(id)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
        if (inputRef.current) {
          inputRef.current.focus();
        }
      })
      .catch(() => setError('delete'))
      .finally(() => setLoadingId(null));
  };

  const handleClearCompleted = () => {
    const completedTodo = todos.filter(todo => todo.completed);

    completedTodo.forEach(todo => {
      deleteTodo(todo.id)
        .then(() => {
          setTodos(prevTodos => prevTodos.filter(t => t.id !== todo.id));
          if (inputRef.current) {
            inputRef.current.focus();
          }
        })
        .catch(() => setError('delete'));
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          inputText={inputText}
          setInputText={setInputText}
          handleAddTodo={handleAddTodo}
          loading={loading || loadingId !== null}
          inputRef={inputRef}
        />

        <TodoList
          filteredTodos={filteredTodos}
          handleDeleteTodo={handleDeleteTodo}
          loadingId={loadingId}
          loading={loading}
        />

        {tempTodo && (
          <div className="todoapp__temp-todo">
            <TodoItem
              todo={tempTodo}
              handleDeleteTodo={handleDeleteTodo}
              loadingId={0} // Показувати індикатор завантаження для тимчасового TodoItem
              loading={true} // Показувати індикатор завантаження для тимчасового TodoItem
            />
          </div>
        )}

        {todos.length > 0 && (
          <Footer
            todos={todos}
            setFilter={setFilter}
            filter={filter}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${error ? '' : 'hidden'}`}
      >
        <button data-cy="HideErrorButton" type="button" className="delete" />
        {Object.values(errorMessages)
          .filter(msg => errorMessages[error as ErrorType] === msg)
          .map((msg, index) => (
            <div key={index}>{msg}</div>
          ))}
      </div>
    </div>
  );
};
