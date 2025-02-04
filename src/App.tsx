/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import * as todoService from './api/todos';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Notification } from './components/Notification';
import { getPreparedTodos } from './utils/todoFilter';
import { Filter } from './types/Filter';
import classNames from 'classnames';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filterBy, setFilterBy] = useState(Filter.All);

  const [titleInput, setTitleInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingTodoId, setLoadingTodoId] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSubmitting]);

  const handleTitileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitleInput(event.target.value);
  };

  const completedTasks = todos.filter(todo => todo.completed);

  const todoCount = todos.length - completedTasks.length;

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    setIsSubmitting(true);

    const deletePromises = completedTodos.map(todo =>
      todoService
        .deleteTodos(todo.id)
        .then(() => todo.id)
        .catch(() => {
          setErrorMessage(prev => prev || 'Unable to delete a todo');

          return null;
        }),
    );

    Promise.allSettled(deletePromises).then(results => {
      const successfullyDeletedIds = results
        .filter(
          (result): result is PromiseFulfilledResult<number | null> =>
            result.status === 'fulfilled' && result.value !== null,
        )
        .map(result => result.value as number);

      setTodos(currentTodos =>
        currentTodos.filter(todo => !successfullyDeletedIds.includes(todo.id)),
      );

      setIsSubmitting(false);
    });
  };

  const preparedTodos = getPreparedTodos(todos, filterBy);

  function loadTodos() {
    setErrorMessage(null);
    setIsSubmitting(true);

    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => {
          setErrorMessage(null);
        }, 3000);
      })
      .finally(() => setIsSubmitting(false));
  }

  useEffect(loadTodos, []);

  const deleteTodoFromBase = (todoId: number) => {
    setLoadingTodoId(todoId);
    setIsSubmitting(true);
    setErrorMessage(null);

    return todoService
      .deleteTodos(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        setTimeout(() => setErrorMessage(null), 3000);
      })
      .finally(() => {
        setLoadingTodoId(prevId => (prevId === todoId ? null : prevId));
        setIsSubmitting(false);
      });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  function addTodoToBase({ userId, title, completed }: Todo) {
    setErrorMessage(null);
    setIsSubmitting(true);

    const tempId = Math.random() * 100000;
    const newTempTodo: Todo = { id: tempId, userId, title, completed };

    setTempTodo(newTempTodo);

    return todoService
      .createTodos({ userId, title, completed })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTempTodo(null);
        setLoadingTodoId(null);
      })
      .catch(error => {
        setErrorMessage('Unable to add a todo');
        setTimeout(() => setErrorMessage(null), 3000);
        setTempTodo(null);

        return Promise.reject(error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  const reset = () => {
    setTitleInput('');
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = titleInput.trim();

    if (!trimmedTitle) {
      setErrorMessage('Title should not be empty');
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);

      return;
    }

    const newTempTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setIsSubmitting(true);
    setTempTodo(newTempTodo);

    addTodoToBase(newTempTodo)
      .then(() => {
        reset();
        setErrorMessage(null);
      })

      .finally(() => {
        setIsSubmitting(false);
      });
  };

  function updateTodo(updatedTodo: Todo) {
    setErrorMessage(null);
    setLoadingTodoId(updatedTodo.id);

    return todoService
      .updateTodos(updatedTodo)
      .then(todo => {
        setTodos(currentTodos => {
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(
            todoItem => todoItem.id === updatedTodo.id,
          );

          newTodos.splice(index, 1, todo);

          return newTodos;
        });
        setLoadingTodoId(null);
      })
      .catch(error => {
        setErrorMessage(`Can't update a post`);
        throw error;
      });
  }

  const handleToggleChange = (todo: Todo) => {
    const newTodo = { ...todo, completed: !todo.completed };

    updateTodo(newTodo);
  };

  const allTodosCompleted = todos.map(todo => todo.completed).includes(false);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <TodoForm
            todos={todos}
            allTodosCompleted={allTodosCompleted}
            handleSubmit={handleSubmit}
            inputRef={inputRef}
            titleInput={titleInput}
            handleTitileChange={handleTitileChange}
            isSubmitting={isSubmitting}
            reset={reset}
          />
        </header>

        <TodoList
          loadingTodoId={loadingTodoId}
          preparedTodos={preparedTodos}
          errorMessage={errorMessage}
          handleToggleChange={handleToggleChange}
          deleteTodoFromBase={deleteTodoFromBase}
          isSubmitting={isSubmitting}
        />

        {tempTodo && (
          <>
            <div
              data-cy="Todo"
              className={classNames('todo', {
                completed: tempTodo.completed,
              })}
            >
              {/*eslint-disable-next-line jsx-a11y/label-has-associated-control*/}
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  value={tempTodo.id}
                  checked={tempTodo.completed}
                  onChange={() => handleToggleChange(tempTodo)}
                />
              </label>
              <span data-cy="TodoTitle" className="todo__title">
                {tempTodo.title}
              </span>
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => deleteTodoFromBase(tempTodo.id)}
                disabled={isSubmitting}
              >
                ×
              </button>

              <div data-cy="TodoLoader" className="modal overlay is-active">
                <div
                  className="
                            modal-background
                            has-background-white-ter"
                />
                <div className="loader" />
              </div>
            </div>
          </>
        )}

        {!errorMessage && (
          <Footer
            errorMessage={errorMessage}
            todos={todos}
            todoCount={todoCount}
            setFilterBy={setFilterBy}
            handleClearCompleted={handleClearCompleted}
            completedTasks={completedTasks}
            filterBy={filterBy}
          />
        )}
      </div>

      <Notification
        message={errorMessage}
        onClose={() => {
          setErrorMessage(null);
        }}
      />
    </div>
  );
};
