/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { useEffect, FC, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  patchTodos,
  USER_ID,
  createTodos,
  deleteTodos,
  getTodos,
} from './api/todos';

import { Todo } from './types/Todo';
import { Filters } from './types/Filters';
import { TodoFilter } from './components/todoFilter';
import { ErrorMessage } from './components/errorMessage';
import { ErrorTypes } from './types/ErrorTypes';
import { Header } from './components/Header';
import { TodoList } from './components/todoList';

export const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<Filters>(Filters.All);
  const [loading, setLoading] = useState<number[] | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const showNewError = (error: string) => {
    setErrorMessage(error);
    setTimeout(() => setErrorMessage(''), 3000);
  };

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const todo = await getTodos();

        setTodos(todo);
      } catch (error) {
        showNewError(ErrorTypes.Load);
      }
    };

    loadTodos();
  }, []);

  const createTodo = async ({ userId, completed, title }: Todo) => {
    try {
      setTempTodo({ userId, completed, title, id: 0 });
      const newTodo = await createTodos({ userId, completed, title });

      setTodos(currTodos => [...currTodos, newTodo]);
    } catch (error) {
      showNewError(ErrorTypes.Add);
      throw error;
    } finally {
      setTempTodo(null);
    }
  };

  const deletedTodo = async (todosId: number[]) => {
    try {
      setErrorMessage('');
      setLoading(todosId);

      for (const id of todosId) {
        await deleteTodos(id);
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
      }
    } catch (error) {
      showNewError(ErrorTypes.Delete);
      throw error;
    } finally {
      setLoading(null);
    }
  };

  const activeTodosCount = useMemo(() => {
    return todos.reduce(
      (count, todo) => (!todo.completed ? count + 1 : count),
      0,
    );
  }, [todos]);

  const clearCompletedTodos = async () => {
    const filterTodos = todos.filter(todo => todo.completed);

    try {
      const deleteCallback = async (todo: Todo) => {
        try {
          await deletedTodo([todo.id]);

          return { id: todo.id, status: 'resolved' };
        } catch {
          showNewError(ErrorTypes.Delete);

          return { id: todo.id, status: 'rejected' };
        }
      };

      const rest = await Promise.allSettled(filterTodos.map(deleteCallback));

      const resolvedId = rest.reduce(
        (acc, item) => {
          if (item.status === 'rejected') {
            return acc;
          }

          if (item.value.status === 'resolved') {
            return { ...acc, [item.value.id]: item.value.id };
          }

          return acc;
        },
        {} as Record<number, number>,
      );

      setTodos(currentTodos =>
        currentTodos.filter(todo => {
          if (resolvedId[todo.id] && todo.completed) {
            return false;
          }

          return true;
        }),
      );
    } catch {
      showNewError(ErrorTypes.ClearComplited);
    }
  };

  const handlePatch = async (id: number, data: Partial<Todo>) => {
    try {
      const patchTodo = await patchTodos(id, data);

      setTodos(currTodo =>
        currTodo.map(todo => {
          if (todo.id === id) {
            return patchTodo;
          }

          return todo;
        }),
      );
    } catch {
      showNewError(ErrorTypes.Edit);
    }
  };

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case Filters.Active:
        return todos.filter(todo => !todo.completed);
      case Filters.Completed:
        return todos.filter(todo => todo.completed);
      case Filters.All:
      default:
        return todos;
    }
  }, [todos, filter]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          createTodo={createTodo}
          loading={loading}
          setLoading={setLoading}
          showNewError={showNewError}
        />

        <TodoList
          loading={loading}
          todos={filteredTodos}
          onDelete={deletedTodo}
          tempTodo={tempTodo}
          onPatch={handlePatch}
        />

        {todos.length > 0 && (
          <TodoFilter
            currentFilter={filter}
            onFilterChange={setFilter}
            todos={todos}
            activeTodosCount={activeTodosCount}
            onClear={clearCompletedTodos}
          />
        )}
      </div>
      <ErrorMessage error={errorMessage} setError={setErrorMessage} />
    </div>
  );
};
