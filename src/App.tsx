/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, deleteTodo, getTodos, postTodo} from './api/todos';
import { Todo } from './types/Todo';
import { ErrorType, HandleErrors } from './components/HandleErrors/HandleErrors';
import { TodoList } from './components/TodoList/TodoList';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { Filter } from './types/Filter';
import { TodoInfo } from './components/TodoInfo/TodoInfo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [query, setQuery] = useState('');
  const [isError, setError] = useState<ErrorType | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [isLoad, setLoad] = useState(false);
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
  }, [todos, isError]);

  const handleCloseError = () => {
    setError(null);
  };

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

    setLoad(true);

    postTodo({ title: todoTitle, userId: USER_ID, completed: false })
      .then(newTodo => {
        setTodos(curTodos => [...curTodos, newTodo]);

        setQuery('');
      })
      .catch(() => setError('add'))
      .finally(() => {
        setTempTodo(null);
        setLoad(false);
      });
  }

  const handleDeleteTodo = (todoId: number) => {
    deleteTodo(todoId)
      .then(() =>
        setTodos(curTodos => curTodos.filter(todo => todo.id !== todoId)),
      )
      .catch(() => setError('delete'));
  };

  const clearCompletedTodos = useCallback(() => {
    const completedTodos = todos.filter(todo => todo.completed);

    for (const todo of completedTodos) {
      handleDeleteTodo(todo.id);
    }
  }, [todos]);


  const filteredTodos = useMemo(() => {
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
          query={query}
          setQuery={setQuery}
          inputLoading={isLoad}
          inputRef={inputRef}
        />

        {!!todos.length && (
          <TodoList todos={filteredTodos} onDelete={handleDeleteTodo} />
        )}

        {tempTodo && (
          <TodoInfo todo={tempTodo} isLoad={true} onDelete={handleDeleteTodo} />
        )}

        <Footer
          todos={todos}
          addFilter={setFilter}
          filter={filter}
          clearCompleted={clearCompletedTodos}
        />
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <HandleErrors errorType={isError} onClose={handleCloseError} />
    </div>
  );
}
