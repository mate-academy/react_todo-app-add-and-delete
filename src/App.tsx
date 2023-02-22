/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { useEffect, useState } from 'react';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { Notification } from './components/Notification';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import { filterTodos } from './utils/filterTodos';
import { Footer } from './components/Footer';
import { FilterBy } from './types/FilterBy';

const USER_ID = 6408;

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  // const [todo, setTodo] = useState<Todo>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState(FilterBy.all);
  const [isError, setIsError] = useState(false);
  const [typeError, setTypeError] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [tempTodos, setTempTodos] = useState<Todo[]>([]);

  const pushError = (message: string) => {
    setIsError(true);
    setTypeError(message);
    window.setTimeout(() => {
      setIsError(false);
    }, 3000);
  };

  const complitedTodos = todos.filter(t => t.completed);
  const countTodos = todos.length - complitedTodos.length;

  const getTodosFromServer = async () => {
    try {
      const todosFromServer = await getTodos(6408);

      setTodos(todosFromServer);
    } catch {
      pushError('upload');
    }
  };

  const addTodosOnServer = async () => {
    setIsDisabled(true);
    try {
      const todo = {
        id: 0,
        title: query,
        userId: USER_ID,
        completed: false,
      };

      setTempTodo(todo);

      await addTodo(USER_ID, query);
      await getTodosFromServer();

      setQuery('');
      setTempTodo(null);
    } catch {
      pushError('add');
      setQuery('');
    } finally {
      setIsDisabled(false);
    }
  };

  const deleteTodoFromServer = async (id: number) => {
    try {
      const selectTodo = todos.find(t => t.id === id);

      if (selectTodo) {
        setTempTodos((prev) => ([...prev,
          selectTodo]));
      }

      await deleteTodo(id);
      await getTodosFromServer();
    } catch {
      pushError('delete');
    } finally {
      setTempTodos([]);
    }
  };

  useEffect(() => {
    getTodosFromServer();
  }, []);

  const visibleData = filterTodos(todos, filterBy);

  const handlerSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!query) {
      return pushError('Title can\'t be empty');
    }

    return addTodosOnServer();
  };

  const removeAllComplited = () => {
    complitedTodos.map(t => deleteTodoFromServer(t.id));
  };

  const removeTodo = (id: number) => {
    deleteTodoFromServer(id);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          <button type="button" className="todoapp__toggle-all active" />

          {/* Add a todo on form submit */}
          <form onSubmit={(event) => handlerSubmit(event)}>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={query}
              onChange={((event) => setQuery(event.target.value))}
              disabled={isDisabled}

            />
          </form>
        </header>
        <TodoList
          todos={visibleData}
          tempTodo={tempTodo}
          tempTodos={tempTodos}
          removeTodo={removeTodo}
        />
        {/* Hide the footer if there are no todos */}
        {!!todos.length && (
          <Footer
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            countTodos={countTodos}
            isCompleted={!!complitedTodos.length}
            removeAllComplited={removeAllComplited}
          />
        )}

      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <Notification
        setIsError={setIsError}
        typeError={typeError}
        isError={isError}
      />
    </div>
  );
};
