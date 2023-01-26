/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext, useEffect, useMemo, useState,
} from 'react';
import { getTodos } from './api/todos';
import { AppContext } from './AppContext';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorMessage } from './components/ErrorMessage';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { ErrorType } from './types/ErrorType';
import { Todo } from './types/Todo';
import { client } from './utils/fetchClient';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const user = useContext(AuthContext);
  const { setError } = useContext(AppContext);

  const getTodosFromServer = async () => {
    if (!user) {
      return;
    }

    try {
      const receivedTodos = await getTodos(user.id);

      setTodos(receivedTodos);
    } catch (err) {
      setError(ErrorType.LoadingError);
    }
  };

  useEffect(() => {
    getTodosFromServer();
  }, []);

  // #region creating new Todo
  let maxId = useMemo(() => Math.max(...todos.map(todo => todo.id)), [todos]);

  const createNewTodo = (title: string) => {
    maxId += 1;

    return {
      id: maxId,
      userId: user?.id,
      title,
      completed: false,
    };
  };

  const addTodo = async (title: string) => {
    try {
      const todo = createNewTodo(title);
      const newTodo = await client.post<Todo>('/todos', todo);

      setTodos(current => [...current, newTodo]);
    } catch (err) {
      setError(ErrorType.InsertionError);
    }
  };
  // #endregion

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onAdd={addTodo}
        />
        <TodoList
          todos={todos}
        />
        <Footer
          todos={todos}
        />
      </div>

      <ErrorMessage />
    </div>
  );
};
