/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, deleteTodo, addTodo, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import Header from './components/Header/Header';
import TodoList from './components/TodoList/Todolist';
import Footer from './components/Footer/Footer';
import ErrorNotification from './components/Error/ErrorNotification';

export enum Filter {
  All = 'all',
  Completed = 'completed',
  Active = 'active',
}
export enum ErrorMessages {
  Load = 'Unable to load todos',
  Title = 'Title should not be empty',
  Add = 'Unable to add a todo',
  Delete = 'Unable to delete a todo',
  Update = 'Unable to update a todo',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<Filter>(Filter.All);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ErrorMessages | null>(null);
  const [title, setTitle] = useState('');
  const [loadingTodosIds, setLoadingTodosIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [inputEl, setInputEl] = useState<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessages.Load))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 3000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const inputRef = useRef<HTMLInputElement>(null);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = todos.filter(todo => {
    if (selectedFilter === 'active') {
      return !todo.completed;
    }

    if (selectedFilter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  const deleteTodoHandler = async (id: number) => {
    try {
      setLoadingTodosIds((prev: number[]) => [...prev, id]);
      await deleteTodo(id);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
      setTimeout(() => {
        // const input = document.querySelector<HTMLInputElement>('[data-cy="NewTodoField"]');
        inputEl?.focus();
      });
    } catch {
      setErrorMessage(ErrorMessages.Delete);
    } finally {
      setLoadingTodosIds((prev: number[]) =>
        prev.filter((loadingTodoId: number) => loadingTodoId !== id),
      );
    }
  };

  const handleClearCompleted = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        deleteTodoHandler(todo.id);
      }
    });
  };

  const handleSubmit = async (todoTitle: string) => {
    const normalizedTitle = todoTitle.trim();

    if (!normalizedTitle) {
      setErrorMessage(ErrorMessages.Title);

      return;
    }

    const newTemp: Todo = {
      id: 0,
      title: normalizedTitle,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(newTemp);
    setLoading(true);

    try {
      const newTodo = await addTodo({
        title: normalizedTitle,
        userId: USER_ID,
        completed: false,
      });

      setTodos(prevTodos => [...prevTodos, newTodo]);
      setTitle('');
    } catch {
      setErrorMessage(ErrorMessages.Add);
    } finally {
      setTempTodo(null);
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          loading={loading}
          newTitle={title}
          onChangeTitle={setTitle}
          onAdd={handleSubmit}
          setInputRef={setInputEl}
        />

        <TodoList
          visibleTodos={visibleTodos}
          deleteTodo={deleteTodoHandler}
          loadingIds={loadingTodosIds}
          tempTodo={tempTodo}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            todos={todos}
            filter={selectedFilter}
            changeFilter={setSelectedFilter}
            clearCompleted={handleClearCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification
        errorMessage={errorMessage}
        setError={setErrorMessage}
      />
    </div>
  );
};
