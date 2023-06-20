/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React,
{
  useState,
  useEffect,
  useMemo,
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

  const addTodo = (title: string) => {
    if (!title.trim()) {
      setError('Title can\'t be empty');
      setTimeout(() => {
        setError('');
      }, 3000);

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

    fetchAddTodo(USER_ID, newTodo)
      .then((res) => {
        setTodos((prevTodo) => {
          return [...prevTodo, res];
        });

        setFilter(Filter.ALL);
      })
      .catch(() => {
        setError('Unable to add a todo');

        const timer = setTimeout(() => {
          setError('');
        }, 3000);

        return () => {
          clearTimeout(timer);
        };
      })
      .finally(() => {
        setIsDisabled(false);
        setTempTodo(null);
      });
  };

  const deleteTodo = (id: number) => {
    setDeleteTodoId(id);
    remove(id)
      .then(() => {
        // const result = todos.filter(todo => todo.id !== id);

        setTodos((prevTodo) => {
          return prevTodo.filter(todo => todo.id !== id);
        });

        // setTodos(result);
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
    return todos.filter(todo => {
      switch (filter) {
        case Filter.ACTIVE:
          return !todo.completed;
        case Filter.COMPLETED:
          return todo.completed;
        case Filter.ALL:
          return true;
        default:
          return todo;
      }
    });
  }, [filter, todos]);

  const handleClearCompleted = () => {

  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <Header
          todos={todos}
          addTodo={addTodo}
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
          isDisabled={isDisabled}
        />

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          deleteTodo={deleteTodo}
          deleteTodoId={deleteTodoId}
        />

        {!!todos.length && (
          <Footer
            todos={filteredTodos}
            filter={filter}
            setFilter={setFilter}
            onClearCompleted={handleClearCompleted}
            // tempTodo={tempTodo}
            // isLoading={isLoading}
          />
        )}
      </div>

      {error
        && (<ErrorMesage error={error} setError={setError} />)}
    </div>
  );
};
