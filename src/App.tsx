/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { deleteTodo, getTodos, postTodo } from './api/todos';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { Notification } from './components/Notification/Notification';
import { TodoList } from './components/TodoList/TodoList';
import { ErrorTypes } from './types/ErrorTypes';
import { Status } from './types/Status';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';

const USER_ID = 6992;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState<Status>(Status.All);
  const [error, setError] = useState<ErrorTypes | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isDisableInput, setIsDisableInput] = useState(false);
  const [processedIds, setProcessedIds] = useState<number[]>([]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(todosFromServer => {
        setTodos(todosFromServer);
      })
      .catch(() => {
        setError(ErrorTypes.LOAD);
        setTimeout(() => {
          setError(null);
        }, 3000);
      });
  }, []);

  const filteredTodos = () => {
    switch (filterType) {
      case Status.Active:
        return todos.filter(todo => !todo.completed);
      case Status.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  const handleAddTodo = useCallback(async (title: string) => {
    setError(null);
    setIsDisableInput(true);

    try {
      if (!title.trim()) {
        setError(ErrorTypes.INPUT);

        return;
      }

      if (USER_ID) {
        const dataTempTodo = {
          id: 0,
          userId: USER_ID,
          title,
          completed: false,
        };

        const dataNewTodo = {
          userId: USER_ID,
          title,
          completed: false,
        };

        setTempTodo(dataTempTodo);

        const newTodo = await postTodo(dataNewTodo);

        setTodos(prevTodos => [...prevTodos, newTodo]);
      }
    } catch {
      setError(ErrorTypes.ADD);
    } finally {
      setTempTodo(null);
      setIsDisableInput(false);
    }
  }, []);

  const handleDeleteTodo = useCallback(async (todoId: number) => {
    setError(null);
    setProcessedIds(deleteIds => [...deleteIds, todoId]);

    try {
      await deleteTodo(todoId);

      setTodos(currentTodos => currentTodos
        .filter(currentTodo => currentTodo.id !== todoId));
    } catch {
      setError(ErrorTypes.DELETE);
    } finally {
      setProcessedIds(deleteIds => deleteIds.filter(id => id !== todoId));
    }
  }, [processedIds]);

  const completedTodos = useMemo(() => todos.filter(todo => todo.completed),
    [todos]);

  const handleClearCompleted = useCallback(async () => {
    setProcessedIds(completedTodos.map(todo => todo.id));
    completedTodos.forEach(todo => handleDeleteTodo(todo.id));
  }, [completedTodos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          createTodo={handleAddTodo}
          isDisableInput={isDisableInput}
        />

        <section className="todoapp__main">
          <TodoList
            todos={filteredTodos()}
            tempTodo={tempTodo}
            deleteTodo={handleDeleteTodo}
            processedIds={processedIds}
          />
        </section>

        {/* Hide the footer if there are no todos */}
        {todos.length > 0
            && (
              <Footer
                todos={todos}
                setFilterType={setFilterType}
                filterType={filterType}
                onClearCompleted={handleClearCompleted}
              />
            )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      {error
        && (
          <Notification
            error={error}
          />
        )}
    </div>
  );
};
