/* eslint-disable jsx-a11y/control-has-associated-label */
import React,
{
  useEffect,
  useMemo,
  useState,
  useCallback,
}
  from 'react';
import { UserWarning } from './UserWarning';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';

const USER_ID = 11219;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [status, setStatus] = useState('all');
  const [query, setQuery] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [idToDelete, setIdToDelete] = useState(-1);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    setErrorMessage('');
    getTodos(USER_ID)
      .then(data => {
        setTodos(data);
      })
      .catch(() => {
        setErrorMessage('An error occurred while executing the request');
        setTodos([]);
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!query.trim()) {
      setErrorMessage('Title can\'t be empty');
    }

    const tempTodoData: Todo = {
      id: 0,
      title: query,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo(tempTodoData);

    if (query.trim()) {
      addTodo({
        title: query,
        userId: USER_ID,
        completed: false,
      })
        .then((responseTodo) => {
          setTodos((prevTodos) => [...prevTodos, responseTodo]);
          setLoading(false);
          setQuery('');
        })
        .catch(() => {
          setErrorMessage('Unable to add a todo');
        })
        .finally(() => {
          setTempTodo(null);
        });
    }
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const deleteItem = useCallback((todoId: number) => {
    setLoading(true);
    setIdToDelete(todoId);

    return deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setLoading(false);
        setIdToDelete(-1);
      });
  }, []);

  const deleteAllCompletedTodos = () => {
    const completedTodos = todos.filter((todo) => todo.completed);

    const deletePromises = completedTodos.map((todo) => deleteItem(todo.id));

    Promise.all(deletePromises)
      .then(() => {
        setTodos((prevTodos) => prevTodos.filter((todo) => !todo.completed));
      })
      .catch(() => {
        setErrorMessage('Unable to delete completed todos');
      });
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const filteredTodos = useMemo(() => {
    return todos
      .filter(todo => {
        switch (status) {
          case 'active':
            return !todo.completed;
          case 'completed':
            return todo.completed;
          default:
            return true;
        }
      });
  }, [todos, status]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          query={query}
          setQuery={setQuery}
          handleSubmit={handleSubmit}
        />

        {todos.length !== 0
        && (
          <TodoList
            todos={filteredTodos}
            deleteItem={deleteItem}
            isLoading={isLoading}
            idToDelete={idToDelete}
          />
        )}

        {tempTodo && (
          <div className="todo">
            <label className="todo__status-label">
              <input type="checkbox" className="todo__status" />
            </label>

            <span className="todo__title">{tempTodo.title}</span>
            <button type="button" className="todo__remove">×</button>

            <div className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        )}

        {todos.length !== 0 && (
          <Footer
            todos={todos}
            deleteAllCompletedTodos={deleteAllCompletedTodos}
            setStatus={setStatus}
            status={status}
          />
        )}
      </div>

      <ErrorMessage
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
