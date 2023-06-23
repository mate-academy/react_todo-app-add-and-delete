/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React,
{
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { UserWarning } from './UserWarning';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorMesage } from './components/ErrorMesage';
import { Filter } from './types/Filter';
import { Todo } from './types/Todo';
import { fetchTodos, fetchAddTodo, remove } from './api/todos';

const USER_ID = 10777;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(Filter.ALL);
  const [error, setError] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [deleteTodoId, setDeleteTodoId] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);

  const addTodo = async (title: string) => {
    if (!title.trim()) {
      setError("Title can't be empty");

      return;
    }

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo(newTodo);
    setIsDisabled(true);
    setError('');

    try {
      const res = await fetchAddTodo(USER_ID, newTodo);

      setTodos((prevTodo) => [...prevTodo, res]);
      setFilter(Filter.ALL);
    } catch {
      setError('Unable to add a todo');

      const timer = setTimeout(() => {
        setError('');
      }, 3000);

      clearTimeout(timer);
    } finally {
      setIsDisabled(false);
      setTempTodo(null);
    }
  };

  const deleteTodo = (id: number) => {
    setDeleteTodoId(id);
    remove(id)
      .then(() => {
        setTodos((prevTodo) => {
          return prevTodo.filter(todo => todo.id !== id);
        });
        setError('');
      })
      .catch(() => {
        setError('Unable to delete a todo');

        const timer = setTimeout(() => {
          setError('');
        }, 3000);

        return () => {
          clearTimeout(timer);
        };
      })
      .finally(() => {
        setDeleteTodoId(0);
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const arrTodos = await fetchTodos(USER_ID.toString());

        setTodos(arrTodos);
      } catch {
        setError('Unable to fetch todos');
      }
    };

    if (USER_ID) {
      fetchData();
    }
  }, []);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case Filter.ACTIVE:
        return todos.filter(todo => !todo.completed);
      case Filter.COMPLETED:
        return todos.filter(todo => todo.completed);
      case Filter.ALL:
        return todos;
      default:
        return todos;
    }
  }, [filter, todos]);

  const handleClearCompleted = useCallback(() => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach((todo) => deleteTodo(todo.id));
  }, [todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <Header
          todos={todos}
          onAdd={addTodo}
          newTodoTitle={newTodoTitle}
          onChangeTitle={setNewTodoTitle}
          isDisabled={isDisabled}
        />

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          deleteTodo={deleteTodo}
          deleteTodoId={deleteTodoId}
        />

        {todos.length > 0 && (
          <Footer
            todos={filteredTodos}
            filter={filter}
            onSelect={setFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      {error && (
        <ErrorMesage error={error} setError={setError} />
      )}
    </div>
  );
};
