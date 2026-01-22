/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Filter } from './types/Filter';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<Filter>(Filter.all);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processings, setProcessings] = useState<number[]>([]);

  const todosCompletedIds = () => {
    const idsCompleted = todos.filter(t => t.completed).map(t => t.id);

    return idsCompleted;
  };

  const clearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    const ids = completedTodos.map(todo => todo.id);

    setProcessings(prev => [...prev, ...ids]);

    Promise.allSettled(ids.map(id => todoService.deleteTodo(id)))
      .then(results => {
        const successIds = ids.filter(
          (_, index) => results[index].status === 'fulfilled',
        );

        const failed = results.some(result => result.status === 'rejected');

        if (successIds.length > 0) {
          setTodos(current =>
            current.filter(todo => !successIds.includes(todo.id)),
          );
        }

        if (failed) {
          setErrorMessage('Unable to delete a todo');
          setTimeout(() => setErrorMessage(''), 3000);
        }
      })
      .finally(() => {
        setProcessings(prev => prev.filter(id => !ids.includes(id)));
      });
  };

  const setFilter = (method: Filter) => {
    setSelectedFilter(method);
  };

  const visibleTodos = useCallback(
    (method: Filter) => {
      let filteredTodos = todos;

      if (method !== 'all') {
        filteredTodos = filteredTodos.filter(todo =>
          method === 'completed' ? todo.completed : !todo.completed,
        );
      }

      return filteredTodos;
    },
    [todos],
  );

  const addTodo = ({ title, completed, userId }: Omit<Todo, 'id'>) => {
    setTempTodo({ id: 0, title, completed: false, userId });

    return todoService
      .addTodo({ title, completed, userId })
      .then((newTodo: Todo) => {
        setTempTodo(null);
        setTodos(currentTodos => [...currentTodos, newTodo]);
      })
      .catch(error => {
        setTempTodo(null);
        setErrorMessage('Unable to add a todo');
        setTimeout(() => setErrorMessage(''), 3000);
        throw error;
      });
  };

  const deleteTodo = (todoId: number) => {
    setProcessings(prev => [...prev, todoId]);

    return todoService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(current => current.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setProcessings(prev => prev.filter(id => id !== todoId));
      });
  };

  const todosCounter = () => {
    return todos.filter(todo => !todo.completed).length;
  };

  useEffect(() => {
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => setErrorMessage(''), 3000);
      });
  }, []);

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onSubmit={title =>
            addTodo({ title, completed: false, userId: todoService.USER_ID })
          }
          onError={(msg: string) => setErrorMessage(msg)}
          processings={processings}
        />

        <TodoList
          processings={processings}
          todos={visibleTodos(selectedFilter)}
          tempTodo={tempTodo}
          onDelete={todoId => deleteTodo(todoId)}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length !== 0 && (
          <Footer
            todosCompletedCounter={todosCompletedIds().length}
            clearCompleted={clearCompleted}
            todosCounter={todosCounter}
            onSelect={method => setFilter(method)}
            selectedFilter={selectedFilter}
          />
        )}
      </div>

      <ErrorNotification errorMessage={errorMessage} />
    </div>
  );
};
