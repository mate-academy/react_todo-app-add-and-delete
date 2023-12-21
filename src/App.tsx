/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { TodoList } from './components/TodoList/TodoList';
import {
  deleteTodo,
  getTodos,
  postTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { Errors } from './types/Errors';
import { Footer } from './components/Footer/Footer';
import { FilterType } from './types/FilterType';
import { filterTodos } from './utils/helpers';
import { ErrorNotify } from './components/ErrorNotify/ErrorNotify';

const USER_ID = 12041;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<Errors | null>(null);
  const [filterType, setFilterType] = useState(FilterType.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [selectedTodos, setSelectedTodos] = useState<number[]>([0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const titleField = useRef<HTMLInputElement>(null);
  const form = useRef<HTMLFormElement>(null);
  // #region "useEffects"

  const handleError = (err: Errors) => {
    setError(err);

    setTimeout(() => {
      setError(null);
    }, 3000);
  };

  const handleDelete = async (todoId: number) => {
    try {
      if (error) {
        setError(null);
      }

      setSelectedTodos(prev => [...prev, todoId]);

      await deleteTodo(todoId);

      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    } catch (e) {
      setSelectedTodos(prev => [...prev, 0]);
      handleError(Errors.UnableToDelete);
    }
  };

  const onErrorNotifyClose = () => {
    setError(null);
  };

  const onFilterSelect = (filterT: FilterType) => {
    setFilterType(filterT);
  };

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  });

  useEffect(() => {
    const renderTodos = async () => {
      try {
        const todosFromServer = await getTodos(USER_ID);

        setTodos(todosFromServer);
      } catch (e) {
        handleError(Errors.UnableToLoad);

        throw e;
      }
    };

    renderTodos();
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const title = event.currentTarget.titleInput.value.trim();

    if (!title) {
      handleError(Errors.EmptyTitle);

      return;
    }

    setTempTodo({
      id: 0,
      title,
      userId: USER_ID,
      completed: false,
    });

    const postingTodo = async () => {
      try {
        if (error) {
          setError(null);
        }

        setIsSubmitting(true);

        const response = await postTodo({
          title,
          userId: USER_ID,
          completed: false,
        });

        setTempTodo(null);

        setTodos(prevTodos => [...prevTodos, response]);
        form.current?.reset();
      } catch (err) {
        handleError(Errors.UnableToAdd);

        setTempTodo(null);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    };

    postingTodo();
  };

  const clearCompleted = useCallback(() => {
    const completedTodos = todos
      .filter((todo) => todo.completed);

    setSelectedTodos((currentIds) => [
      ...currentIds,
      ...completedTodos.map((completedTodo) => completedTodo.id),
    ]);

    completedTodos.map((completedTodo) => deleteTodo(completedTodo.id));

    setTimeout(() => {
      setTodos((currentTodos) => currentTodos
        .filter((todo) => !todo.completed));
    }, 500);
  }, [todos]);

  const visibleTodos = useMemo(() => {
    return filterTodos(todos, filterType);
  }, [filterType, todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          <form
            ref={form}
            onSubmit={handleSubmit}
          >
            <input
              ref={titleField}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              name="titleInput"
              disabled={isSubmitting}
            />
          </form>
        </header>

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          handleDelete={handleDelete}
          selectedTodos={selectedTodos}
        />

        {!!todos.length && (
          <Footer
            filterType={filterType}
            onFilterSelect={onFilterSelect}
            todos={todos}
            clearCompleted={clearCompleted}
          />
        )}
      </div>

      <ErrorNotify
        error={error}
        onClose={onErrorNotifyClose}
      />
    </div>
  );
};
