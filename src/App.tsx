/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { createTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorMessage } from './components/ErrorMessage';
import { FilterStatus } from './types/FilterStatus';
import { ErrorMessageEnum } from './types/ErrorMessage';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterBy, setFilterBy] = useState<FilterStatus>(FilterStatus.All);
  const [title, setTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [activeTodoIds, setActiveTodoIds] = useState<number[]>([]);

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const hasCompletedTodos = todos.some(todo => todo.completed);

  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAdding && activeTodoIds.length === 0) {
      titleInputRef.current?.focus();
    }
  }, [isAdding, activeTodoIds]);

  useEffect(() => {
    setErrorMessage('');

    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessageEnum.Load);
      });
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timerId = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timerId);
  }, [errorMessage]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage(ErrorMessageEnum.Title);

      return;
    }

    setIsAdding(true);
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    });
    createTodo({ userId: USER_ID, title: trimmedTitle, completed: false })
      .then(todo => {
        setTodos(prevTodos => [...prevTodos, todo]);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage(ErrorMessageEnum.Add);
      })
      .finally(() => {
        setIsAdding(false);
        setTempTodo(null);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setActiveTodoIds(prevIds => [...prevIds, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorMessage(ErrorMessageEnum.Delete);
      })
      .finally(() => {
        setActiveTodoIds(prevIds => prevIds.filter(id => id !== todoId));
      });
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const completedTodosIds = completedTodos.map(todo => todo.id);

    setActiveTodoIds(prevIds => [...prevIds, ...completedTodosIds]);

    completedTodos.forEach(todo => {
      deleteTodo(todo.id)
        .then(() => {
          setTodos(prevTodos => prevTodos.filter(t => t.id !== todo.id));
        })
        .catch(() => {
          setErrorMessage(ErrorMessageEnum.Delete);
        })
        .finally(() => {
          setActiveTodoIds(prevIds => prevIds.filter(id => id !== todo.id));
        });
    });
  };

  const visibleTodos = todos.filter(todo => {
    switch (filterBy) {
      case FilterStatus.Active:
        return !todo.completed;

      case FilterStatus.Completed:
        return todo.completed;

      case FilterStatus.All:
      default:
        return true;
    }
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
          title={title}
          isAdding={isAdding}
          titleInputRef={titleInputRef}
          setTitle={setTitle}
          onSubmit={handleSubmit}
        />

        {(todos.length > 0 || tempTodo !== null) && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              activeTodoIds={activeTodoIds}
              onDelete={handleDeleteTodo}
            />

            <Footer
              activeTodosCount={activeTodosCount}
              hasCompletedTodos={hasCompletedTodos}
              filterBy={filterBy}
              setFilterBy={setFilterBy}
              onClearCompleted={handleClearCompleted}
            />
          </>
        )}
      </div>

      <ErrorMessage
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
