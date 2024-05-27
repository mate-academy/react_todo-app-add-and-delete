import { FC, useEffect, useRef, useState } from 'react';

import { USER_ID, todoService } from './api/todos';
import { UserWarning } from './UserWarning';
import Footer from './components/Footer';
import Header from './components/Header';
import TodoList from './components/TodoList';

import { Status } from './types/Status';
import { Todo } from './types/Todo';

// const USER_ID = 664;

export const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<Status>('all');
  const [loadingTodosIds, setLoadingTodosIds] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();

    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timeout = setTimeout(() => setErrorMessage(''), 3000);

    return () => clearTimeout(timeout);
  }, [errorMessage]);

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  let visibleTodos = todos;

  if (selectedStatus === 'active') {
    visibleTodos = activeTodos;
  }

  if (selectedStatus === 'completed') {
    visibleTodos = completedTodos;
  }

  const addTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      setErrorMessage('Title should not be empty');

      return;
    }

    if (inputRef.current) {
      inputRef.current.disabled = true;
    }

    const newTodo = {
      title: normalizedTitle,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo({ ...newTodo, id: 0 });

    todoService
      .addTodo(newTodo)
      .then((resTodo: Todo) => {
        setTodos(currentTodos => [...currentTodos, resTodo]);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        if (inputRef.current) {
          inputRef.current.disabled = false;
        }

        setTempTodo(null);
        inputRef.current?.focus();
      });
  };

  const deleteTodo = (todoId: number) => {
    setLoadingTodosIds(current => [...current, todoId]);

    todoService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setLoadingTodosIds(current => current.filter(id => id !== todoId));
        inputRef.current?.focus();
      });
  };

  const deleteAllCompleted = () => {
    completedTodos.forEach(todo => deleteTodo(todo.id));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          ref={inputRef}
          addTodo={addTodo}
          title={title}
          setTitle={setTitle}
        />
        <TodoList
          todos={visibleTodos}
          selectedStatus={selectedStatus}
          deleteTodo={deleteTodo}
          tempTodo={tempTodo}
          loadingTodosIds={loadingTodosIds}
        />

        {todos.length > 0 && (
          <Footer
            activeTodosCount={activeTodos.length}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            deleteAllCompleted={deleteAllCompleted}
            clearAllVisible={completedTodos.length > 0}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${!errorMessage && 'hidden'}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};
