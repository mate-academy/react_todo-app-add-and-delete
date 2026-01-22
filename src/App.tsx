/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { addTodos, deleteTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { FilterStatus } from './types/FilterStatus';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoList } from './components/TodoList';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<FilterStatus>('All');
  const [title, setTitle] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deleteTodoIds, setDeleteTodoIds] = useState<number[]>([]);

  useEffect(() => {
    setErrorMessage('');
    setLoading(true);

    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current && !loading) {
      inputRef.current.focus();
    }
  }, [loading]);

  const filteredTodos = todos.filter(todo => {
    if (filter === 'Active') {
      return !todo.completed;
    }

    if (filter === 'Completed') {
      return todo.completed;
    }

    return true;
  });

  const handleAddTodo = (event: React.FormEvent) => {
    event.preventDefault();

    const cleanTitle = title.trim();

    if (!cleanTitle) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setLoading(true);

    const tempTodoItem: Todo = {
      id: 0,
      userId: USER_ID,
      title: cleanTitle,
      completed: false,
    };

    setTempTodo(tempTodoItem);

    addTodos(cleanTitle)
      .then(newTodo => {
        setTodos(prev => [...prev, newTodo]);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        setLoading(false);
        setTempTodo(null);
      });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleDeleteTodo = (id: number) => {
    setDeleteTodoIds(prev => [...prev, id]);

    deleteTodo(id)
      .then(() => {
        setTodos(presentTodos => presentTodos.filter(todo => todo.id !== id));
        inputRef.current?.focus();
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setDeleteTodoIds(currentsIds =>
          currentsIds.filter(todoId => todoId !== id),
        );
      });
  };

  const handleClearCompleted = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        handleDeleteTodo(todo.id);
      }
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          title={title}
          setTitle={setTitle}
          handleAddTodo={handleAddTodo}
          loading={loading}
          setLoading={setLoading}
          inputRef={inputRef}
        />

        {todos.length > 0 && (
          <TodoList
            todos={filteredTodos}
            tempTodo={tempTodo}
            onDelete={handleDeleteTodo}
            deleteTodoIds={deleteTodoIds}
          />
        )}

        {todos.length > 0 && (
          <Footer
            todos={todos}
            filter={filter}
            setFilter={setFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
