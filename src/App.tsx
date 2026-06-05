/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useRef } from 'react';
import clsx from 'clsx';

import {
  USER_ID,
  getTodos,
  addTodos,
  deleteTodos,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';

import { Header } from './components/header';
import { TodoItem } from './components/todo';
import { Footer } from './components/footer';

export type FilterParams = 'All' | 'Active' | 'Completed';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<FilterParams>('All');

  const [inProcess, setInProcess] = useState(false);
  const [targetId, setTargetId] = useState<number[]>([]);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  let countUnCompletedTodos = 0;

  function handleErrorMessage(message: string) {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setErrorMessage(message);

    timerRef.current = setTimeout(() => setErrorMessage(''), 3000);
  }

  useEffect(() => {
    getTodos()
      .then(value => {
        setTodos(value);
      })
      .catch(() => {
        handleErrorMessage('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    if (!inProcess) {
      inputRef.current?.focus();
    }
  }, [inProcess]);

  function deleteTodo(todoID: number) {
    if (inProcess) {
      return;
    }

    setInProcess(true);

    setTargetId(currentTargetIds => [...currentTargetIds, todoID]);

    deleteTodos(todoID)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoID),
        );
      })
      .catch(() => handleErrorMessage('Unable to delete a todo'))
      .finally(() => {
        setTargetId([]);
        setInProcess(false);
      });
  }

  function handleClearComplited() {
    const completedTodos = todos.filter(todo => todo.completed);

    setTargetId(completedTodos.map(todo => todo.id));

    setInProcess(true);

    Promise.allSettled(completedTodos.map(todo => deleteTodos(todo.id)))
      .then(results => {
        const isSend = results.map((result, index) => {
          if (result.status === 'fulfilled') {
            return completedTodos[index].id;
          }

          return;
        });

        setTodos(currentTodos => {
          return currentTodos.filter(todo => !isSend.includes(todo.id));
        });

        results.forEach(result => {
          if (result.status === 'rejected') {
            handleErrorMessage('Unable to delete a todo');
          }
        });
      })
      .finally(() => {
        setTargetId([]);
        setInProcess(false);
      });
  }

  function createTodo() {
    const temporaryTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo(temporaryTodo);

    const newItem: Omit<Todo, 'id'> = {
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    return addTodos(newItem)
      .then(response => {
        setTodos(currentTodos => [...currentTodos, response]);
        setTitle('');
        setTempTodo(null);
      })
      .catch(() => handleErrorMessage('Unable to add a todo'))
      .finally(() => {
        setTempTodo(null);
      });
  }

  function updateState(currentTodo: Todo) {
    const newItem: Todo = {
      ...currentTodo,
      completed: !currentTodo.completed,
    };

    setTargetId([newItem.id]);

    updateTodo(newItem.id, newItem)
      .then(() => {
        setTodos(currentTodos => {
          return currentTodos.map(todo => {
            if (todo.id === newItem.id) {
              return newItem;
            }

            return todo;
          });
        });
      })
      .catch(() => setErrorMessage('Unable to update a todo'))
      .finally(() => setTargetId([]));
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (inProcess) {
      return;
    }

    if (title.trim() === '') {
      handleErrorMessage('Title should not be empty');

      return;
    }

    setInProcess(true);

    createTodo().then(() => setInProcess(false));
  };

  const visibleTodos = todos.filter(todo => {
    if (!todo.completed) {
      countUnCompletedTodos++;
    }

    if (filter === 'Active') {
      return todo.completed === false;
    }

    if (filter === 'Completed') {
      return todo.completed === true;
    }

    return true;
  });

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          title={title}
          changeTitle={value => setTitle(value)}
          inputRef={inputRef}
          inProcess={inProcess}
          onSubmit={e => handleSubmit(e)}
        />

        <section className="todoapp__main" data-cy="TodoList">
          {todos.length !== 0 &&
            visibleTodos.map(todo => {
              return (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  deleteTodo={target => deleteTodo(target)}
                  targetId={targetId}
                  setCompleted={updateState}
                />
              );
            })}

          {tempTodo && (
            <div key={tempTodo.id} data-cy="Todo" className="todo">
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={tempTodo.completed}
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                {tempTodo.title}
              </span>

              {/* Remove button appears only on hover */}
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
              >
                ×
              </button>

              {/* overlay will cover the todo while it is being deleted or updated */}
              <div data-cy="TodoLoader" className="modal overlay is-active">
                <div
                  id="plug"
                  className="modal-background has-background-white-ter"
                />
                <div className="loader" />
              </div>
            </div>
          )}
        </section>

        {/* Hide the footer if there are no todos */}
        {todos.length !== 0 && (
          <Footer
            countTodos={countUnCompletedTodos}
            filter={filter}
            newFilterParam={newFilter => setFilter(newFilter)}
            todos={todos}
            deleteCompleted={() => handleClearComplited()}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={clsx(
          'notification',
          'is-danger is-light',
          'has-text-weight-normal',
          errorMessage === '' && 'hidden',
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => {
            if (timerRef.current) {
              clearTimeout(timerRef.current);
              setErrorMessage('');
            }
          }}
        />
        {errorMessage}
      </div>
    </div>
  );
};
