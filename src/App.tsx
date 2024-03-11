/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import { USER_ID, addTodo, deleteTodo, getTodos } from './api/todos';
import { TodoList } from './components/TodoList/TodoList';
import { Todo } from './types/Todo';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { Filter } from './types/Filter';
import { getTodoFilter } from './helpers/getTodofilter';
import { wait } from './utils/fetchClient';
import { TodoItem } from './components/TodoItem/TodoItem';

export const App: React.FC = () => {
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [addTodoId, setAddTodoId] = useState<number | null>(null);

  const visibleTodos = getTodoFilter(todos, filter);

  const itemsLeft = todos.filter(todo => !todo.completed).length;

  const hasCompleted = visibleTodos.some(todo => todo.completed);

  const inputRef = useRef<HTMLInputElement>(null);

  const hadleAddTodo = (event: React.FormEvent<HTMLFormElement>) => {
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
      userId: USER_ID,
    });

    const newTodo = {
      title: title.trim(),
      completed: false,
      userId: USER_ID,
    };

    addTodo(newTodo)
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

    deleteTodo(id)
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
    getTodos()
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

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          title={title}
          setTitle={setTitle}
          onSubmit={hadleAddTodo}
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

        {/* Hide the footer if there are no todos */}
        {todos.length !== 0 && (
          <Footer
            currentFilter={filter}
            setFilter={setFilter}
            itemsLeft={itemsLeft}
            handleClearCompletedTodo={handleClearCompletedTodo}
            hasCompleted={hasCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
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
