/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
// import { getTodos, postTodo, USER_ID } from './api/todos';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import cn from 'classnames';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [filter, setFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const newTodoRef = useRef(newTodoTitle);

  useEffect(() => {
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => setErrorMessage(''), 3000);
      });
  }, []);

  const addTodo = (newTodo: Omit<Todo, 'id'>) => {
    setIsLoading(true);
    todoService
      .postTodo(newTodo)
      .then(addedTodo => {
        setTodos(currentTodos => [...currentTodos, addedTodo]);
        setNewTodoTitle('');
        // setTempTodo(null);
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        setNewTodoTitle(newTodoRef.current);
        // setTempTodo(null);
      })
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
      });
  };

  const deleteTodo = (userId: number) => {
    setIsLoading(true);
    todoService
      .deleteTodo(userId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== userId),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleEmptyLineError = (event: React.FormEvent) => {
    event.preventDefault();

    if (newTodoTitle.trim() === '') {
      setErrorMessage('Title should not be empty');
      setTimeout(() => setErrorMessage(''), 3000);

      return;
    }

    setTempTodo({
      id: 0,
      title: newTodoTitle.trim(),
      completed: false,
      userId: todoService.USER_ID,
    });

    // setTempTodo(tempTodo);
    newTodoRef.current = newTodoTitle;

    addTodo({
      userId: todoService.USER_ID,
      title: newTodoTitle,
      completed: false,
    });
  };

  const handleChangeNewTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      if (filter === 'active') {
        return !todo.completed;
      }

      if (filter === 'completed') {
        return todo.completed;
      }

      return true;
    });
  }, [todos, filter]);

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          newTodoTitle={newTodoTitle}
          isLoading={isLoading}
          handleChangeNewTitle={handleChangeNewTitle}
          handleEmptyLineError={handleEmptyLineError}
        />

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          deleteTodo={deleteTodo}
        />
        {!!todos.length && (
          <Footer todos={todos} onFilter={setFilter} filter={filter} />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
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
