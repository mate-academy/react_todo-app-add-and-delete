import React, {
  useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import { getTodos, createTodos, deleteTodo } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorMessage } from './components/ErrorMessage';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodosList } from './components/TodoList';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterBy, setFilterBy] = useState(Filter.All);
  const [title, setTitle] = useState('');
  const [isAdding, setAdding] = useState(false);
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  if (error) {
    setTimeout(() => {
      setError(false);
    }, 3000);
  }

  const filteredTodos = todos.filter(todo => {
    switch (filterBy) {
      case Filter.Active:
        return !todo.completed;

      case Filter.Completed:
        return todo.completed;

      case Filter.All:
        return todo;

      default:
        return true;
    }
  });

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    getTodos(user?.id || 0)
      .then(setTodos)
      .catch(() => {
        setError(true);
        setErrorMessage('Todos cannot  be added');
      });
  }, []);

  const activeAllTodos = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const activeTodos = activeAllTodos === todos.length;

  const handleTodos = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!title) {
      setErrorMessage('Title can`t be empty');

      return;
    }

    setAdding(true);

    try {
      const newTodo = await createTodos(user?.id, title);

      setTodos([...todos, newTodo]);
    } catch {
      setErrorMessage('Can\'t be added');
    }

    setTitle('');
    setAdding(false);
  };

  const removeTodo = async (todoId: number) => {
    await deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      });

    setAdding(true);

    setTimeout(() => setAdding(false), 300);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoField={newTodoField}
          activeTodos={activeTodos}
          title={title}
          setTitle={setTitle}
          handleTodos={handleTodos}
        />
        {todos.length > 0 && (
          <TodosList
            todos={filteredTodos}
            isAdding={isAdding}
            title={title}
            removeTodo={removeTodo}
          />
        )}
        <Footer
          todos={todos}
          filterBy={filterBy}
          handleFilterBy={setFilterBy}
        />
      </div>
      {error && (
        <ErrorMessage
          error={error}
          errorMessage={errorMessage}
          handleErrorMessage={setError}
        />
      )}
    </div>
  );
};
