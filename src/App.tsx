/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useState,
  useEffect,
  useCallback,
} from 'react';

import { addTodo, deleteTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import { FilterBy } from './types/FilterBy';
import { TempTodo } from './types/TempTodo';
import { TodoList } from './components/TodoList';
import { NewTodo } from './components/NewTodo';
import { Filter } from './components/Filter';
import { TodoWarning } from './components/TodoWarning';
import { ErrorMessage } from './types/ErrorMessage';

const USER_ID = 6401;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isError, setIsError] = useState(false);
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.all);
  const [title, setTitle] = useState('');
  const [disabledInput, setDisabledInput] = useState(false);
  const [tempTodo, setTempTodo] = useState<TempTodo | null>(null);
  const [errorMessage, setErrorMessage]
    = useState<ErrorMessage>(ErrorMessage.none);
  const [loadingTodoIds, setLoadingTodoIds] = useState([0]);

  const getTodosFromServer = useCallback(
    async () => {
      try {
        const todosList = await getTodos(USER_ID);

        setTodos(todosList);
      } catch (error) {
        setIsError(true);
        setErrorMessage(ErrorMessage.loadTodo);
      }
    }, [todos],
  );

  useEffect(() => {
    getTodosFromServer();
  }, []);

  const allTodosCompleted = todos.every(todo => todo.completed);

  if (isError) {
    let timerId;

    clearTimeout(timerId);

    timerId = setTimeout(() => setIsError(false), 3000);
  }

  if (!USER_ID) {
    return <UserWarning />;
  }

  const addTodoToServer = async () => {
    try {
      if (title) {
        const newTodo = {
          title,
          userId: USER_ID,
          completed: false,
        };

        setDisabledInput(true);
        setTempTodo({ id: 0, ...newTodo });
        const addedTodo = await addTodo(USER_ID, newTodo);

        setTodos((current) => [...current, addedTodo]);
      } else {
        setErrorMessage(ErrorMessage.title);
        setIsError(true);
      }
    } catch {
      setErrorMessage(ErrorMessage.addTodo);
      setIsError(true);
    } finally {
      setTitle('');
      setDisabledInput(false);
      setTempTodo(null);
    }
  };

  const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    addTodoToServer();
  };

  const deleteTodoFromServer = async (todoId: number) => {
    setLoadingTodoIds(current => [...current, todoId]);

    try {
      await deleteTodo(todoId);
      setTodos(current => current.filter(todo => todo.id !== todoId));
    } catch {
      setErrorMessage(ErrorMessage.deleteTodo);
    } finally {
      setLoadingTodoIds([0]);
    }
  };

  const onButtonRemove = (todoId: number) => {
    deleteTodoFromServer(todoId);
  };

  const removeCompletedTodos = async () => {
    const completedTodoIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    try {
      setLoadingTodoIds(current => [...current, ...completedTodoIds]);

      await Promise.all(
        completedTodoIds.map(id => deleteTodo(id)),
      );

      setTodos(current => current.filter(todo => !todo.completed));
    } catch {
      setIsError(true);
      setErrorMessage(ErrorMessage.deleteTodo);
    } finally {
      setLoadingTodoIds([0]);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <NewTodo
          allTodosCompleted={allTodosCompleted}
          title={title}
          setTitle={setTitle}
          disabledInput={disabledInput}
          onFormSubmit={onFormSubmit}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={todos}
              filterBy={filterBy}
              tempTodo={tempTodo}
              onButtonRemove={onButtonRemove}
              loadingTodoIds={loadingTodoIds}
            />

            <Filter
              filterBy={filterBy}
              setFilterBy={setFilterBy}
              todos={todos}
              removeCompletedTodos={removeCompletedTodos}
            />
          </>
        )}
      </div>
      <TodoWarning
        isError={isError}
        setIsError={setIsError}
        errorMessage={errorMessage}
      />
    </div>
  );
};
