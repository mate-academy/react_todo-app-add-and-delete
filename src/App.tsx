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
  const [showFooter, setShowFooter] = useState(false);
  const [query, setQuery] = useState('');
  const [isDisabledInput, setIsDisableInput] = useState(false);
  const [error, setError] = useState(false);
  const [loader, setLoader] = useState(false);
  const [focusedTodoId, setFocusetTodoId] = useState<number>(Infinity);

  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    const getTodosFromServer = async () => {
      const todosFromServer = user && await getTodos(user.id);

      if (user) {
        setTodos(await getTodos(user.id));
      }

      // condition to show footer
      if (todosFromServer && todosFromServer.length > 0) {
        setShowFooter(true);
      }
    };

    getTodosFromServer();
  }, []);

  const addNewTodo = async (todoData: Todo) => {
    setLoader(true);
    setIsDisableInput(true);
    const newTodo = await addTodo(todoData);

    setTodos(previousTodos => ([
      ...previousTodos,
      newTodo,
    ]));

    setIsDisableInput(false);
    setLoader(false);
    setShowFooter(true);
  };

  const deleteTodo = async (todoId: number) => {
    setLoader(true);
    setFocusetTodoId(todoId);
    await removeTodo(todoId);

    const updatedTodos = todos.filter(todo => todo.id !== todoId);

    if (updatedTodos.length === 0) {
      setShowFooter(false);
    }

    setLoader(false);
    setTodos(updatedTodos);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          newTodoField={newTodoField}
          query={query}
          isDisabledInput={isDisabledInput}
          onQueryChange={setQuery}
          onErrorChange={setError}
          onAddNewTodo={addNewTodo}
        />

        <TodoList
          todos={todos}
          focusedTodoId={focusedTodoId}
          loader={loader}
          onDeleteTodo={deleteTodo}
        />

        {showFooter && (
          <Footer
            todos={todos}
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
