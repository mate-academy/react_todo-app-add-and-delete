/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as service from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

export enum FilterType {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState<FilterType>(FilterType.All);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingTodoId, setloadingTodoId] = useState<number[]>([]);
  const [isSubmiting, setIsSubmiting] = useState(false);

  const visibleTodos = todos.filter(todo => {
    switch (filter) {
      case FilterType.Active:
        return !todo.completed;
      case FilterType.Completed:
        return todo.completed;
      case FilterType.All:
      default:
        return true;
    }
  });

  const countActiveTodos = todos.filter(item => !item.completed).length;

  const handleError = (message: string) => {
    setErrorMsg(message);

    setTimeout(() => {
      setErrorMsg('');
    }, 3000);
  };

  useEffect(() => {
    setLoading(true);
    service
      .getTodos()
      .then(setTodos)
      .catch(error => {
        handleError('Unable to load todos');
        throw error;
      })
      .finally(() => setLoading(false));
  }, []);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && !tempTodo && !isSubmiting) {
      inputRef.current?.focus();
    }
  }, [loading, tempTodo, todos.length, isSubmiting]);

  const addTodo = ({ userId, title: newTitle, completed }: Todo) => {
    handleError('');
    
    const newTempTodo: Todo = {
      id: 0,
      userId,
      title: newTitle,
      completed,
    };

    setLoading(true);
    setTempTodo(newTempTodo);

    return service
      .addTodo({ userId, title: newTitle, completed })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTitle('');
      })
      .catch(error => {
        handleError('Unable to add a todo');
        throw error;
      })
      .finally(() => {
        setTempTodo(null);
        setLoading(false);
        inputRef.current?.focus();
      });
  };

  const deleteTodo = (todoId: number) => {
    handleError('');
    setloadingTodoId(prev => [...prev, todoId]);

    return service
      .deleteTodo(todoId)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        handleError('Unable to delete a todo');
      })
      .finally(() => {
        setloadingTodoId(prev => prev.filter(id => id !== todoId));
      });
  };

  const reset = () => {
    setTitle('');
    inputRef.current?.focus();
  };

  const clearCompletedTodos = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => {
      service
        .deleteTodo(todo.id)
        .then(() => {
          setTodos(current => current.filter(t => t.id !== todo.id));
        })
        .catch(() => {
          handleError('Unable to delete a todo');
        });
    });
  };

  if (!service.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todo={tempTodo}
          onAddTodo={addTodo}
          handleError={handleError}
          title={title}
          setTitle={setTitle}
          onReset={reset}
          inputRef={inputRef}
          isSubmiting={isSubmiting}
          setIsSubmiting={setIsSubmiting}
        />

        <TodoList
          tempTodo={tempTodo}
          todos={visibleTodos}
          onDelete={deleteTodo}
          loadingTodoId={loadingTodoId}
        />

        {todos.length > 0 && (
          <Footer
            countActiveTodos={countActiveTodos}
            countCompletedTodos={todos.length - countActiveTodos}
            filter={filter}
            setFilter={setFilter}
            onClearCompleted={clearCompletedTodos}
          />
        )}
      </div>
      <ErrorNotification error={errorMsg} setError={setErrorMsg} />
    </div>
  );
};
