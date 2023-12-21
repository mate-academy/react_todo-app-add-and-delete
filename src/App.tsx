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
  // deleteTodo,
  getTodos,
  postTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { Errors } from './types/Errors';
import { Footer } from './components/Footer/Footer';
import { FilterType } from './types/FilterType';
import { filterTodos, unsetError } from './utils/helpers';
import { ErrorNotify } from './components/ErrorNotify/ErrorNotify';

const USER_ID = 12041;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<Errors | null>(null);
  const [filterType, setFilterType] = useState(FilterType.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [selectedTodos, setSelectedTodos] = useState<number[]>([0]);

  const titleField = useRef<HTMLInputElement>(null);
  const form = useRef<HTMLFormElement>(null);
  // #region "useEffects"

  const handleDelete = async (todoId: number) => {
    // const deletingTodo = async () => {
    try {
      setSelectedTodos(prev => [...prev, todoId]);

      await deleteTodo(todoId);

      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    } catch (e) {
      setError(Errors.UnableToDelete);
      setSelectedTodos(prev => [...prev, 0]);

      setTimeout(() => {
        setError(null);
      }, 3000);
    }
    // };

    // deletingTodo();
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
        setError(Errors.UnableToLoad);

        unsetError(setError, null, 3000);

        throw e;
      }
    };

    renderTodos();
  }, []);
  // #endregion "useEffects"
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // console.log(form.current?.titleInput.value, event.currentTarget);

    const title = event.currentTarget.titleInput.value.trim();

    if (!title) {
      setError(Errors.EmptyTitle);

      setTimeout(() => {
        setError(null);
      }, 3000);

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
        const response = await postTodo({
          title,
          userId: USER_ID,
          completed: false,
        });

        setTempTodo(null);

        setTodos(prevTodos => [...prevTodos, response]);
        // console.log(event.target)
        form.current?.reset();
      } catch (err) {
        // console.log(err);
        setTempTodo(null);

        throw err;
      }
    };

    postingTodo();
  };

  // const clearCompletedTodos = () => {
  //   setTodoIdToDelete(todos.filter(todo => todo.completed));
  // }

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
            />
          </form>
        </header>

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          handleDelete={handleDelete}
          selectedTodos={selectedTodos}
        />

        {/* Hide the footer if there are no todos */}
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
