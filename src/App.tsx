/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { AuthContext } from './components/Auth/AuthContext';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { TodoList } from './components/TodoList/TodoList';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { Error } from './components/Error/ErrorMessage';
import { createTodo, deleteTodo, getTodos } from './api/todos';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [errorMessage, setErrorMessage] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [sortBy, setSortBy] = useState(Filter.ALL);
  const [title, setTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [selectedId, setSelectedId] = useState<number[]>([]);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  useEffect(() => {
    async function todosFromServer() {
      try {
        if (user) {
          const visibleTodos = getTodos(user.id);

          setTodos(await visibleTodos);
        }
      } catch (error) {
        setErrorMessage(`${error} ${user}`);
      }
    }

    todosFromServer();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!title) {
      return setErrorMessage('Title can`t be empty');
    }

    if (user) {
      await createTodo(user.id, title)
        .then(newTodo => {
          setTodos([...todos, newTodo]);
        })
        .catch(() => {
          setErrorMessage('Unable to add a todo');
        });
    }

    setIsAdding(false);

    return setTitle('');
  };

  const handleRemoveTodo = async (todoId: number) => {
    setSelectedId([todoId]);
    setIsAdding(true);
    await deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      });

    setIsAdding(true);
  };

  const sortOption = todos.filter(todoItem => {
    switch (sortBy) {
      case Filter.COMPLETED:
        return todoItem.completed;

      case Filter.ACTIVE:
        return !todoItem.completed;

      default:
        return todoItem;
    }
  });

  const completedTodos = useMemo(
    () => todos.filter(({ completed }) => completed),
    [todos],
  );

  const handleDeleteCompletedTodos = useCallback(() => {
    setSelectedId([...completedTodos].map(({ id }) => id));

    Promise.any(completedTodos.map(({ id }) => handleRemoveTodo(id)))
      .then(() => setTodos([...todos.filter(({ completed }) => !completed)]))
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        setSelectedId([]);
      });
  }, [todos, selectedId, errorMessage]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <Header
        newTodoField={newTodoField}
        title={title}
        setTitle={setTitle}
        handleSubmit={handleSubmit}
      />

      {
        todos.length > 0
        && (
          <div className="todoapp__content">

            <TodoList
              todos={sortOption}
              handleRemove={handleRemoveTodo}
              isAdding={isAdding}
              selectedId={selectedId}
            />

            <Footer
              sortBy={sortBy}
              todos={todos}
              setSortBy={setSortBy}
              deleteTodo={handleDeleteCompletedTodos}
              doneTodo={completedTodos}
            />
          </div>
        )
      }

      {
        errorMessage
          && <Error errorAlert={errorMessage} setErrorAlert={setErrorMessage} />
      }
    </div>
  );
};
