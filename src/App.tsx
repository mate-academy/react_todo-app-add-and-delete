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
import { TodoForm } from './components/TodoForm';
import { ErrorsType } from './types/ErrorsType';

const USER_ID = 10344;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isError, setIsError] = useState(false);
  const [filterBy, setFilterBy] = useState<Filter>(Filter.ALL);
  const [errorType, setErrorType] = useState<ErrorsType>(ErrorsType.NONE);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
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

  const displayError = useCallback((error: ErrorsType) => {
    setErrorType(error);
    setIsError(true);
  }, []);

  const hideError = useCallback(() => {
    setIsError(false);
  }, []);

  const loadTodos = async () => {
    hideError();
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch (error) {
      displayError(ErrorsType.DOWNLOAD);
    }
  };

  const activeTodos = useMemo(
    () => todos.reduce((num, todo) => {
      return todo.completed ? num : num + 1;
    }, 0),
    [todos],
  );

  const completedTodos = visibleTodos.length - activeTodos;

  const addTodo = (newTodo: Todo) => {
    setTodos(prevTodos => [...prevTodos, newTodo]);
  };

  const DeleteTodo = useCallback(async (todo: Todo) => {
    try {
      setErrorType(ErrorsType.NONE);
      setTempTodo(todo);
      await deleteTodo(todo.id);
      loadTodos();
    } catch {
      displayError(ErrorsType.DELETE);
    } finally {
      setTempTodo(null);
    }
  }, []);

  const deleteCompleted = useCallback(async () => {
    const completedTodosList = todos.filter(todo => todo.completed);

    setIsDeletedCompleted(true);
    hideError();

    try {
      const completedIds = await Promise.all(
        completedTodosList.map(({ id }) => deleteTodo(id).then(() => id)),
      );

      setTodos((prevTodos) => {
        return prevTodos.filter(({ id }) => !completedIds.includes(id));
      });
    } catch {
      displayError(ErrorsType.DELETE);
    } finally {
      setIsDeletedCompleted(false);
    }
  }, [todos]);

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
              aria-label="display all"
              type="button"
              className={cn('todoapp__toggle-all', {
                active: !activeTodos,
              })}
            />

          )}
          <TodoForm
            onAdd={addTodo}
            onChange={setTempTodo}
            displayError={displayError}
            hideError={hideError}
            userId={USER_ID}
          />
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
          onHide={hideError}
          errorType={errorType}
        />
      )}

    </div>
  );
};
