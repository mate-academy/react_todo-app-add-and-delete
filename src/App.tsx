/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';

import { AuthContext } from './components/Auth/AuthContext';
import { NewTodo } from './components/NewTodo';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { ErrorNotice } from './components/ErrorNotice';

import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';

import { createTodo, deleteTodo, getTodos } from './api/todos';

import { ErrorNoticeType } from './types/ErrorNoticeType';

const defaultTodo = {
  id: 0,
  userId: 0,
  title: '',
  completed: false,
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [temporaryTodo, setTemporaryTodo] = useState(defaultTodo);
  const [filterType, setFilterType] = useState<FilterType>(FilterType.ALL);
  const [todosIdsForDelete, setTodosIdsForDelete] = useState<number[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorNotice, setErrorNotice]
    = useState<ErrorNoticeType>(ErrorNoticeType.None);

  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const getTodosFromServer = useCallback(
    async () => {
      try {
        if (user) {
          const todosFromServer = await getTodos(user.id);

          setTodos(todosFromServer);
        }
      } catch (error) {
        setHasError(true);
        setErrorNotice(ErrorNoticeType.LoadError);
      }
    }, [],
  );

  const filteredTodos = useMemo(() => (
    todos.filter(({ completed }) => {
      switch (filterType) {
        case FilterType.ACTIVE:
          return !completed;

        case FilterType.COMPLETED:
          return completed;

        default:
          return todos;
      }
    })
  ), [todos, filterType]);

  const completedTodos = useMemo(() => (
    todos.filter(({ completed }) => completed)
  ), [todos]);

  const postTodoToServer = useCallback(
    async (title: string) => {
      setIsAdding(true);

      if (user) {
        try {
          setTemporaryTodo(currentTodo => ({
            ...currentTodo,
            title,
            userId: user.id,
          }));

          const createdTodo = await createTodo({
            title,
            userId: user.id,
            completed: false,
          });

          setTodos(currentTodos => [...currentTodos, createdTodo]);
        } catch (error) {
          setHasError(true);
          setErrorNotice(ErrorNoticeType.AddError);
        }
      }

      setIsAdding(false);
    }, [],
  );

  const deleteTodoFromServer = useCallback(
    async (todoId: number) => {
      try {
        setTodosIdsForDelete(currentsIds => [...currentsIds, todoId]);

        await deleteTodo(todoId);

        setTodos(currTodos => (
          currTodos.filter(({ id }) => id !== todoId)
        ));

        setTodosIdsForDelete(currentsIds => (
          currentsIds.filter(id => id !== todoId)
        ));
      } catch (error) {
        setHasError(true);
        setErrorNotice(ErrorNoticeType.DeleteError);
      }
    }, [],
  );

  const clearCompletedTodos = useCallback(
    async () => {
      try {
        await Promise.all(completedTodos.map(({ id }) => (
          deleteTodoFromServer(id)
        )));
      } catch (error) {
        setHasError(true);
        setErrorNotice(ErrorNoticeType.DeleteError);
      }
    }, [],
  );

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    getTodosFromServer();
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">
        todos
      </h1>

      <div className="todoapp__content">
        <NewTodo
          newTodoField={newTodoField}
          isAdding={isAdding}
          setHasError={setHasError}
          setErrorNotice={setErrorNotice}
          postTodoToServer={postTodoToServer}
        />

        {todos.length !== 0 && (
          <>
            <TodoList
              filteredTodos={filteredTodos}
              temporaryTodo={temporaryTodo}
              isAdding={isAdding}
              todosIdsForDelete={todosIdsForDelete}
              deleteTodoFromServer={deleteTodoFromServer}
            />

            <TodoFilter
              todos={todos}
              completedTodos={completedTodos}
              filterType={filterType}
              setFilterType={setFilterType}
              clearCompletedTodos={clearCompletedTodos}
            />
          </>
        )}
      </div>

      {hasError && (
        <ErrorNotice
          hasError={hasError}
          errorNotice={errorNotice}
          setHasError={setHasError}
        />
      )}
    </div>
  );
};
