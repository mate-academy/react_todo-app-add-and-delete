/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  FC, useContext, useEffect, useRef, useState, useMemo,
} from 'react';
import cn from 'classnames';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import { TodosFilter } from './types/TodosFilter';
import { Header } from './components/Header';

export const App: FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [isError, setIsError] = useState(false);
  const [errorNotification, setErrorNotification] = useState('');
  const [filterBy, setFilterBy] = useState<TodosFilter>(TodosFilter.None);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>(todos);
  const [isAdding, setIsAdding] = useState(false);

  const activeTodos = useMemo(() => (
    todos.filter(({ completed }) => completed === false)
  ), [todos]);

  const handleTodosFilter = (filter: TodosFilter) => {
    switch (filter) {
      case TodosFilter.Completed:
        setVisibleTodos(todos.filter(({ completed }) => completed === true));
        break;
      case TodosFilter.Active:
        setVisibleTodos(activeTodos);
        break;

      default:
        setVisibleTodos(todos);
    }
  };

  const getAllTodos = async () => {
    try {
      if (user) {
        const todosFromServer = await getTodos(user.id);

        setTodos(todosFromServer);
        setVisibleTodos(todosFromServer);
      }
    } catch (error) {
      setIsError(true);
    }
  };

  const addTodoToServer = async (todoTitle: string) => {
    if (user) {
      try {
        setIsAdding(true);

        await addTodo(user.id, todoTitle);
        getAllTodos();
      } catch (error) {
        setIsError(true);
        setErrorNotification('Unable to add a todo');
      }
    }
  };

  const deleteTodosFromServer = async (todoId: number) => {
    try {
      await deleteTodo(todoId);
      getAllTodos();
    } catch (error) {
      setIsError(true);
      setErrorNotification('Unable to delete a todo');
    }
  };

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    getAllTodos();
  }, []);

  useEffect(() => {
    setTimeout(() => setIsError(false), 3000);
  }, [isError]);

  const handleFilterChange = (filter: TodosFilter) => {
    handleTodosFilter(filter);
    setFilterBy(filter);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoField={newTodoField}
          isAdding={isAdding}
          addTodoToServer={addTodoToServer}
          setIsError={setIsError}
          setError={setErrorNotification}
        />

        {todos.length && (
          <>
            <TodoList
              todos={visibleTodos}
              deleteTodo={deleteTodosFromServer}
            />

            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="todosCounter">
                {`${activeTodos.length} items left`}
              </span>

              <nav className="filter" data-cy="Filter">
                <a
                  data-cy="FilterLinkAll"
                  href="#/"
                  className={cn(
                    'filter__link',
                    {
                      selected: filterBy === TodosFilter.None,
                    },
                  )}
                  onClick={() => handleFilterChange(TodosFilter.None)}
                >
                  All
                </a>

                <a
                  data-cy="FilterLinkActive"
                  href="#/active"
                  className={cn(
                    'filter__link',
                    {
                      selected: filterBy === TodosFilter.Active,
                    },
                  )}
                  onClick={() => handleFilterChange(TodosFilter.Active)}
                >
                  Active
                </a>
                <a
                  data-cy="FilterLinkCompleted"
                  href="#/completed"
                  className={cn(
                    'filter__link',
                    {
                      selected: filterBy === TodosFilter.Completed,
                    },
                  )}
                  onClick={() => handleFilterChange(TodosFilter.Completed)}
                >
                  Completed
                </a>
              </nav>

              <button
                data-cy="ClearCompletedButton"
                type="button"
                className="todoapp__clear-completed"
              >
                Clear completed
              </button>
            </footer>
          </>

        )}
      </div>

      {isError && (
        <div
          data-cy="ErrorNotification"
          className="notification is-danger is-light has-text-weight-normal"
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => setIsError(false)}
          />
          {errorNotification}
          Unable to add a todo
          <br />
          Unable to delete a todo
          <br />
          Unable to update a todo
        </div>
      )}
    </div>
  );
};
