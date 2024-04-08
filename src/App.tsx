/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import * as todosService from './api/todos';
import { Filter } from './types/Filter';
import { Todo } from './types/Todo';
import { getTodoFilter } from './utils/getTodoFilter';
import { wait } from './utils/fetchClient';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { TodoItem } from './components/TodoItem';

export const App: React.FC = () => {
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [addTodoId, setAddTodoId] = useState<number | null>(null);

  const visibleTodos = getTodoFilter(todos, filter);

  const hasCompletedTodos = visibleTodos.some(todo => todo.completed);

  const items = todos.filter(todo => !todo.completed).length;

  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (title.trim().length === 0) {
      setErrorMessage('Title should not be empty');

      wait(3000).then(() => setErrorMessage(''));

      return;
    }

    setLoading(true);
    setAddTodoId(0);

    setTempTodo({
      id: 0,
      title: title.trim(),
      completed: false,
      userId: todosService.USER_ID,
    });

    const newTodo = {
      title: title.trim(),
      completed: false,
      userId: todosService.USER_ID,
    };

    todosService
      .addTodos(newTodo)
      .then(todo => {
        setTodos(prevTodos => [...prevTodos, todo]);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');

        return wait(3000).then(() => setErrorMessage(''));
      })
      .finally(() => {
        setLoading(false);
        setAddTodoId(null);
        setTempTodo(null);
      });
  };

  const handleDeleteTodo = (id: number) => {
    setLoading(true);
    setAddTodoId(id);

    todosService
      .deleteTodos(id)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        setAddTodoId(null);

        return wait(3000).then(() => setErrorMessage(''));
      })
      .finally(() => {
        setAddTodoId(null);
        setLoading(false);
      });
  };

  const handleClearCompletedTodo = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => {
      handleDeleteTodo(todo.id);
    });
  };

  useEffect(() => {
    todosService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');

        return wait(3000).then(() => setErrorMessage(''));
      });
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [tempTodo, todos]);

  if (!todosService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <>
      <div className="todoapp">
        <h1 className="todoapp__title">todos</h1>

        <div className="todoapp__content">
          <Header
            title={title}
            setTitle={setTitle}
            onSubmit={handleAddTodo}
            loading={loading}
            inputRef={inputRef}
          />

          <TodoList
            todos={visibleTodos}
            addTodoId={addTodoId}
            handleDeleteTodo={handleDeleteTodo}
          />

          {tempTodo && (
            <TodoItem
              todo={tempTodo}
              addTodoId={addTodoId}
              handleDeleteTodo={handleDeleteTodo}
            />
          )}

          {todos.length && (
            <Footer
              currentFilter={filter}
              setFilter={setFilter}
              items={items}
              handleClearCompletedTodo={handleClearCompletedTodo}
              hasCompletedTodos={hasCompletedTodos}
            />
          )}
        </div>

        <div
          data-cy="ErrorNotification"
          className={classNames(
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
    </>
  );
};
