/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { useForm } from 'react-hook-form';
import { Todo } from './types/Todo';
import classNames from 'classnames';
import {
  getTodos,
  USER_ID,
  addTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { Footer } from './components/Footer';
import { Error } from './components/Error';
import { TodoList } from './components/TodoList';

type FormValues = {
  title: string;
};

const FILTERS = {
  ALL: 'all',
  ACTIVE: 'active',
  COMPLETED: 'completed',
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(FILTERS.ALL);
  const [error, setError] = useState('');
  const { register, handleSubmit, reset } = useForm<FormValues>();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoadingTodos, setIsLoadingTodos] = useState(true);

  const isLoading = (id: number) => loadingIds.includes(id);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const showError = (message: string) => {
    setError(message);

    setTimeout(() => {
      setError('');
    }, 3000);
  };

  const onSubmit = handleSubmit(async data => {
    if (!data.title || data.title.trim() === '') {
      showError('Title should not be empty');

      return;
    }

    const title = data.title.trim();

    setTempTodo({
      id: 0,
      title,
      completed: false,
      userId: USER_ID,
    });
    try {
      setError('');

      const newTodo = await addTodo({ title });

      setTodos(current => [...current, newTodo]);

      reset();
    } catch {
      showError('Unable to add a todo');
    } finally {
      setTempTodo(null);
    }
  });

  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  const visibleTodos = todos.filter(todo => {
    switch (filter) {
      case FILTERS.ACTIVE:
        return !todo.completed;

      case FILTERS.COMPLETED:
        return todo.completed;

      default:
        return true;
    }
  });

  useEffect(() => {
    setIsLoadingTodos(true);

    getTodos()
      .then(setTodos)
      .catch(() => showError('Unable to load todos'))
      .finally(() => setIsLoadingTodos(false));
  }, []);

  useEffect(() => {
    if (tempTodo === null && inputRef.current) {
      inputRef.current.focus();
    }
  }, [tempTodo]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const toggleTodo = (id: number) => {
    const todo = todos.find(t => t.id === id);

    if (!todo) {
      return;
    }

    setLoadingIds(prev => (prev.includes(id) ? prev : [...prev, id]));

    updateTodo(id, { completed: !todo.completed })
      .then(updatedTodo => {
        setTodos(current => current.map(t => (t.id === id ? updatedTodo : t)));
      })
      .catch(() => {
        showError('Unable to update a todo');
      })
      .finally(() => {
        setLoadingIds(ids => ids.filter(todoId => todoId !== id));
      });
  };

  const toggleAll = async () => {
    const shouldCompleteAll = !allCompleted;

    const updates = todos.map(todo => ({
      ...todo,
      completed: shouldCompleteAll,
    }));

    setTodos(updates);

    const todosToUpdate = todos.filter(
      todo => todo.completed !== shouldCompleteAll,
    );

    try {
      await Promise.all(
        todosToUpdate.map(todo =>
          updateTodo(todo.id, { completed: shouldCompleteAll }),
        ),
      );
    } catch {
      showError('Unable to update a todo');
    }
  };

  const removeTodo = (id: number) => {
    setLoadingIds(prev => [...prev, id]);

    deleteTodo(id)
      .then(() => {
        setTodos(current => current.filter(todo => todo.id !== id));
      })
      .catch(() => {
        showError('Unable to delete a todo');
      })
      .finally(() => {
        setLoadingIds(ids => ids.filter(todoId => todoId !== id));
        inputRef.current?.focus();
      });
  };

  const clearCompleted = () => {
    const completedTodo = todos.filter(todo => todo.completed);

    completedTodo.forEach(todo => {
      removeTodo(todo.id);
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {!isLoadingTodos && todos.length > 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: allCompleted,
              })}
              data-cy="ToggleAllButton"
              onClick={toggleAll}
            />
          )}

          {/* Add a todo on form submit */}
          <form onSubmit={onSubmit}>
            <input
              {...register('title')}
              ref={el => {
                register('title').ref(el);
                inputRef.current = el;
              }}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              disabled={tempTodo !== null}
            />
          </form>
        </header>

        <TodoList
          visibleTodos={visibleTodos}
          toggleTodo={toggleTodo}
          removeTodo={removeTodo}
          isLoading={isLoading}
          tempTodo={tempTodo}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            filter={filter}
            setFilter={setFilter}
            clearCompleted={clearCompleted}
          />
        )}
      </div>

      <Error error={error} setError={setError} />
    </div>
  );
};
