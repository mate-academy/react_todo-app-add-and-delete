/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useMemo,
} from 'react';

import { createTodo, removeTodo, getTodos } from './api/todos';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { ErrorMessage } from './components/ErrorMessage';
import { AuthContext } from './components/Auth/AuthContext';

import { Todo } from './types/Todo';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterOption, setFilterOption] = useState('all');
  const [newTitle, setNewTitle] = useState('');
  // const [isAdding, setIsAdding] = useState(true);

  if (error !== '') {
    setTimeout(() => {
      setError('');
    }, 3000);
  }

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    if (user) {
      getTodos(user.id)
        .then(response => {
          setTodos(response);
        })
        .catch(() => setError('Unable to load todos'));
    }
  }, []);

  let userId = 0;

  if (user?.id) {
    userId = user.id;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!newTitle.trim()) {
      setError('Title can`t be empty');
      setNewTitle('');

      return;
    }

    await createTodo(userId, newTitle)
      .then(newTodo => {
        setTodos(prevTodos => [...prevTodos, newTodo]);
      })
      .catch(() => {
        setError('Unable to add a todo');
      });

    setNewTitle('');
  };

  const handleDelete = async (todoId: number) => {
    await removeTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setError('Unable to delete a todo');
      });
  };

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filterOption) {
        case 'active':
          return !todo.completed;

        case 'completed':
          return todo.completed;

        default:
          return true;
      }
    });
  }, [todos, filterOption]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoField={newTodoField}
          newTitle={newTitle}
          setNewTitle={setNewTitle}
          handleSubmit={handleSubmit}
        />

        {todos.length > 0
          && (
            <>
              <TodoList
                todos={filteredTodos}
                handleDelete={handleDelete}
              />

              <Footer
                todos={filteredTodos}
                filterOption={filterOption}
                setFilterOption={setFilterOption}
                handleDelete={handleDelete}
              />
            </>
          )}

        {error !== ''
          && (
            <ErrorMessage
              error={error}
              setError={setError}
            />
          )}
      </div>
    </div>
  );
};
