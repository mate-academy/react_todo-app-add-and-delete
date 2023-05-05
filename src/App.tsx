import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Header } from './components/Header';
import { Todo } from './types/Todo';
import { deleteTodo, getTodos, postTodo } from './api/todos';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { Notification } from './components/Notification';
import { StatusTodos } from './types/StatusTodo';

const USER_ID = 9946;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState(StatusTodos.ALL);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [query, setQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isTodoId, setIsTodoId] = useState<number[] | null>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (status) {
        case StatusTodos.ACTIVE:
          return !todo.completed;
        case StatusTodos.COMPLETED:
          return todo.completed;
        default:
          return StatusTodos.ALL;
      }
    });
  }, [status, todos]);

  const loadTodos = async () => {
    try {
      const todosData = await getTodos(USER_ID);

      if ('Error' in todosData) {
        throw new Error('Error in TodosData');
      } else {
        setTodos(todosData);
      }
    } catch (error) {
      setIsError(true);
      setErrorMessage("Can't create a todo");
      throw new Error('Error in loadData');
    }
  };

  const addNewTodo = async (
    title: string,
  ) => {
    if (!title) {
      setIsError(true);
      setErrorMessage("Title can't be empty");

      return;
    }

    setLoading(true);

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo(newTodo);

    try {
      const todoData = await postTodo(USER_ID, newTodo);

      setTodos((prev: Todo[]) => {
        return [...prev, todoData];
      });
      setTempTodo(null);
      setQuery('');
    } catch {
      setIsError(true);
      setErrorMessage('Unable to add a todo');
      throw new Error('Error in Header');
    } finally {
      setLoading(false);
    }
  };

  const removeTodo = async (todoId: number) => {
    setIsTodoId([todoId]);

    try {
      await deleteTodo(todoId);

      setTodos(todos.filter(todo => todo.id !== todoId));
    } catch {
      setIsError(true);
      setErrorMessage('Unable to delete a todo');
      throw new Error('Error in Delete Method');
    } finally {
      setIsTodoId([]);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsError(false);
      setErrorMessage('');
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [isError, errorMessage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          titleTodos={query}
          changeTitle={setQuery}
          onAddTodo={addNewTodo}
        />

        <section className="todoapp__main">
          <TodoList
            todos={filteredTodos}
            onDeleteTodo={removeTodo}
            tempTodo={tempTodo}
            loading={loading}
            isTodoId={isTodoId}
          />
        </section>

        {!!todos.length && (
          <TodoFilter
            visibleTodos={todos}
            status={status}
            onStatusChange={setStatus}
            onChangeTodo={setTodos}
          />
        )}

      </div>

      {isError && (
        <Notification
          errorMessage={errorMessage}
          error={isError}
          deleteError={setIsError}
        />
      )}

    </div>
  );
};
