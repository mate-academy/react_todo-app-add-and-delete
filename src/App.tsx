/* eslint-disable jsx-a11y/control-has-associated-label */
import { useState, useEffect, useMemo } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import {
  getTodos,
  filterTodos,
  postTodo,
  deleteTodo,
} from './api/todos';
import { FilterBy } from './types/FilterBy';
import { NewTodoInput } from './components/NewTodoInput';
import { TodoList } from './components/TodoList/TodoList';
import { TodosFilter } from './components/TodosFilter';
import { ErrorMessage } from './types/ErrorMessage';
import { NotificationError } from './components/NotificationError';
import { Loader } from './components/Loader';

const USER_ID = 6986;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState(FilterBy.All);
  const [error, setError] = useState<ErrorMessage | null>(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState('');
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  const activeTodosCount = filterTodos(todos, FilterBy.ACTIVE).length;
  const completedTodosCount = filterTodos(todos, FilterBy.COMPLETED).length;
  const isAllCompleted = todos.length === completedTodosCount;

  const getTodosFromServer = async () => {
    try {
      setIsLoading(true);
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch {
      setError(ErrorMessage.DOWNLOAD);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const errorReset = () => {
    setTimeout(() => {
      setError(null);
    }, 3000);
  };

  const createTodo = (title: string) => {
    const newTodo = {
      title,
      userId: USER_ID,
      completed: false,
    };

    setIsInputDisabled(true);
    setTempTodo({ ...newTodo, id: 0 });

    postTodo(newTodo)
      .then(result => {
        setTodos(state => [...state, result]);
      })
      .catch(() => {
        setError(ErrorMessage.ADD);
        errorReset();
      })
      .finally(() => {
        setIsInputDisabled(false);
        setTempTodo(null);
      });
  };

  const removeTodo = (id: number) => {
    setLoadingIds(state => [...state, id]);

    return deleteTodo(id)
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setError(ErrorMessage.DELETE);
        errorReset();
      })
      .finally(() => {
        setLoadingIds(state => state.filter(el => el !== id));
      });
  };

  const removeCompletedTodos = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.map(todo => {
      setLoadingIds(state => [...state, todo.id]);

      return deleteTodo(todo.id)
        .then(() => {
          setTodos(todos.filter(aTodo => !aTodo.completed));
        })
        .catch(() => {
          setError(ErrorMessage.DELETE);
          errorReset();
        })
        .finally(() => {
          setLoadingIds(state => state.filter(el => el !== todo.id));
        });
    });
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!input) {
      setError(ErrorMessage.TITLEEMPTY);
      errorReset();

      return;
    }

    createTodo(input);
    setInput('');
  };

  useEffect(() => {
    getTodosFromServer();
  }, []);

  const filteredTodos = useMemo(() => {
    return filterTodos(todos, filterBy);
  }, [todos, filterBy]);

  const shouldDisplayTodos = !isLoading && !isError && todos;

  const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      {isLoading && (
        <Loader />)}
      {shouldDisplayTodos && (
        <div className="todoapp__content">
          <NewTodoInput
            isButtonActive={isAllCompleted}
            title={input}
            setTitle={onChangeInput}
            onFormSubmit={handleFormSubmit}
            isInputDisabled={isInputDisabled}
          />

          <TodoList
            todos={filteredTodos}
            tempTodo={tempTodo}
            onRemove={removeTodo}
            loadingIds={loadingIds}
          />

          {!!todos.length && (
            <TodosFilter
              todosLeft={activeTodosCount}
              todosCompleted={completedTodosCount}
              filterBy={filterBy}
              setFilterBy={setFilterBy}
              onRemoveCompleted={removeCompletedTodos}
            />
          )}
        </div>
      )}

      {error && (
        <NotificationError
          errorReset={errorReset}
          errorMessage={error}
        />
      )}
    </div>
  );
};
