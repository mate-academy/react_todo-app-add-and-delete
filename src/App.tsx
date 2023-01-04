import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';

import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { ErrorNotification } from
  './components/ErrorNotification/ErrorNotification';

import { getTodos } from './api/todos';

import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error] = useState(false);

  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const loadTodos = async () => {
    if (!user) {
      return;
    }

    const loadedTodos = await getTodos(user.id);

    setTodos(loadedTodos);
  };

  loadTodos();

  const activeTodos = todos.filter(todo => todo.completed === false).length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <Header newTodoField={newTodoField} />

      {todos.length > 0 && (
        <>
          <TodoList todos={todos} />

          <Footer
            activeTodos={activeTodos}
          />
        </>
      )}

      {error && (<ErrorNotification />)}
    </div>
  );
};
