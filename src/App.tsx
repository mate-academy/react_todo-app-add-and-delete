/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos } from './api/todos';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Error } from './components/Error';
import { Todo } from './types/Todo';
import { FilterStatus } from './types/FilterStatus';
import * as todoService from './api/todos';
import { Errors } from './constants/Errors';

const getFilteredTodos = (todos: Todo[], status: FilterStatus): Todo[] => {
  const visibleTodos = [...todos];

  switch (status) {
    case FilterStatus.active:
      return visibleTodos.filter(todo => !todo.completed);
    case FilterStatus.completed:
      return visibleTodos.filter(todo => todo.completed);
    default:
      return visibleTodos;
  }
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterStatus, setFilterStatus] = useState(FilterStatus.all);
  const [error, setError] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredTodos = getFilteredTodos(todos, filterStatus);

  const handleCreateTodo = ({ title, userId, completed }: Omit<Todo, 'id'>) => {
    setError('');
    setIsSubmitting(true);

    setTempTodo({
      id: 0,
      title: title.trim(),
      userId: todoService.USER_ID,
      completed: false,
    });

    setIsLoading(prev => [...prev, 0]);

    return todoService
      .createTodo({ title, userId, completed })
      .then(newTodo => {
        setTodos(prevTodos => [...prevTodos, newTodo]);
        setTempTodo(null);
      })
      .catch(e => {
        setError(Errors.add);
        setTimeout(() => setError(''), 3000);
        throw e;
      })
      .finally(() => {
        setIsLoading(prev => prev.filter(id => id !== 0));
        setTempTodo(null);
        setIsSubmitting(false);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setIsLoading(prev => [...prev, todoId]);

    return todoService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(t => t.id !== todoId));
      })
      .catch(() => {
        setError(Errors.delete);
        setTimeout(() => setError(''), 3000);
      })
      .finally(() => {
        setIsLoading([]);
      });
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setError(Errors.load);
        setTimeout(() => setError(''), 3000);
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setError={setError}
          onCreate={handleCreateTodo}
          isSubmitting={isSubmitting}
        />
        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          isLoading={isLoading}
          isSubmitting={isSubmitting}
          onDelete={handleDeleteTodo}
        />
        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            todos={todos}
            filterStatus={filterStatus}
            onChangeStatus={setFilterStatus}
            onDelete={handleDeleteTodo}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <Error error={error} setError={setError} />
    </div>
  );
};
