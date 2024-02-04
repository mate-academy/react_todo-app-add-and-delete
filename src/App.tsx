import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList';
import { addTodos, deleteTodos, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { Footer } from './components/Footer';
import { Filter } from './types/Filter';
import { Error } from './types/Error';
import { ErrorMessage } from './components/ErrorMessage';
import { Header } from './components/Header';

const USER_ID = 27;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [error, setError] = useState<Error | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deleteTodoId, setDeleteTodoId] = useState<number | null>(null);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setError(Error.UnableToLoadAll));
  }, []);

  const filterTodos = useCallback((currentTodos: Todo[], query: Filter) => {
    return currentTodos.filter(todo => {
      switch (query) {
        case Filter.All:
          return todo;
        case Filter.Completed:
          return todo.completed;
        case Filter.Active:
          return !todo.completed;
        default:
          return todo;
      }
    });
  }, []);

  const filteredTodos = useMemo(() => {
    return filterTodos(todos, filter);
  }, [todos, filter, filterTodos]);

  const activeTodosCount = useMemo(() => {
    return todos.filter(todo => todo.completed !== true).length;
  }, [todos]);

  const isCompletedTodos = useMemo(() => {
    return todos
      .filter(todo => todo.completed === true).length > 0;
  }, [todos]);

  const addNewTodo = useCallback((title: string) => {
    if (title.trim() === '') {
      setError(Error.NoTitle);

      return;
    }

    const temp = {
      title,
      id: 0,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(temp);
    setError(null);

    addTodos(temp)
      .then(res => {
        setTodos(prev => [
          ...prev,
          res,
        ]);
      })
      .catch(() => setError(Error.UnableToAdd))
      .finally(() => {
        setTempTodo(null);
      });
  }, []);

  const deleteCurrentTodo = useCallback((id: number) => {
    setDeleteTodoId(id);
    deleteTodos(id)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
      })
      .catch(() => setError(Error.UnableToDelete))
      .finally(() => {
        setDeleteTodoId(null);
      });
  }, []);

  const deleteCompletedTodos = useCallback(() => {
    const completedTodoIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    Promise.all(completedTodoIds.map(id => deleteTodos(id)))
      .then(() => {
        setTodos(prev => prev.filter(
          todo => !completedTodoIds.includes(todo.id),
        ));
      })
      .catch(() => setError(Error.UnableToDelete))
      .finally(() => {
        setDeleteTodoId(null);
      });
  }, [todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header addTempTodo={addNewTodo} disabled={!!tempTodo} />
        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          deleteTodos={deleteCurrentTodo}
          deleteTodosId={deleteTodoId}
        />
        <Footer
          filterTodos={setFilter}
          currentFilter={filter}
          isCompletedTodos={isCompletedTodos}
          activeTodosCount={activeTodosCount}
          deleteCompletedTodos={deleteCompletedTodos}
        />
      </div>
      {error && <ErrorMessage error={error} close={() => setError(null)} />}
    </div>
  );
};
