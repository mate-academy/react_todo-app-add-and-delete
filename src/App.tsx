/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos, addTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { FilterStatus } from './types/Filter';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { ErrorNotification } from './components/ErrorNotification';

function filterTodos(todos: Todo[], filter: FilterStatus): Todo[] {
  switch (filter) {
    case FilterStatus.Active:
      return todos.filter(todo => !todo.completed);
    case FilterStatus.Completed:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.All);

  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const todoCount = todos.filter(todo => !todo.completed).length;
  const isAllCompleted = todos.every(todo => todo.completed);
  const hasCompleted = todos.some(todo => todo.completed);
  const visibleTodos = filterTodos(todos, filter);

  useEffect(() => {
    setError('');
    getTodos()
      .then(setTodos)
      .catch(() => {
        setError('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = setTimeout(() => {
      setError('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [error]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [isSubmitting]);

  const handleAddTodo = () => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError('Title should not be empty');

      return;
    }

    const newTodo = {
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setIsSubmitting(true);
    setTempTodo({ id: 0, ...newTodo });
    addTodo(newTodo)
      .then(addedTodo => {
        setTodos(prevTodos => [...prevTodos, addedTodo]);
        setTitle('');
      })
      .catch(() => {
        setError('Unable to add a todo');
      })
      .finally(() => {
        setIsSubmitting(false);
        setTempTodo(null);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setLoadingTodoIds(prevIds => [...prevIds, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setError('Unable to delete a todo');
      })
      .finally(() => {
        setLoadingTodoIds(prevIds => prevIds.filter(id => id !== todoId));
        inputRef.current?.focus();
      });
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => handleDeleteTodo(todo.id));
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
          isAllCompleted={isAllCompleted}
          inputRef={inputRef}
          title={title}
          onTitleChange={setTitle}
          isSubmitting={isSubmitting}
          onSubmit={handleAddTodo}
        />

        {(todos.length > 0 || tempTodo) && (
          <TodoList
            todos={visibleTodos}
            tempTodo={tempTodo}
            onDelete={handleDeleteTodo}
            loadingTodoIds={loadingTodoIds}
          />
        )}

        {todos.length > 0 && (
          <Footer
            filter={filter}
            todoCount={todoCount}
            hasCompleted={hasCompleted}
            onFilterChange={setFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification error={error} onClick={() => setError('')} />
    </div>
  );
};
