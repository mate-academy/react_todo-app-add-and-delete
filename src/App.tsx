/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import { AuthContext } from './components/Auth/AuthContext';
import { createTodos, deleteTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { getVisibleTodos } from './helper';
import { Filter } from './types/Filter';
import { NewTodo } from './components/NewTodo';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState<Filter>(Filter.all);
  const [serverError, setServerError] = useState(false);
  const [inputError, setInputError] = useState(false);
  const [createTodoError, setCreateTodoError] = useState(false);
  const [deleteTodoError, setDeleteTodoError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingTodosId, setDeletingTodosId] = useState([0]);

  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const handleFilter = useCallback((str: Filter) => setFilter(str), []);
  const handleError = (callback: (err: boolean) => void) => {
    callback(true);

    setTimeout(() => callback(false), 3000);
  };

  const clearErrors = () => {
    setServerError(false);
    setInputError(false);
    setCreateTodoError(false);
    setDeleteTodoError(false);
  };

  const submitNewTodo = useCallback(async (title: string) => {
    if (!(title.trim())) {
      handleError(setInputError);

      return;
    }

    setIsAdding(true);
    if (user) {
      try {
        const currentTodo = {
          title,
          userId: user?.id,
          completed: false,
          id: 0,
        };

        setTempTodo(currentTodo);

        const newTodo = await createTodos(currentTodo);

        setTodos(prev => [...prev, newTodo]);
      } catch (e) {
        handleError(setCreateTodoError);
      }
    }

    setIsAdding(false);
    setTempTodo(null);
  }, []);

  const handleDeleteTodo = useCallback(async (id: number) => {
    setDeletingTodosId([id]);
    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (e) {
      handleError(setDeleteTodoError);
    }

    setDeletingTodosId([0]);
  }, []);

  const deleteCompleted = useCallback(async () => {
    const completedTodoId = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setDeletingTodosId(completedTodoId);

    await Promise.all(completedTodoId.map(id => deleteTodo(id)));
    setTodos(prev => prev.filter(todo => !completedTodoId.includes(todo.id)));

    setDeletingTodosId([0]);
  }, [todos]);

  const visibleTodos = useMemo(() => (
    filter === Filter.all
      ? todos
      : getVisibleTodos(todos, filter)
  ), [filter, todos]);

  async function getTodosFromServer() {
    if (user) {
      try {
        const todosFromServer = await getTodos(user?.id);

        setTodos(todosFromServer);
      } catch (e) {
        handleError(setServerError);
      }
    }
  }

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    getTodosFromServer();
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            type="button"
            className="todoapp__toggle-all active"
          />

          <NewTodo
            newTodoField={newTodoField}
            submitNewTodo={submitNewTodo}
            isAdding={isAdding}
          />
        </header>

        {!todos.length || (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              onDelete={handleDeleteTodo}
              deletingTodosId={deletingTodosId}
            />

            <Footer
              length={todos.length}
              onFilter={handleFilter}
              filter={filter}
              deleteCompleted={deleteCompleted}
            />
          </>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn('notification is-danger is-light has-text-weight-normal',
          {
            hidden: !serverError && !inputError
              && !createTodoError && !deleteTodoError,
          })}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => clearErrors()}
        />

        {serverError && (
          <>
            Unable to add a todo
            <br />
            Unable to delete a todo
            <br />
            Unable to update a todo
          </>
        )}
        {inputError && (<>Title can&apos;t be empty</>)}
        {createTodoError && (<>Unable to add a todo</>)}
        {deleteTodoError && (<>Unable to delete a todo</>)}

      </div>
    </div>
  );
};
