/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Eror } from './components/ERROR';
import { getTodos, addTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { FilterBy } from './types/FilterEnum';

const USER_ID = 10387;

export enum Error {
  LOAD = 'load',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.All);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState(false);

  const visibleTodos = todos.filter((todo) => {
    switch (filterBy) {
      case FilterBy.Active:
        return !todo.completed;

      case FilterBy.Completed:
        return todo.completed;

      default:
        return true;
    }
  });

  const addError = (error: Error) => {
    setErrorMessage(error);
    window.setTimeout(() => {
      setErrorMessage(null);
    }, 3000);
  };

  useEffect(() => {
    const loadTodos = async () => {
      try {
        setErrorMessage(null);
        const todosFromServer = await getTodos(USER_ID);

        setTodos(todosFromServer);
      } catch (error) {
        addError(Error.LOAD);
      }
    };

    loadTodos();
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title) {
      setErrorMessage('Title cannot be empty');

      return;
    }

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo(newTodo);

    if (tempTodo) {
      addTodo(tempTodo)
        .then((response) => {
          setTodos([...todos, response]);
          setTitle('');
        })
        .catch(() => setErrorMessage('Unable to add a todo'))
        .finally(() => {
          setTempTodo(null);
        });
    }
  };

  const handleDelete = (id: number) => {
    setIsDeleting(true);

    deleteTodo(id)
      .then(() => {
        setTodos(todos.filter((todo) => todo.id !== id));
      })
      .catch(() => setErrorMessage('Unable to delete a todo'))
      .finally(() => setIsDeleting(false));
  };

  console.log(todos);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button type="button" className="todoapp__toggle-all active" />

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="todoapp__new-todo"
              value={title}
              placeholder="What needs to be done?"
              onChange={(event) => setTitle(event.target.value)}
            />
          </form>
        </header>

        <TodoList
          todos={visibleTodos}
          handleDelete={handleDelete}
          isDeleting={isDeleting}
        />

        <Footer
          todos={todos}
          visibleTodos={visibleTodos}
          filterBy={filterBy}
          setFilterBy={setFilterBy}
        />
      </div>

      {errorMessage
        && (
          <Eror
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
          />
        )}
    </div>
  );
};
