/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext, useEffect, useState,
} from 'react';
import { postTodos, getTodos } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
// eslint-disable-next-line max-len
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Error } from './types/Error';
import { TempTodo, Todo } from './types/Todo';

enum FilterQuery {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState(Error.None);
  const [filterQuery, setFilterQuery] = useState(FilterQuery.All);
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<TempTodo | null>(null);
  const user = useContext(AuthContext);

  // Add Todo
  const addTodo = async (title:string) => {
    setIsLoading(true);
    setTempTodo({ id: 0, title, completed: false });

    if (user) {
      try {
        const newTodo = {
          userId: user.id,
          title,
          completed: false,
        };

        const newAddedTodo = await postTodos(newTodo);

        setTodos(prevTodos => [...prevTodos, newAddedTodo]);
      } catch (error) {
        setErrorMessage(Error.AddTodo);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Delete Todo
  const deleteTodo = async (id:number) => {
    try {
      await deleteTodo(id);
    } catch {
      setErrorMessage(Error.DeleteTodo);
    }

    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };

  // Get Todo
  useEffect(() => {
    if (!user) {
      return;
    }

    getTodos()
      .then(loadedTodos => {
        setTodos(loadedTodos);
      })
      .catch(() => {
        setErrorMessage(Error.LoadingError);
      });
  }, []);

  const filteredTodos = [...todos].filter(todo => {
    switch (filterQuery) {
      case FilterQuery.Active:
        return !todo.completed;
      case FilterQuery.Completed:
        return todo.completed;
      default:
        return todo;
    }
  });

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
          setError={setErrorMessage}
          isLoading={isLoading}
          addTodo={addTodo}
        />

        <TodoList
          todos={filteredTodos}
          temporaryTodo={tempTodo}
          deleteTodo={deleteTodo}
        />

        <Footer
          filteredItemsCount={filteredTodos.length}
          onFilterChange={setFilterQuery}
          filterQuery={filterQuery}
        />
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
