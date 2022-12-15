/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  addTodo,
  getTodos,
  removeTodo,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { TodoList } from './components/TodoList/TodoList';
import {
  ErrorNotification,
} from './components/ErrorNotification/ErrorNotification';
import { Footer } from './components/Footer/Footer';
import { Todo } from './types/Todo';
import { TodoForm } from './components/TodoForm/TodoForm';
import { Error } from './types/Error';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [query, setQuery] = useState<string>('');
  const [error, setError] = useState<Error>(Error.None);
  const [showFooter, setShowFooter] = useState(false);
  const [isDisabledInput, setIsDisableInput] = useState(false);
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

      try {
        if (user) {
          setTodos(await getTodos(user.id));
        }

        // condition to show footer
        if (todosFromServer && todosFromServer.length > 0) {
          setShowFooter(true);
        }
      } catch {
        setError(Error.NoTodos);

        setTimeout(() => {
          setError(Error.None);
        }, 3000);
      }
    };

    getTodosFromServer();
  }, []);

  const addNewTodo = async (todoData: Todo) => {
    try {
      setIsDisableInput(true);

      const newTodo = await addTodo(todoData);

      setTodos(previousTodos => ([
        ...previousTodos,
        newTodo,
      ]));

      setShowFooter(true);
      setIsDisableInput(false);
    } catch {
      setError(Error.Add);
      setIsDisableInput(false);

      setTimeout(() => {
        setError(Error.None);
      }, 3000);
    }
  };

  const deleteTodo = async (todoId: number) => {
    try {
      setLoader(true);
      setFocusetTodoId(todoId);

      await removeTodo(todoId);

      const updatedTodos = todos.filter(todo => todo.id !== todoId);

      if (updatedTodos.length === 0) {
        setShowFooter(false);
      }

      setLoader(false);
      setTodos(updatedTodos);
    } catch {
      setError(Error.Delete);
      setLoader(false);

      setTimeout(() => {
        setError(Error.None);
      }, 3000);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoForm
          newTodoField={newTodoField}
          query={query}
          onQueryChange={setQuery}
          onErrorChange={setError}
          isDisabledInput={isDisabledInput}
          onAddNewTodo={addNewTodo}
        />
        <TodoList
          todos={todos}
          ocusedTodoId={focusedTodoId}
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
