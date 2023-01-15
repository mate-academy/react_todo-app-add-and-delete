import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { AuthContext } from './components/Auth/AuthContext';
import { Condition } from './types/Condition';
import { Todo } from './types/Todo';
import { addTodos, deleteTodos, getTodos } from './api/todos';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isError, setIsError] = useState('');
  const [filterType, setFilterType] = useState(Condition.All);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [activeLoading, setActiveLoading] = useState<number[]>([]);
  const [loader, setLoader] = useState<number>(0);

  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const filteredTodos = todos.filter(todo => {
    switch (filterType) {
      case Condition.Active:
        return !todo.completed;
      case Condition.Completed:
        return todo.completed;
      default:
        return Condition.All;
    }
  });

  const loadApiTodos = async () => {
    if (user) {
      try {
        const data = await getTodos(user.id);

        setTodos(data);
      } catch {
        setIsError('Unable to add a todo');
      }
    }
  };

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    loadApiTodos();
  }, []);

  const changeFilterType = (event: Condition) => {
    setFilterType(event);
  };

  const closeError = () => {
    setIsError('');
  };

  const addToLoadingArr = (id: number) => {
    setActiveLoading(arr => [...arr, id]);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!user) {
      return;
    }

    if (!newTodoTitle.trim()) {
      setIsError('Title can\'t be empty');

      return;
    }

    if (newTodoTitle.length) {
      try {
        const newTodo = {
          userId: user.id,
          title: newTodoTitle,
          completed: false,
        };

        const data = await addTodos(newTodo);

        setLoader(data.id);
        setIsAdding(true);
        setNewTodoTitle('');
        loadApiTodos();
      } catch {
        setIsError('Unable to add a todo');
        setNewTodoTitle('');
      } finally {
        setIsAdding(false);
      }
    }
  };

  useEffect(() => {
    const t = setTimeout(() => {
      setLoader(0);
    }, 1000);

    return () => clearTimeout(t);
  });

  const handleDeleteTodo = async (todoId: number) => {
    addToLoadingArr(todoId);
    try {
      await deleteTodos(todoId);
      loadApiTodos();
    } catch {
      setIsError('Unable to delete a todo');
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveLoading([]);
    }, 1000);

    return () => clearTimeout(timer);
  });

  const todosNotCompleted = todos.filter(todo => !todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">

          {todos.length > 0 && (
            <button
              data-cy="ToggleAllButton"
              type="button"
              aria-label="toggle-button"
              className={classNames('todoapp__toggle-all', {
                active: todosNotCompleted.length === 0,
              })}
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              disabled={isAdding}
              value={newTodoTitle}
              onChange={(event) => setNewTodoTitle(event.target.value)}
            />
          </form>
        </header>
        {todos.length > 0 && (
          <>
            <TodoList
              todos={filteredTodos}
              onDelete={handleDeleteTodo}
              activeLoading={activeLoading}
              isAdding={isAdding}
              loader={loader}
            />
            <Footer
              todos={todos}
              setFilterType={changeFilterType}
              onDelete={handleDeleteTodo}
              filterType={filterType}
            />
          </>
        )}
      </div>
      {isError && (
        <ErrorNotification
          isError={isError}
          setIsError={closeError}
        />
      )}
    </div>
  );
};
