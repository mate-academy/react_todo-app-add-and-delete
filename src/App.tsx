/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useEffect, useMemo, useState, useCallback,
} from 'react';
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import { Footer } from './components/Footer';
import { Todo } from './types/Todo';
import { getTodos, deleteTodo } from './api/todos';
import { Filter } from './types/Filter';
import { TodoList } from './components/TodoList';
import { Error } from './components/Error';

import { ErrorsType } from './types/ErrorsType';

const USER_ID = 10344;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isError, setIsError] = useState(false);
  const [filterBy, setFilterBy] = useState<Filter>(Filter.ALL);
  const [errorType, setErrorType] = useState<ErrorsType>(ErrorsType.NONE);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState('');
  const [isDeletedCompleted, setIsDeletedCompleted] = useState(false);

  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filterBy) {
        case Filter.ACTIVE:
          return !todo.completed;
        case Filter.COMPLETED:
          return todo.completed;
        case Filter.ALL:
        default:
          return true;
      }
    });
  }, [todos, filterBy]);

  const loadTodos = async () => {
    setIsError(false);
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch (error) {
      setIsError(true);
    }
  };

  const activeTodos = useMemo(
    () => todos.reduce((num, todo) => {
      return todo.completed ? num : num + 1;
    }, 0),
    [todos],
  );

  const completedTodos = visibleTodos.length - activeTodos;

  /* const addTodo = (newTodo: Todo) => {
    setTodos(prevTodos => [...prevTodos, newTodo]);
  }; */

  const DeleteTodo = useCallback(async (todo: Todo) => {
    try {
      setErrorType(ErrorsType.NONE);
      setTempTodo(todo);
      await deleteTodo(todo.id);
      loadTodos();
    } catch {
      setErrorType(ErrorsType.DELETE);
    } finally {
      setTempTodo(null);
    }
  }, []);

  const deleteCompleted = useCallback(async () => {
    const completedTodosList = todos.filter(todo => todo.completed);

    setIsDeletedCompleted(true);
    setIsError(false);

    try {
      const completedIds = await Promise.all(
        completedTodosList.map(({ id }) => deleteTodo(id).then(() => id)),
      );

      setTodos((prevTodos) => {
        return prevTodos.filter(({ id }) => !completedIds.includes(id));
      });
    } catch {
      setErrorType(ErrorsType.DELETE);
    } finally {
      setIsDeletedCompleted(false);
    }
  }, [todos]);

  /*  const displayError = useCallback((error: ErrorsType) => {
    setErrorType(error);
    setIsError(true);
  }, []); */

  const handleFormSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!title.trim()) {
        setErrorType(ErrorsType.EMPTY);

        return;
      }

      setErrorType(ErrorsType.NONE);

      const todoToAdd: Todo = {
        id: 0,
        title,
        userId: USER_ID,
        completed: false,
      };

      setTempTodo({ ...todoToAdd });

      try {
        // const newTodo = await addTodo(todoToAdd);

        // addTodo(newTodo);
        setTitle('');
      } catch {
        setErrorType(ErrorsType.ADD);
      }

      setTempTodo(null);
    }, [title],
  );

  const hideErrorMessage = useCallback(() => {
    setIsError(false);
  }, []);

  useEffect(() => {
    loadTodos();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={cn('todoapp__toggle-all', {
                active: !activeTodos,
              })}
            />

          )}

          <form onSubmit={handleFormSubmit}>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>

        {visibleTodos && (
          <TodoList
            todos={visibleTodos}
            tempTodo={tempTodo}
            deleteTodo={DeleteTodo}
            isDeletedCompleted={isDeletedCompleted}
          />
        )}

        {todos.length > 0 && (
          <Footer
            todos={todos}
            activeTodos={activeTodos}
            filter={filterBy}
            completedTodos={completedTodos}
            setFilter={setFilterBy}
            deleteCompleted={deleteCompleted}
          />
        )}

      </div>

      {isError && (
        <Error
          isError={isError}
          onHide={hideErrorMessage}
          errorType={errorType}
        />
      )}

    </div>
  );
};
