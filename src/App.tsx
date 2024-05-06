/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { UserWarning } from './UserWarning';

import { USER_ID, deleteTodo, getTodos, postTodo } from './api/todos';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification, ErrorType } from './components/ErrorNotification';
import { TodoInfo } from './components/TodoInfo';

export function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState<ErrorType | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [newTodoLoading, setNewTodoLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setError('load'));
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos, error]);

  const filteredTodo = useMemo(() => {
    return todos.filter(todo => {
      switch (filter) {
        case 'active':
          return !todo.completed;
        case 'completed':
          return todo.completed;
        case 'all':
          return todo;
        default:
          return true;
      }
    });
  }, [filter, todos]);

  const addTodo = (newTodoTitle: string) => {
    const todoTitle = query.trim();

    if (!todoTitle.length) {
      setError('empty');

      return;
    }

    setTempTodo({
      id: 0,
      title: newTodoTitle,
      userId: USER_ID,
      completed: false,
    });

    setNewTodoLoading(true);

    postTodo({ title: todoTitle, userId: USER_ID, completed: false })
      .then(newTodo => {
        setTodos(curTodos => [...curTodos, newTodo]);

        setQuery('');
      })
      .catch(() => setError('add'))
      .finally(() => {
        setTempTodo(null);
        setNewTodoLoading(false);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    deleteTodo(todoId)
      .then(() =>
        setTodos(curTodos => curTodos.filter(todo => todo.id !== todoId)),
      )
      .catch(() => setError('delete'));
  };

  const handleCloseError = useCallback(() => {
    setError(null);
  }, []);

  const clearCompletedTodos = useCallback(() => {
    const completedTodos = todos.filter(todo => todo.completed);

    for (const todo of completedTodos) {
      handleDeleteTodo(todo.id);
    }
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
          query={query}
          setQuery={setQuery}
          inputLoading={newTodoLoading}
          inputRef={inputRef}
        />

        {todos.length > 0 && (
          <TodoList todos={filteredTodo} onDelete={handleDeleteTodo} />
        )}

        {tempTodo && (
          <TodoInfo todo={tempTodo} isLoad={true} onDelete={handleDeleteTodo} />
        )}

        <Footer
          onFilter={setFilter}
          todos={todos}
          filter={filter}
          clearCompleted={clearCompletedTodos}
        />
      </div>

      <ErrorNotification errorType={error} onClose={handleCloseError} />
    </div>
  );
}
