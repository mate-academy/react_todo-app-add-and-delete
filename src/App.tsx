/* eslint-disable jsx-a11y/label-has-associated-control */
import React, {
  useEffect,
  useRef,
  useState,
  FormEvent,
  useCallback,
} from 'react';
import { addTodo, deleteTodo, getTodos, updateTodo } from './api/todos';
import { Todo } from './types/Todo';

import classNames from 'classnames';
import { TodoList } from './TodoList';
import { getFilteredData } from './helpers/helpers';
import { FilterTypes } from './enum/FilterTypes';
import { Provider } from './context/context';

export const App: React.FC = () => {
  const [todos, setTodos] = React.useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = React.useState<Todo | null>(null);

  const [isAddLoading, setIsAddLoading] = React.useState(false);
  const [todoLoadingStates, setTodoLoadingStates] = React.useState<{
    [key: number]: boolean;
  }>({});
  const [isListLoading, setIsListLoading] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState('');

  const [filter, setFilter] = React.useState<FilterTypes>(FilterTypes.All);
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);
  const [todoCompleted, setTodoCompleted] = useState<boolean | null>(null);

  const [todoValue, setTodoValue] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);
  const displayedTodos = getFilteredData(todos, filter);
  const getNotCompletedTodos = todos.filter(todo => !todo.completed);
  const getCompletedTodos = todos.filter(todo => todo.completed);
  const trimmedTodo = todoValue.trim();

  const setTodoLoading = (id: number, loading: boolean) => {
    setTodoLoadingStates(prevState => ({ ...prevState, [id]: loading }));
  };

  const onSelectInputChange = useCallback((id: number, completed: boolean) => {
    setSelectedTodoId(id);
    setTodoCompleted(!completed);
  }, []);

  const addTodoToTodoList = async ({ title, completed, userId }: Todo) => {
    try {
      setIsAddLoading(true);
      setErrorMessage('');
      setTempTodo({ id: 0, title, completed, userId });
      setTodoLoading(0, true);
      const addedTodo = await addTodo({ title, completed, userId });

      setTodos(currentTodos => [...currentTodos, addedTodo]);
      setTodoValue('');
    } catch (error) {
      setErrorMessage('Unable to add a todo');
      throw error;
    } finally {
      setIsAddLoading(false);
      setTempTodo(null);
      setTodoLoading(0, false);
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 0);
    }
  };

  const deleteTodoInTodoList = async (id: number) => {
    try {
      setTodoLoading(id, true);
      setErrorMessage('');
      await deleteTodo(id);

      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
      throw error;
    } finally {
      setTodoLoading(id, false);
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 0);
    }
  };

  const deleteCompletedTodos = () => {
    for (const todo of getCompletedTodos) {
      deleteTodoInTodoList(todo.id);
    }
  };

  async function getTodosList() {
    try {
      const todosData = await getTodos();

      setTodos(todosData);
    } catch (error) {
      setErrorMessage('Unable to load todos');
      throw error;
    } finally {
      setIsListLoading(false);
    }
  }

  useEffect(() => {
    getTodosList();

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    let mistakeTimer = 0;

    if (errorMessage) {
      mistakeTimer = window.setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }

    return () => {
      window.clearTimeout(mistakeTimer);
    };
  }, [errorMessage]);

  useEffect(() => {
    if (selectedTodoId !== null && todoCompleted !== null) {
      const updateTodoItem = async () => {
        try {
          setTodoLoading(selectedTodoId, true);
          setErrorMessage('');
          await updateTodo(selectedTodoId, todoCompleted);
          setTodos(prevTodos =>
            prevTodos.map(todo =>
              todo.id === selectedTodoId
                ? { ...todo, completed: todoCompleted }
                : todo,
            ),
          );
        } catch (error) {
          setErrorMessage('Unable to update a todo');
          throw error;
        } finally {
          setTodoLoading(selectedTodoId, false);
        }
      };

      updateTodoItem();
    }
  }, [selectedTodoId, todoCompleted]);

  const isSelectedFilter = (filterType: FilterTypes) =>
    filter === FilterTypes[filterType];

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!trimmedTodo) {
      setErrorMessage('Title should not be empty');

      return;
    }

    await addTodoToTodoList({
      id: 0,
      title: trimmedTodo,
      completed: false,
      userId: 1305,
    });
  };

  const contextValue = {
    onSelectInputChange,
    todoLoadingStates,
    deleteTodoInTodoList,
  };

  return (
    <Provider value={contextValue}>
      <div className="todoapp">
        <h1 className="todoapp__title">todos</h1>

        <div className="todoapp__content">
          <header className="todoapp__header">
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: getCompletedTodos.length === todos.length,
              })}
              data-cy="ToggleAllButton"
            />
            <form onSubmit={handleFormSubmit}>
              <input
                data-cy="NewTodoField"
                type="text"
                ref={inputRef}
                className="todoapp__new-todo"
                placeholder="What needs to be done?"
                value={todoValue}
                onChange={e => setTodoValue(e.target.value)}
                disabled={isAddLoading}
              />
            </form>
          </header>

          {!isListLoading && (
            <TodoList todoList={displayedTodos} tempTodo={tempTodo} />
          )}

          {!isListLoading && todos.length > 0 && (
            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="TodosCounter">
                {getNotCompletedTodos.length} items left
              </span>

              <nav className="filter" data-cy="Filter">
                <a
                  href="#/"
                  className={classNames('filter__link', {
                    selected: isSelectedFilter(FilterTypes.All),
                  })}
                  data-cy="FilterLinkAll"
                  onClick={() => setFilter(FilterTypes.All)}
                >
                  {FilterTypes.All}
                </a>

                <a
                  href="#/active"
                  className={classNames('filter__link', {
                    selected: isSelectedFilter(FilterTypes.Active),
                  })}
                  data-cy="FilterLinkActive"
                  onClick={() => setFilter(FilterTypes.Active)}
                >
                  {FilterTypes.Active}
                </a>

                <a
                  href="#/completed"
                  className={classNames('filter__link', {
                    selected: isSelectedFilter(FilterTypes.Completed),
                  })}
                  data-cy="FilterLinkCompleted"
                  onClick={() => setFilter(FilterTypes.Completed)}
                >
                  {FilterTypes.Completed}
                </a>
              </nav>

              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
                disabled={getNotCompletedTodos.length === todos.length}
                onClick={deleteCompletedTodos}
              >
                Clear completed
              </button>
            </footer>
          )}
        </div>

        <div
          data-cy="ErrorNotification"
          className={classNames(
            'notification',
            'is-danger',
            'is-light',
            'has-text-weight-normal',
            { hidden: !errorMessage },
          )}
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => setErrorMessage('')}
          />
          {errorMessage}
        </div>
      </div>
    </Provider>
  );
};
