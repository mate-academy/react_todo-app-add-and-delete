/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import classNames from 'classnames';
import { AddTodo } from './components/AddTodo/AddTodo';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { Filter } from './types/Filter';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(Filter.all);
  const [newTodo, setNewTodo] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loader, setLoader] = useState<number>(0);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleErrorMessage = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  useEffect(() => {
    inputRef.current?.focus();

    getTodos()
      .then(response => {
        setTodos(response);
        setErrorMessage('');
      })
      .catch(() => {
        handleErrorMessage('Unable to load todos');
      });
  }, []);

  const filteredTodos = todos.filter(todo => {
    if (filter === Filter.active) {
      return !todo.completed;
    }

    if (filter === Filter.completed) {
      return todo.completed;
    }

    return true;
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmiting(true);

    if (!newTodo.trim()) {
      handleErrorMessage('Title should not be empty');
      setIsSubmiting(false);
      inputRef.current?.focus();

      return;
    }

    const newTodoItem = {
      title: newTodo.trim(),
      userId: USER_ID,
      completed: false,
    };

    setTempTodo({ ...newTodoItem, id: 0 });

    addTodo(newTodoItem)
      .then(addedTodo => {
        setTodos(currentTodos => [...currentTodos, addedTodo]);
        setNewTodo('');
        setErrorMessage('');
      })
      .catch(() => handleErrorMessage('Unable to add a todo'))
      .finally(() => {
        setIsSubmiting(false);
        setTempTodo(null);
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      });
  };

  const handleDelete = (id: number) => {
    setLoader(id);
    setIsSubmiting(true);

    deleteTodo(id)
      .then(() => {
        setErrorMessage('');
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
      })
      .catch(e => {
        setTodos(currentTodos => currentTodos);
        handleErrorMessage('Unable to delete a todo');
        throw e;
      })
      .finally(() => {
        setLoader(0);
        setIsSubmiting(false);
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      });
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    Promise.allSettled(
      completedTodos.map(todo =>
        deleteTodo(todo.id).catch(() => {
          handleErrorMessage('Unable to delete a todo');

          return Promise.reject({ id: todo.id });
        }),
      ),
    )
      .then(response => {
        const failedIds = response
          .filter(r => r.status === 'rejected')
          .map(r => (r.reason as { id: number }).id);

        setTodos(currentTodos =>
          currentTodos.filter(
            todo => !todo.completed || failedIds.includes(todo.id),
          ),
        );
      })
      .catch(e => {
        handleErrorMessage('Unable to delete a todo');
        throw e;
      });

    inputRef.current?.focus();
  };

  const handleUpdate = (id: number, completed: boolean) => {
    setLoader(id);
    const updatedCompleted = !completed;

    updateTodo({ id, completed: updatedCompleted })
      .then(updatedTodo => {
        setTodos(prevTodos =>
          prevTodos.map(t =>
            t.id === updatedTodo.id ? { ...t, completed: updatedCompleted } : t,
          ),
        );
        setErrorMessage('');
      })
      .catch(() => {
        handleErrorMessage('Unable to update a todo');
      })
      .finally(() => {
        setLoader(0);
      });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <AddTodo
            inputRef={inputRef}
            newTodo={newTodo}
            setNewTodo={setNewTodo}
            isSubmiting={isSubmiting}
            handleSubmit={handleSubmit}
          />
        </header>

        <TodoList
          tempTodo={tempTodo}
          filteredTodos={filteredTodos}
          handleUpdate={handleUpdate}
          handleDelete={handleDelete}
          isSubmiting={isSubmiting}
          loader={loader}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length !== 0 && (
          <Footer
            todos={todos}
            filter={filter}
            setFilter={setFilter}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          !errorMessage && 'hidden',
        )}
      >
        <button data-cy="HideErrorButton" type="button" className="delete" />
        {errorMessage}
      </div>
    </div>
  );
};
