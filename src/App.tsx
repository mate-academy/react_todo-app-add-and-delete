import React, {
  useState,
  useEffect,
  useRef,
  useContext,
} from 'react';

import { AuthContext } from './components/Auth/AuthContext';

import { getTodos, postTodo, removeTodo } from './api/todos';

import { Todo } from './types/Todo';
import { User } from './types/User';

import { FilterTypes } from './types/FilterTypes';
import { ErrorMessage } from './types/ErrorMessage';

import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { ErrorNotification } from
  './components/ErrorNotification/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const [filterType, setFilterType] = useState<string>(FilterTypes.All);

  const [error, setError] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [title, setTitle] = useState('');

  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);

  const [isAdding, setIsAdding] = useState(false);

  const [completedTodos, setCompletedTodos] = useState<number[]>([]);

  const user = useContext<User | null>(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  if (error) {
    setTimeout(() => {
      setError(false);
    }, 3000);
  }

  const filteredTodos = todos.filter(todo => {
    switch (filterType) {
      case FilterTypes.All:
        return todo;

      case FilterTypes.Active:
        return !todo.completed && FilterTypes.Active;

      case FilterTypes.Completed:
        return todo.completed && FilterTypes.Completed;

      default:
        return null;
    }
  });

  useEffect(() => {
    getTodos(user?.id || 0).then(response => {
      setTodos(response);
    }).catch(() => {
      setErrorMessage(ErrorMessage.LoadFail);
      setError(true);
    });
  }, [errorMessage]);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [todos]);

  const handleFilterType = (type: string) => {
    setFilterType(type);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMessage(ErrorMessage.TitleEmpty);
      setTitle('');
      setError(true);

      return;
    }

    setIsAdding(true);

    const copyTodos = [...todos];

    setTodos(prev => {
      return [...prev, {
        id: 0,
        userId: user?.id || 0,
        completed: false,
        title,
      }];
    });

    setSelectedTodoId(0);

    postTodo(user?.id || 0, title)
      .then(newTodo => {
        setIsAdding(false);
        setTodos([...copyTodos, newTodo]);
      })
      .catch(() => {
        setError(true);
        setIsAdding(false);
        setErrorMessage(ErrorMessage.AddFail);

        setTodos((prev) => {
          return prev.filter(oneTodo => {
            return oneTodo.id !== 0;
          });
        });
      });

    setSelectedTodoId(0);

    setTitle('');
  };

  const removeError = (boolean: boolean) => {
    setError(boolean);
  };

  const deleteTodo = (todoId: number) => {
    setSelectedTodoId(todoId);

    removeTodo(todoId)
      .then(() => {
        setSelectedTodoId(todoId);
        setErrorMessage(null);
        setTodos(prevTodos => prevTodos
          .filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setError(true);
        setErrorMessage(ErrorMessage.DeleteFail);
      })
      .finally(() => {
        setSelectedTodoId(null);
      });
  };

  const clearTable = async () => {
    const filterTodos = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setCompletedTodos(filterTodos);

    try {
      await Promise.all(filterTodos.map(async (todoId) => {
        await removeTodo(todoId);

        setTodos(prevTodos => prevTodos
          .filter(todo => {
            return todo.id !== todoId;
          }));
      }));
    } catch {
      setError(true);
      setErrorMessage(ErrorMessage.DeleteFail);
      setCompletedTodos([]);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <Header
          handleSubmit={handleSubmit}
          newTodoField={newTodoField}
          setTitle={setTitle}
          isAdding={isAdding}
          title={title}
        />

        <TodoList
          filteredTodos={filteredTodos}
          deleteTodo={deleteTodo}
          selectedTodoId={selectedTodoId}
          completedTodos={completedTodos}
        />
        <Footer
          clearTable={clearTable}
          handleFilterType={handleFilterType}
          filterType={filterType}
          filteredTodos={filteredTodos}
        />

      </div>

      <ErrorNotification
        error={error}
        removeError={removeError}
        errorMessage={errorMessage}
      />
    </div>
  );
};
