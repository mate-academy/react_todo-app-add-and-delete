/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { useState, useEffect, useRef } from 'react';

import { UserWarning } from './UserWarning';

import { USER_ID, getTodos, addTodo, deleteTodo } from './api/todos';

import { Todo } from './types/Todo';

import { ErrorNotification } from './components/ErrorNotification';

import { Header } from './components/Header';

import { Filter } from './types/Filter';

import { Footer } from './components/Footer';

import { TodoList } from './components/TodoList';

enum Error {
  EmptyTitle = 'Title should not be empty',
  AddTodo = 'Unable to add a todo',
  DeleteTodo = 'Unable to delete a todo',
  LoadTodos = 'Unable to load todos',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState(Filter.All);
  const [newTodo, setNewTodo] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!newTodo.trim()) {
      setError(Error.EmptyTitle);

      setTimeout(() => {
        setError('');
      }, 3000);

      return;
    }

    const title = newTodo.trim();

    const todo = {
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo({
      ...todo,
      id: 0,
    });

    setIsAdding(true);

    addTodo(todo)
      .then(createdTodo => {
        setTodos(currentTodos => [...currentTodos, createdTodo]);
        setTempTodo(null);
        setNewTodo('');
        setIsAdding(false);
      })
      .catch(() => {
        setError(Error.AddTodo);
        setTempTodo(null);
        setIsAdding(false);

        setTimeout(() => {
          setError('');
        }, 3000);
      });
  };

  const handleDelete = (todoId: number) => {
    setDeletingTodoId(todoId);

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );

        setDeletingTodoId(null);
        inputRef.current?.focus();
      })
      .catch(() => {
        setError(Error.DeleteTodo);
        setDeletingTodoId(null);

        setTimeout(() => {
          setError('');
        }, 3000);
      });
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    Promise.allSettled(completedTodos.map(todo => deleteTodo(todo.id))).then(
      results => {
        results.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            setTodos(currentTodos =>
              currentTodos.filter(todo => todo.id !== completedTodos[index].id),
            );
          }
        });

        if (results.some(result => result.status === 'rejected')) {
          setError(Error.DeleteTodo);

          setTimeout(() => {
            setError('');
          }, 3000);
        }

        inputRef.current?.focus();
      },
    );
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isAdding) {
      inputRef.current?.focus();
    }
  }, [isAdding]);

  useEffect(() => {
    getTodos()
      .then(data => {
        setTodos(data);
      })
      .catch(() => {
        setError('Unable to load todos');

        setTimeout(() => {
          setError('');
        }, 3000);
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const activeTodos = todos.filter(todo => !todo.completed);
  const activeTodosCount = activeTodos.length;
  const itemsWord = activeTodosCount === 1 ? 'item' : 'items';

  let visibleTodos = todos;

  if (filter === Filter.Active) {
    visibleTodos = todos.filter(todo => !todo.completed);
  }

  if (filter === Filter.Completed) {
    visibleTodos = todos.filter(todo => todo.completed);
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          newTodo={newTodo}
          setNewTodo={setNewTodo}
          inputRef={inputRef}
          isAdding={isAdding}
          handleSubmit={handleSubmit}
        />
        {todos.length > 0 && (
          <section className="todoapp__main" data-cy="TodoList">
            <TodoList
              todos={visibleTodos}
              deletingTodoId={deletingTodoId}
              onDelete={handleDelete}
            />
          </section>
        )}

        {tempTodo && (
          <div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                disabled
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              {tempTodo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              disabled
            >
              ×
            </button>

            <div data-cy="TodoLoader" className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        )}

        {todos.length > 0 && (
          <Footer
            todos={todos}
            handleClearCompleted={handleClearCompleted}
            setFilter={setFilter}
            filter={filter}
            itemsWord={itemsWord}
            activeTodosCount={activeTodosCount}
          />
        )}
      </div>

      <ErrorNotification error={error} onClose={() => setError('')} />
    </div>
  );
};
