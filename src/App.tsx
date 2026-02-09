/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { deleteTodos, getTodos, USER_ID } from './api/todos';
import { TodoList } from './components/TodoList';
import { TodoInput } from './components/TodoInput';
import { TodoFooter } from './components/TodoFooter';
import { Todo } from './types/Todo';
import { TodoErrors } from './components/TodoErrors';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [completedTodos, setCompletedTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loadingTodos, setLoadingTodos] = useState<number | null>(null);
  const [footerFilter, setFooterFilter] = useState<string>('all');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const submmitInputRef = useRef<HTMLInputElement>(null);

  const filteredTodos = useMemo(() => {
    if (footerFilter === 'all') {
      return todos;
    }

    return todos.filter(todo => {
      if (footerFilter === 'active') {
        return !todo.completed;
      } else {
        return todo.completed;
      }
    });
  }, [footerFilter, todos]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error(error);
        setErrorMessage('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    setCompletedTodos(todos.filter(todo => todo.completed === true));
  }, [todos]);

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  }, [errorMessage]);

  const handleTodoAdded = (todo: Todo) => {
    setTodos(currentTodos => [...currentTodos, todo]);
  };

  const handleErrorMessage = (error: string) => {
    setErrorMessage(error);
  };

  const handleCheckTodo = (id: number) => {
    setTodos(prev =>
      prev.map(todo => {
        if (todo.id === id) {
          return { ...todo, completed: !todo.completed };
        }

        return todo;
      }),
    );
  };

  const handleCheckAllTodos = () => {
    setTodos(prev =>
      prev.map(todo => {
        return { ...todo, completed: !todo.completed };
      }),
    );
  };

  const handleDeleteAllCompletedTodos = () => {
    setLoadingTodos(-1);

    Promise.all(
      todos
        .filter(todo => todo.completed)
        .map(todo =>
          deleteTodos(todo.id)
            .then(() => todo.id)
            .catch(() => setErrorMessage('Unable to delete a todo')),
        ),
    )
      .then(todosIdList => {
        setTodos(tds => tds.filter(t => !todosIdList.includes(t.id)));
      })
      .finally(() => {
        setLoadingTodos(null);
        setTimeout(() => {
          submmitInputRef.current?.focus();
        }, 0);
      });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">Todos</h1>

      <div className="todoapp__content">
        <TodoInput
          todos={todos}
          completedTodos={completedTodos}
          handleErrorMessage={handleErrorMessage}
          loadingTodos={loadingTodos}
          setLoadingTodos={setLoadingTodos}
          handleTodoAdded={handleTodoAdded}
          handleCheckAllTodos={handleCheckAllTodos}
          setTempTodo={setTempTodo}
          submmitInputRef={submmitInputRef}
        />

        <TodoList
          todos={filteredTodos}
          setTodos={setTodos}
          loadingTodos={loadingTodos}
          setLoadingTodos={setLoadingTodos}
          handleErrorMessage={handleErrorMessage}
          handleCheckTodo={handleCheckTodo}
          tempTodo={tempTodo}
          submmitInputRef={submmitInputRef}
        />

        {todos.length > 0 && (
          <TodoFooter
            todosCounter={todos.filter(todo => todo.completed === false)}
            footerFilter={footerFilter}
            setFooterFilter={setFooterFilter}
            completedTodos={completedTodos}
            handleDeleteAllTodos={handleDeleteAllCompletedTodos}
          />
        )}
      </div>

      {!loadingTodos && (
        <TodoErrors
          errorMessage={errorMessage}
          handleErrorMessage={handleErrorMessage}
        />
      )}
    </div>
  );
};
