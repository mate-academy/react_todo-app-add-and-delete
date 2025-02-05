/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { deleteTodos, getTodos, postTodos } from './api/todos';
import { Todo } from './types/Todo';
import { USER_ID } from './api/todos';
import { ErrorMessange } from './component/ErrorMessange';
import { Status } from './types/statys';
import { TodoList } from './component/TodoList';
import { Footer } from './component/Footer';
import { TempTodo } from './component/TempTodo';
import { Header } from './component/Header';

export const App: React.FC = () => {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Status>(Status.ALL);
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [loadingTodoId, setLoadingTodoId] = useState<number[]>([]);

  const loadTodos = () => {
    getTodos()
      .then(setTodos)
      .catch(() => setError('Unable to load todos'));
  };

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    if (inputRef.current && tempTodo === null) {
      inputRef.current.focus();
    }
  }, [tempTodo]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setError('Title should not be empty');

      return;
    }

    setIsLoading(true);

    const newTempTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    setTempTodo(newTempTodo);

    postTodos(newTempTodo)
      .then(createdTodo => {
        setTodos(prevTodos => [...prevTodos, createdTodo]);
        setTitle('');
        setError('');
        inputRef.current?.focus();
      })
      .catch(() => {
        setError('Unable to add a todo');
        setTitle(title);
      })
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
      });
  };

  const handleDelete = (id: number) => {
    setLoadingTodoId(prev => [...prev, id]);
    setIsLoading(true);
    setError('');
    const todoDelete = todos.find(todo => todo.id === id);

    if (!todoDelete) {
      return;
    }

    deleteTodos(id)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
        setError('');
      })
      .catch(() => {
        setError('Unable to delete a todo');
      })
      .finally(() => {
        setIsLoading(false);
        setLoadingTodoId(prev => [...prev, id]);

        setTimeout(() => {
          inputRef.current?.focus();
        }, 3000);
      });
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    setIsLoading(true);
    setError('');

    completedTodos.forEach(todo => {
      handleDelete(todo.id);
    });

    setTimeout(() => {
      inputRef.current?.focus();
    }, 3000);
  };

  const toggleTodo = (id: number) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === Status.ACTIVE) {
      return !todo.completed;
    }

    if (filter === Status.COMPLETED) {
      return todo.completed;
    }

    return true;
  });

  const itemLeft = todos.filter(todo => !todo.completed).length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          handleSubmit={handleSubmit}
          title={title}
          handleTitleChange={handleTitleChange}
          isLoading={isLoading}
          inputRef={inputRef}
        />

        <TodoList
          filteredTodos={filteredTodos}
          toggleTodo={toggleTodo}
          handleDelete={handleDelete}
          loadingTodoId={loadingTodoId}
        />

        {tempTodo && <TempTodo tempTodo={tempTodo} />}

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            todos={todos}
            itemLeft={itemLeft}
            filter={filter}
            setFilter={setFilter}
            clearCompleted={handleClearCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorMessange message={error} onClose={() => setError('')} />
    </div>
  );
};
