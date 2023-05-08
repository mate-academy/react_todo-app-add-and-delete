import React, {
  useEffect, useState, FormEvent, useMemo,
} from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Notification } from './components/Notification';
import { createTodo, deleteTodo, getTodos } from './api/todos';
import { TodoStatus } from './types/TodoStatus';
import { ErrorType } from './types/ErrorType';

export const USER_ID = 9944;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<TodoStatus>(TodoStatus.All);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [errorType, setErrorType] = useState<ErrorType>(ErrorType.NoError);
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadedTodoId, setLoadedTodoId] = useState<number[]>([]);
  const isError = errorType !== ErrorType.NoError;

  const getTodoList = async () => {
    try {
      const newTodoList = await getTodos(USER_ID);

      setTodos(newTodoList);
    } catch {
      setErrorType(ErrorType.AddError);
    }
  };

  useEffect(() => {
    if (isError) {
      setTimeout(() => {
        setErrorType(ErrorType.NoError);
      }, 3000);
    }
  }, [isError, errorType]);

  useEffect(() => {
    getTodoList();
  }, []);

  const filteredTodos = useMemo(() => {
    switch (status) {
      case TodoStatus.Active:
        return todos.filter(todo => !todo.completed);

      case TodoStatus.Completed:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  }, [todos, status]);

  const addTodo = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newTodoTitle.trim()) {
      setErrorType(ErrorType.EmptyInput);

      return;
    }

    const newTempTodo = {
      id: 0,
      title: newTodoTitle,
      completed: false,
    };

    setTempTodo({ ...newTempTodo, userId: USER_ID });
    setIsLoading(true);
    setNewTodoTitle('');

    try {
      const newTodo = await createTodo(USER_ID, newTodoTitle);

      setTodos((prevTodos) => [...prevTodos, newTodo]);
    } catch {
      setErrorType(ErrorType.AddError);
    } finally {
      setIsLoading(false);
      setTempTodo(null);
    }
  };

  const removeTodo = async (todoId: number) => {
    try {
      setLoadedTodoId(state => [...state, todoId]);
      await deleteTodo(todoId);
      setTodos((prevTodos) => prevTodos.filter(todo => todo.id !== todoId));
    } catch {
      setErrorType(ErrorType.DeleteError);
    } finally {
      setLoadedTodoId([]);
    }
  };

  const clearCompletedTodos = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    setLoadedTodoId(completedTodos.map(todo => todo.id));

    completedTodos.forEach(todo => {
      deleteTodo(todo.id)
        .then(() => {
          setTodos(todos.filter(todoItem => !todoItem.completed));
        })
        .catch(() => {
          setErrorType(ErrorType.DeleteError);
        });
    });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
          addTodo={addTodo}
          isLoading={isLoading}
        />

        <TodoList
          todos={filteredTodos}
          removeTodo={removeTodo}
          loadedTodoId={loadedTodoId}
          tempTodo={tempTodo}
        />

        {todos.length > 0 && (
          <Footer
            status={status}
            setStatus={setStatus}
            todos={todos}
            clearCompletedTodos={clearCompletedTodos}
          />
        )}
      </div>

      {isError && (
        <Notification
          errorType={errorType}
        />
      )}

    </div>
  );
};
