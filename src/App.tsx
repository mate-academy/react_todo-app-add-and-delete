/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { addTodo, getTodos, removeTodo } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { TodoList } from './components/TodoList/TodoList';
import {
  ErrorNotification,
} from './components/ErrorNotification/ErrorNotification';
import { Footer } from './components/Footer/Footer';
import { Todo } from './types/Todo';
import { Header } from './components/Header/Header';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [showFooter, setShowFooter] = useState(true);
  const [query, setQuery] = useState('');
  const [error, setError] = useState(false);

  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    const getTodosFromServer = async () => {
      const todosFromServer = user && await getTodos(user.id);

      if (todosFromServer) {
        setTodos(todosFromServer);
      }
    };

    getTodosFromServer();
  }, []);

  const addNewTodo = async (todoData: Todo) => {
    const newTodo = await addTodo(todoData);

    setTodos(previousTodos => ([
      ...previousTodos,
      newTodo,
    ]));

    setShowFooter(true);
  };

  const deleteTodo = async (todoId: number) => {
    await removeTodo(todoId);

    const updatedTodos = todos.filter(todo => todo.id !== todoId);

    if (updatedTodos.length === 0) {
      setShowFooter(false);
    }

    setTodos(updatedTodos);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoField={newTodoField}
          query={query}
          onQueryChange={setQuery}
          onErrorChange={setError}
          onAddNewTodo={addNewTodo}
        />
        <TodoList
          todos={todos}
          onDeleteTodo={deleteTodo}
        />
        {showFooter && (
          <Footer
            onTodosChange={setTodos}
          />
        )}

      </div>

      {error && (
        <ErrorNotification
          query={query}
          onErrorChange={setError}
        />
      )}
    </div>
  );
};
