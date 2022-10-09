/* eslint-disable no-console */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { Header } from './components/Header';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import {
  getTodos,
  postTodos,
  createTodo,
} from './api/todos';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [hasError, setHasError] = useState(false);
  const [errorName, setErrorName] = useState('');
  const [filter, setFilter] = useState('all');
  const [title, setTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const getOurTodos = async () => {
    try {
      setTodos(await getTodos(user?.id || 0));
    } catch {
      setHasError(true);
      setErrorName("Error, Todos can't be download");
    }
  };

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    getOurTodos();
  }, []);

  if (hasError) {
    setTimeout(() => {
      setHasError(false);
    }, 3000);
  }

  const filterTodos = todos.filter(todo => {
    switch (filter) {
      case 'all':
        return todo;
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;

      default:
        return todo;
    }
  });

  const postNewTodo = async (todo: string) => {
    setIsAdding(true);
    try {
      setTodos([...todos, await postTodos(user?.id || 0, todo)]);
    } catch {
      setHasError(true);
      setErrorName('Unable to add a todo');
    } finally {
      setIsAdding(false);
      setTitle('');
    }
  };

  const removeTodo = async (todoId: number) => {
    try {
      await createTodo(todoId);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    } catch {
      setHasError(true);
      setErrorName('Unable to delete a todo');
    }
  };

  const todoCompleted = todos.filter(todo => todo.completed);

  const ClearCompletedTodo = () => {
    todoCompleted.filter(todo => removeTodo(todo.id));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          newTodoField={newTodoField}
          title={title}
          onSetQuery={setTitle}
          setHasError={setHasError}
          setErrorName={setErrorName}
          onPostNewTodo={postNewTodo}
          isAdding={isAdding}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={filterTodos}
              isAdding={isAdding}
              onDeleteTodo={removeTodo}

            />

            <TodoFooter
              todos={todos}
              filter={filter}
              onSetFilter={setFilter}
              ClearCompletedTodo={ClearCompletedTodo}
            />
          </>
        )}
      </div>

      <ErrorNotification
        hasError={hasError}
        errorName={errorName}
        setHasError={setHasError}
      />
    </div>
  );
};
