import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { Footer } from './components/Footer';
import { Filter } from './types/enums/filter';
import { Error } from './types/Error';
import { ErrorMessage } from './components/ErrorMessage';
import { Header } from './components/Header';

const USER_ID = 12156;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [error, setError] = useState<Error | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deleteTodoId, setDeleteTodoId] = useState<number | null>(null);

  useEffect(() => {
    getTodos(USER_ID)
      .then(res => {
        setTodos(res);
      })
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

    addTodo(temp)
      .then(res => {
        setTodos(prev => [
          ...prev,
          res,
        ]);
      })
      .catch(() => setError(Error.UnableToAdd))
      .finally(() => setTempTodo(null));
  }, []);

  const deleteCurrentTodo = useCallback((id: number) => {
    setDeleteTodoId(id);
    deleteTodo(id)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
      })
      .catch(() => setError(Error.UnableToDelete))
      .finally(() => {
        setDeleteTodoId(null);
      });
  }, []);

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
          deleteTodo={deleteCurrentTodo}
          deleteTodoId={deleteTodoId}
        />
        <Footer
          filterTodos={setFilter}
          isCompletedTodos={isCompletedTodos}
          activeTodosCount={activeTodosCount}
        />
        {error && <ErrorMessage error={error} close={() => setError(null)} />}
      </div>
    </div>
  );
};
