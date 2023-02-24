import {
  useEffect, useMemo, useReducer, useState,
} from 'react';
import classNames from 'classnames';
import { getTodos, removeTodo, updateTodo } from './api/todos';
import { TodoFilter } from './components/TodoFilter';
import { TodoList } from './components/TodoList';
import { Filter } from './enums/Filter';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import { filteredTodos } from './utils/filter';
import { INITIAL_STATE_TEMPTODO } from './constants/initial_state_newTodo';
import { USER_ID } from './constants/user_id';
import { ErrorMessage } from './components/ErrorMessage';
import { Error } from './enums/Error';
import { handlerError } from './utils/Errors';
import { client } from './utils/fetchClient';
import { TodoForm } from './components/TodoForm';
import { reducer } from './reducer';
import { ReducerType } from './enums/Reducer';

export const App: React.FC = () => {
  const [filter, setFilter] = useState(Filter.ALL);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, dispatch] = useReducer(reducer, INITIAL_STATE_TEMPTODO);
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const [isCreated, setIsCreated] = useState(false);
  const [isError, setIsError] = useState<Error>(Error.RESET);
  const [isArrow, setIsArrow] = useState(false);

  const isProcessing = (id: number) => {
    if (processingIds.includes(id) || id === 0) {
      return true;
    }

    return false;
  };

  const ErrorTitle = handlerError(isError);

  const onShowArrow = useMemo(() => {
    return todos.every(todo => todo.completed)
      ? setIsArrow(true)
      : setIsArrow(false);
  }, [todos]);

  const visibleTodos = useMemo(() => {
    return filteredTodos(todos, filter);
  }, [todos, filter]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setIsError(Error.UPLOAD);
      });
  }, []);

  const onAdd = (todo: Todo) => {
    const {
      title, userId, completed,
    } = todo;

    setIsCreated(true);

    return client.post<Todo>('/todos', { title, userId, completed })
      .then(result => {
        setTodos(prev => [...prev, result]);
        dispatch({ type: ReducerType.RESET });
      })
      .catch(() => setIsError(Error.ADD))
      .finally(() => setIsCreated(false));
  };

  const onDelete = (todoIdToDelete: number) => {
    setProcessingIds(prev => [...prev, todoIdToDelete]);

    removeTodo(todoIdToDelete)
      .then(() => getTodos(USER_ID))
      .then(setTodos)
      .catch(() => setIsError(Error.REMOVE))
      .then(() => setProcessingIds((prev) => {
        return prev.filter(id => id !== todoIdToDelete);
      }));
  };

  const onUpdate = (todoID: number, data: Partial<Todo>) => {
    return updateTodo(todoID, data)
      .catch(() => setIsError(Error.UPDATE))
      .then(() => getTodos(USER_ID))
      .then(setTodos);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!tempTodo.title.trim()) {
      return setIsError(Error.TITLE);
    }

    return onAdd(tempTodo);
  };

  const onClear = () => {
    visibleTodos
      .map(todo => (todo.completed ? onDelete(todo.id) : todo));
  };

  const handleArrow = () => {
    if (!isArrow) {
      todos.map(todo => (!todo.completed
        ? onUpdate(todo.id, { completed: true })
        : todo));

      setIsArrow(true);
    }

    if (isArrow) {
      todos.map(todo => (todo.completed
        ? onUpdate(todo.id, { completed: false })
        : todo));

      setIsArrow(false);
    }
  };

  const dispatchTitle = (e: string) => {
    dispatch({
      type: ReducerType.TITLE,
      newTitle: e,
    });
  };

  if (!USER_ID) {
    setIsError(Error.USER);

    return <UserWarning />;
  }

  if (isError) {
    window.setTimeout(() => setIsError(Error.RESET), 3000);
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {!todos.length || (
            <button
              type="button"
              className={classNames('todoapp__toggle-all',
                { active: isArrow || onShowArrow })}
              aria-label="set all todos completed"
              onClick={handleArrow}
            />
          )}

          <TodoForm
            handleSubmit={handleSubmit}
            isCreated={isCreated}
            value={tempTodo.title}
            inputHandler={dispatchTitle}
          />
        </header>

        <TodoList
          todos={visibleTodos}
          onDelete={onDelete}
          onUpdate={onUpdate}
          isProcessing={isProcessing}
          isCreated={isCreated}
          newTodo={tempTodo}
        />

        {!todos.length || (
          <footer className="todoapp__footer">
            <TodoFilter
              filter={filter}
              setFilter={setFilter}
              onClear={onClear}
              todos={todos}
            />
          </footer>
        )}

      </div>

      {!isError
        || (
          <ErrorMessage
            setError={setIsError}
            ErrorTitle={ErrorTitle}
          />
        ) }
    </div>
  );
};
