/* eslint-disable no-console */
/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  createTodo,
  deleteTodo,
  getTodos,
  TodoData,
} from './api/todos';
import { AuthContext, AuthProvider } from './components/Auth/AuthContext';
// eslint-disable-next-line max-len
import { ErrorNotification } from './components/ErrorNotification/ErrorNotiication';
import { NewTodoForm } from './components/NewTodoForm/NewTodoForm';
import { TodoFilter } from './components/TodoFilter/TodoFilter';
import { TodoList } from './components/TodoList/TodoList';
import { FilterOptions } from './types/FilterOptions';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const user = useContext(AuthContext);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [isErrorHidden, setIsErrorHidden] = useState(true);
  const [selectedOption, setSelectedOption] = useState(FilterOptions.ALL);
  const [isAdding, setIsAdding] = useState(false);
  const [deletedTodoId, setDeletedTodoId] = useState(0);

  const addNewTodo = async (todo: TodoData) => {
    try {
      setIsErrorHidden(true);
      setIsAdding(true);
      const tempTodo = { ...todo, id: 0 };

      setTodos(prevTodos => [...prevTodos, tempTodo]);

      const todoToAdd = await createTodo(todo);

      setIsAdding(false);
      setTodos(prevTodos => {
        const newList = [...prevTodos];

        newList[prevTodos.length - 1] = todoToAdd;

        return newList;
      });
    } catch (err) {
      setIsAdding(false);
      setError('add');
      setIsErrorHidden(false);
      setTodos(prevTodos => {
        const newList = [...prevTodos];

        newList.length = prevTodos.length - 1;

        return newList;
      });
    }
  };

  const deleteCurrentTodo = async (todoId: number) => {
    try {
      setIsErrorHidden(true);
      setDeletedTodoId(todoId);

      await deleteTodo(todoId);
      setTodos(currentTodos => {
        return currentTodos.filter(todo => todoId !== todo.id);
      });
    } catch (err) {
      setError('delete');
      setIsErrorHidden(false);
      setDeletedTodoId(0);
    }
  };

  const getUserTodos = async () => {
    if (user) {
      try {
        const todosFromServer = await getTodos(user.id);

        setTodos(todosFromServer);
      } catch (err) {
        setError('get');
        setIsErrorHidden(false);
      }
    }
  };

  useEffect(() => {
    getUserTodos();
  }, []);

  const filterBySelect = useCallback((
    todosFromServer: Todo[],
    option: string,
  ) => {
    return todosFromServer.filter(todo => {
      switch (option) {
        case FilterOptions.ACTIVE:
          return todo.completed === false;

        case FilterOptions.COMPLETED:
          return todo.completed === true;

        case FilterOptions.ALL:
        default:
          return true;
      }
    });
  }, []);

  const visibleTodos = useMemo(() => {
    return filterBySelect(todos, selectedOption);
  }, [todos, selectedOption]);

  const AmountOfActiveTodos = useMemo(() => {
    return filterBySelect(todos, FilterOptions.ACTIVE).length;
  }, [todos]);

  // const isClearNeeded = useMemo(() => {
  //   return AmountOfActiveTodos !== visibleTodos.length;
  // }, [AmountOfActiveTodos, visibleTodos]);

  return (
    <AuthProvider>
      <div className="todoapp">
        <h1 className="todoapp__title">todos</h1>

        <div className="todoapp__content">
          <header className="todoapp__header">
            <button
              data-cy="ToggleAllButton"
              type="button"
              className={classNames(
                'todoapp__toggle-all',
                { active: AmountOfActiveTodos === 0 },
              )}
            />

            <NewTodoForm
              onAdd={addNewTodo}
              isAdding={isAdding}
            />
          </header>
          {todos.length > 0 && (
            <>
              <TodoList
                todos={visibleTodos}
                deletedTodoId={deletedTodoId}
                onDelete={deleteCurrentTodo}
              />

              <footer className="todoapp__footer" data-cy="Footer">
                <span className="todo-count" data-cy="todosCounter">
                  {`${AmountOfActiveTodos} items left`}
                </span>

                <TodoFilter
                  selectedOption={selectedOption}
                  onOptionChange={setSelectedOption}
                />

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

        <ErrorNotification
          error={error}
          isHidden={isErrorHidden}
          onHiddenChange={setIsErrorHidden}
        />
      </div>
    </AuthProvider>
  );
};
