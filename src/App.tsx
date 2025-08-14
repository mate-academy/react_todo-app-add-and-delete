/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { addTodos, deleteTodos, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoItem } from './components/TodoItem';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todoTitle, setTodoTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [currentSelect, setCurrentSelect] = useState('All');
  const [isLoading, setIsLoading] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState(-1);

  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.focus();
    }
  }, [todos, errorMessage]);

  useEffect(() => {
    setErrorMessage('');

    getTodos()
      .then(todosFromServer => {
        setTodos(todosFromServer);
      })
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(''), 3000);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [errorMessage]);

  const deleteTodo = (todoId: number) => {
    setErrorMessage('');
    setIsLoading(true);
    setIsDeletingId(todoId);

    deleteTodos(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => setErrorMessage('Unable to delete a todo'))
      .finally(() => {
        setIsLoading(false);
        setIsDeletingId(-1);
      });
  };

  const clearCompleted = () => {
    setErrorMessage('');
    setIsLoading(true);

    const completedTodos = todos.filter(todo => todo.completed);

    const deletePromises = completedTodos.map(todo =>
      deleteTodos(todo.id)
        .then(() => todo.id)
        .catch(() => {
          setErrorMessage('Unable to delete a todo');

          return null;
        }),
    );

    Promise.all(deletePromises)
      .then(deletedIds => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => !deletedIds.includes(todo.id)),
        );
      })
      .catch(() => setErrorMessage('Unable to delete some todos'))
      .finally(() => {
        setIsLoading(false);
      });
  };

  const addTodo = ({ userId, title, completed }: Omit<Todo, 'id'>) => {
    setErrorMessage('');
    setIsLoading(true);

    const temp = {
      id: 0,
      userId,
      title,
      completed,
    };

    setTempTodo(temp);

    addTodos(temp)
      .then(newTodo => {
        setTodos(prevTodos => [...prevTodos, newTodo]);
        setTodoTitle('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
      });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = todoTitle.trim();

    if (!trimmedTitle) {
      setErrorMessage('Title should not be empty');

      titleRef.current?.focus();

      return;
    }

    addTodo({ userId: 3308, title: trimmedTitle, completed: false });
  };

  const filteredTodos = todos.filter(todo => {
    if (currentSelect === 'Active') {
      return !todo.completed;
    }

    if (currentSelect === 'Completed') {
      return todo.completed;
    }

    return true;
  });

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          title={todoTitle}
          titleRef={titleRef}
          isLoading={isLoading}
          onSaveTitle={setTodoTitle}
          onSubmit={handleSubmit}
        />

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              isDeletingId={isDeletingId}
              onDeleteTodo={deleteTodo}
            />
          ))}

          {tempTodo && (
            <TodoItem
              key={tempTodo.id}
              todo={tempTodo}
              isDeletingId={isDeletingId}
              onDeleteTodo={deleteTodo}
              isLoading={isLoading}
            />
          )}
        </section>

        {/* Hide the footer if there are no todos */}
        {todos.length !== 0 && (
          <Footer
            todos={todos}
            currentSelect={currentSelect}
            onSelectStatus={setCurrentSelect}
            onClearCompleted={clearCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification
        errorMessage={errorMessage}
        onSaveErrorMessage={setErrorMessage}
      />
    </div>
  );
};
