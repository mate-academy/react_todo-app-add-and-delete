import React, {
  useEffect, useState, useMemo, FormEvent, useCallback,
} from 'react';
import { UserWarning } from './UserWarning';
import { Todo, TodoStatus } from './types/Todo';
import { createTodo, deleteTodo, getTodos } from './api/todos';
import { filterTodos } from './utils/todoUtil';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorMessage } from './components/ErrorMessage';

const USER_ID = 11082;

export const App: React.FC = () => {
  // #region states
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filterBy, setFilterBy] = useState(TodoStatus.ALL);
  const [errorMessage, setErrorMessage] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [activeTodoId, setActiveTodoId] = useState<number | null>(null);
  const [temporatyTodo, setTemporatyTodo] = useState<Todo | null>(null);
  // #endregion

  // #region handlers
  const handleTodoDelete = useCallback((todoId: number) => {
    setActiveTodoId(todoId);

    deleteTodo(todoId)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== todoId));
      })
      .catch(() => setErrorMessage('Unable to delete todo'))
      .finally(() => {
        setActiveTodoId(null);
        setTitle('');
      });
  }, []);

  const handleTodoAdd = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title) {
      setErrorMessage('Title can\'t be empty');

      return;
    }

    const todo = {
      id: 0,
      title,
      userId: USER_ID,
      completed: false,
    };

    setTemporatyTodo(todo);
    createTodo(todo)
      .then(newTodo => {
        setTodos(prev => [...prev, newTodo]);
        setTitle('');
      })
      .finally(() => {
        setTemporatyTodo(null);
      });
  }, [title]);
  // #endregion

  useEffect(() => {
    setIsLoading(true);

    getTodos(USER_ID)
      .then(setTodos)
      .catch((error) => {
        setErrorMessage(error.message);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const visibleTodos = useMemo(() => {
    return filterTodos(todos, filterBy);
  }, [todos, filterBy]);

  const activeTodos = useMemo(() => {
    return filterTodos(todos, TodoStatus.ACTIVE);
  }, [todos]);

  const isDisabled = activeTodoId && isLoading;

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          title={title}
          setTitle={setTitle}
          isDisabled={isDisabled}
          activeTodosQuantity={activeTodos.length}
          onAdd={handleTodoAdd}
        />

        <TodoList
          todos={visibleTodos}
          activeTodoId={activeTodoId}
          temporaryTodo={temporatyTodo}
          onDelete={handleTodoDelete}
          isDeleteDisabled={isDisabled}
        />

        {todos.length > 0 && (
          <Footer
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            activeTodosQuantity={activeTodos.length}
            completedTodosQuantity={todos.length - activeTodos.length}
          />
        )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorMessage
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
      {isLoading}
    </div>
  );
};
