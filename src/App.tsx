/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import cn from 'classnames';

import * as todoService from './api/todos';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Filter } from './types/Filter';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(Filter.all);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todosInProcess, setTodosInProcess] = useState<number[]>([]);

  useEffect(() => {
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => setErrorMessage(''), 3000);
      });
  }, []);

  const addTodo = ({ userId, title, completed }: Omit<Todo, 'id'>) => {
    setErrorMessage('');

    return todoService
      .postTodos({ userId, title, completed })
      .then(newTitle => {
        setTodos(currentTodo => [...currentTodo, newTitle]);
      })
      .catch(error => {
        setErrorMessage('Unable to add a todo');
        setTimeout(() => setErrorMessage(''), 3000);
        throw error;
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const deleteTodo = (postId: number) => {
    setTodosInProcess(currentIds => [...currentIds, postId]);

    return todoService
      .deleteTodos(postId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== postId),
        );
      })
      .catch(error => {
        setErrorMessage('Unable to delete a todo');
        setTimeout(() => setErrorMessage(''), 3000);
        throw error;
      })
      .finally(() => {
        setTodosInProcess(currentTodos =>
          currentTodos.filter(id => id !== postId),
        );
      });
  };

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      if (filter === Filter.active) {
        return !todo.completed;
      }

      if (filter === Filter.completed) {
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
          onErrorMessage={setErrorMessage}
          onSubmit={addTodo}
          setTempTodo={setTempTodo}
        />

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          onDelete={deleteTodo}
          todosInProcess={todosInProcess}
        />
        {todos.length !== 0 && (
          <Footer
            todos={todos}
            onFilter={setFilter}
            filter={filter}
            onDelete={deleteTodo}
          />
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
