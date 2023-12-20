/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { TodoList } from './components/TodoList/TodoList';
import {
  // deleteTodo,
  getTodos,
  postTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { Errors } from './types/Errors';
import { Filter } from './components/Filter/Filter';
import { FilterType } from './types/FilterType';
import { filterTodos, unsetError } from './utils/helpers';
import { ErrorNotify } from './components/ErrorNotify/ErrorNotify';

const USER_ID = 12041;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<Errors | null>(null);
  const [filterType, setFilterType] = useState(FilterType.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const titleField = useRef<HTMLInputElement>(null);
  // #region "useEffects"

  // const handleDelete = (todoId: number) => {
  //   const deletingTodo = async () => {
  //     try {
  //       await deleteTodo(todoId);
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   };

  //   deletingTodo();
  // };

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

    const title = event.currentTarget.titleInput.value.trim();
    // console.log(title);

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
      } catch (err) {
        // console.log(err);
        setTempTodo(null);

        throw err;
      }
    };

    postingTodo();
  };

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

          <form onSubmit={handleSubmit}>
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
        />

        {/* Hide the footer if there are no todos */}
        {!!todos.length && (
          <Filter
            filterType={filterType}
            onFilterSelect={onFilterSelect}
            todos={todos}
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
