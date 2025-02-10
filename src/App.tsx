/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import classNames from 'classnames';
import { FilterType } from './types/FilterType';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { TodoItem } from './components/TodoItem';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [updatingTodoId, setUpdatingTodoId] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>(FilterType.All);
  const [title, setTitle] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [disabled, setDisabled] = useState(false);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!errorMessage && inputRef.current) {
      inputRef.current.focus();
    }
  }, [errorMessage]);

  useEffect(() => {
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }, [errorMessage]);

  useEffect(() => {
    getTodos()
      .then(todosFromServer => {
        setTodos(todosFromServer);
        setErrorMessage('');
        inputRef.current?.focus();
      })
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  const toggleTodo = async (id: number) => {
    setUpdatingTodoId(id);
    const todoToUpdate = todos?.find(todo => todo.id === id);

    if (!todoToUpdate) {
      return;
    }

    try {
      await updateTodo(id, { completed: !todoToUpdate.completed });
      setTodos(prevTodos =>
        (prevTodos as Todo[]).map(todo =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo,
        ),
      );
    } catch {
      setErrorMessage('Unable to update a todo');
    } finally {
      setUpdatingTodoId(null);
    }
  };

  const changeFilter = (filterType: FilterType) => {
    setActiveFilter(filterType);
  };

  const handleFilter = (filterType: FilterType) => {
    switch (filterType) {
      case FilterType.All: {
        return todos;
      }

      case FilterType.Active: {
        return todos.filter(todo => !todo.completed);
      }

      case FilterType.Completed: {
        return todos?.filter(todo => todo.completed);
      }

      default: {
        return todos;
      }
    }
  };

  const filteredTodos = handleFilter(activeFilter);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (title.trim().length === 0) {
      setErrorMessage('Title should not be empty');

      return;
    }

    try {
      setDisabled(true);
      setTempTodo({ id: 0, userId: USER_ID, title: title, completed: false });
      const newTodo = await addTodo({
        userId: USER_ID,
        title: title.trim(),
        completed: false,
      });

      setTodos(prevTodos => [...prevTodos, newTodo]);
      setTitle('');
    } catch {
      setErrorMessage('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setDisabled(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingTodoIds(prevIds => [...prevIds, id]);
    try {
      await deleteTodo(id);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));

    } catch {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setDeletingTodoIds(prevIds => prevIds.filter(prevId => prevId !== id));
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  const handleDeleteCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const completedIds = completedTodos.map(todo => todo.id);

    setDeletingTodoIds(prevIds => [...prevIds, ...completedIds]);

    for (const id of completedIds) {
      await handleDelete(id);
    }

    setDeletingTodoIds(prevIds =>
      prevIds.filter(id => !completedIds.includes(id))
    );
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={filteredTodos}
          inputRef={inputRef}
          handleSubmit={handleSubmit}
          title={title}
          setTitle={setTitle}
          disabled={disabled}
        />
        <TodoList
          todos={filteredTodos}
          toggleTodo={toggleTodo}
          updatingTodoId={updatingTodoId}
          handleDelete={handleDelete}
          deletingTodoIds={deletingTodoIds}
        />
        {tempTodo && <TodoItem todo={tempTodo} />}

        {/* Hide the footer if there are no todos */}
        {(todos ?? []).length > 0 && (
          <Footer
            todos={todos}
            activeFilter={activeFilter}
            handleFilter={changeFilter}
            handleDeleteCompleted={handleDeleteCompleted}
            filteredTodos={filteredTodos}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
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
        {/* show only one message at a time */}
        {errorMessage}
        {/* <br />
        Title should not be empty
        <br />
        Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo */}
      </div>
    </div>
  );
};
