/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { useEffect, FC, useState, useMemo } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, addTodos, delateTodos, patchTodos } from './api/todos';
import { TodoList } from './components/TodoList/TodoList';
import { getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { TodoFiler } from './components/TodoFilter/TodoFilter';
import { Filters } from './types/Filters';
import { Header } from './components/Header/Header';
import { ErrorMesages } from './components/ErrorMesages/ErrorMesagws';
import { getActiveTodos } from './servisec/getActiveTodos';

export const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loadError, setLoadError] = useState('');
  const [filter, setFilter] = useState(Filters.All);
  const [loading, setLoading] = useState<number[] | null>(null);
  const [delateTodoId, setDelateTodoId] = useState<number[] | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const newError = (error: string) => {
    setLoadError(error);
    setTimeout(() => setLoadError(''), 3000);
  };

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const todo = await getTodos();

        setTodos(todo);
      } catch (error) {
        newError('Unable to load todos');
      }
    };

    loadTodos();
  }, []);

  const creatTodo = async ({ userId, completed, title }: Todo) => {
    try {
      setTempTodo({ userId, completed, title, id: 0 });
      const nuwTodo = await addTodos({ userId, completed, title });

      setTodos(curenTodos => [...curenTodos, nuwTodo]);
    } catch (error) {
      newError('Unable to add a todo');
      throw error;
    } finally {
      setTempTodo(null);
    }
  };

  const deletedTodo = async (todosId: number[]) => {
    try {
      setLoadError('');
      setLoading(todosId);
      setDelateTodoId(todosId);

      for (const id of todosId) {
        await delateTodos(id);
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
      }
    } catch (error) {
      newError('Unable to delete a todo');
      throw error;
    } finally {
      setLoading(null);
    }
  };

  const clearCmplitedTodos = async () => {
    const filterTodos = todos.filter(todo => todo.completed);

    try {
      const delatECalback = async (todo: Todo) => {
        try {
          await deletedTodo([todo.id]);

          return { id: todo.id, status: 'resolved' };
        } catch {
          newError('Unable to delete a todo');

          return { id: todo.id, status: 'rejected' };
        }
      };

      await Promise.allSettled(filterTodos.map(delatECalback));

      setTodos(currentTodos => getActiveTodos(currentTodos));
    } catch {
      newError('Unable to clear complited todos');
    }
  };

  const hendleEdit = async (id: number, data: Partial<Todo>) => {
    try {
      const editTodo = await patchTodos(id, data);

      setTodos(currToto =>
        currToto.map(todo => {
          if (todo.id === id) {
            return editTodo;
          }

          return todo;
        }),
      );
    } catch {
      newError('Unable to edit todo');
    }
  };

  const preparedTodos = useMemo(() => {
    switch (filter) {
      case Filters.Active:
        return todos.filter(todo => !todo.completed);
      case Filters.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [filter, todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          creatTodo={creatTodo}
          loading={loading}
          setLoading={setLoading}
          newError={newError}
        />

        <TodoList
          loading={loading}
          todos={preparedTodos}
          onDelete={deletedTodo}
          delateTodoId={delateTodoId}
          tempTodo={tempTodo}
          onEdit={hendleEdit}
        />

        {todos.length > 0 && (
          <TodoFiler
            filter={filter}
            setFilter={setFilter}
            todos={todos}
            onClear={clearCmplitedTodos}
          />
        )}
      </div>
      <ErrorMesages loadError={loadError} setLoadError={setLoadError} />
    </div>
  );
};
