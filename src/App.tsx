/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useEffect, useState,
} from 'react';
import { postTodos, getTodos, deleteTodo } from './api/todos';
// eslint-disable-next-line max-len
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Error } from './types/Error';
import { TempTodo, Todo } from './types/Todo';

enum FilterStatus {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

const USER_ID = 5997;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState(Error.None);
  const [filterStatus, setFilterStatus] = useState(FilterStatus.All);
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo] = useState<TempTodo | null>(null);

  // Add Todo
  const addTodo = async () => {
    setIsLoading(true);
    const newTodo = {
      id: 0,
      userId: USER_ID,
      title: newTodoTitle,
      completed: false,
    };

    setTodos(curr => [...curr, newTodo]);

    return postTodos(newTodo)
      .then(addedTodo => {
        setTodos([...todos, addedTodo]);
      })
      .catch(() => {
        setErrorMessage(Error.AddTodo);
      })
      .finally(() => {
        setNewTodoTitle('');
        setIsLoading(false);
      });
  };

  // Delete Todo
  const handleDeleteTodo = (todoId:number) => {
    deleteTodo(todoId)
      .then(() => setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId)))
      .catch(() => setErrorMessage(Error.DeleteTodo));
  };

  // Get Todo
  useEffect(() => {
    getTodos(USER_ID)
      .then(loadedTodos => {
        setTodos(loadedTodos);
      })
      .catch(() => {
        setErrorMessage(Error.LoadingError);
      });
  }, []);

  const filteredTodos = [...todos].filter(todo => {
    switch (filterStatus) {
      case FilterStatus.Active:
        return !todo.completed;
      case FilterStatus.Completed:
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
          deleteTodo={handleDeleteTodo}
        />

        <Footer
          filteredItemsCount={filteredTodos.length}
          changeFilterStatus={setFilterStatus}
          filterStatus={filterStatus}
        />
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
