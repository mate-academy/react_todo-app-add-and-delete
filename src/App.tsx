/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';

const filterTodos = (initialTodos: Todo[], filter: string): Todo[] => {
  const filteredTodos = [...initialTodos];

  switch (filter) {
    case 'completed':
      return filteredTodos.filter(todo => todo.completed === true);
    case 'active':
      return filteredTodos.filter(todo => todo.completed === false);
    default:
      return initialTodos;
  }
};

const countActive = (todos: Todo[]) => {
  return todos.filter(todo => todo.completed === false).length;
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'completed' | 'active'>('all');
  const [updatingTodoIds, setUpdatingTodoIds] = useState<number[]>([]);
  const [activeCount, setActiveCount] = useState<number>();
  const USER_ID = 3205;

  useEffect(() => {
    todoService
      .getTodos(USER_ID)
      .then(todosFromServer => {
        setTodos(todosFromServer);
        setActiveCount(countActive(todosFromServer));
      })
      .catch(() => {
        setError('Unable to load todos');
        new Error('Unable to load todos');
      });
  }, []);

  const filteredTodos = filterTodos(todos, filter);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 3000); // 3 секунды

      return () => clearTimeout(timer); // очистка при размонтировании/смене ошибки
    }
  }, [error]);

  const addTodo = (newTodo: Omit<Todo, 'id'>) => {
    const maxId =
      todos && todos.length > 0 ? Math.max(...todos.map(todo => todo.id)) : 0;

    const tempId = maxId + 1;

    setTodos(prev => [...prev, { ...newTodo, id: tempId }]);

    setUpdatingTodoIds([tempId]);

    return todoService
      .addTodo(newTodo)
      .then(addedTodo => {
        setTodos(prev => {
          const updated = prev.map(todo =>
            todo.id === tempId ? addedTodo : todo,
          );

          setActiveCount(countActive(updated));

          return updated;
        });
        setQuery('');
      })
      .catch(() => {
        setTodos(todos);
        setError('Unable to add a todo');
        new Error('Unable to add a todo');
      })
      .finally(() => {
        setUpdatingTodoIds([]);
      });
  };

  const deleteTodo = (todoId: number) => {
    setUpdatingTodoIds([todoId]);

    return todoService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos => {
          const updated = currentTodos.filter(todo => todo.id !== todoId);

          setActiveCount(countActive(updated));

          return updated;
        });
      })
      .catch(() => {
        setError('Unable to delete a todo');
        throw new Error('Unable to delete a todo');
      })
      .finally(() => {
        setUpdatingTodoIds([]);
      });
  };

  const updateTodo = (updatedTodo: Todo) => {
    setUpdatingTodoIds(prev => [...prev, updatedTodo.id]);

    return todoService
      .updateTodo(updatedTodo)
      .then(newTodo => {
        setTodos(currentTodos => {
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(todo => todo.id === updatedTodo.id);

          newTodos.splice(index, 1, newTodo);
          setActiveCount(countActive(newTodos));

          return newTodos;
        });
      })
      .catch(() => {
        setError('Unable to update a todo');
        throw new Error('Unable to update a todo');
      })
      .finally(() => {
        setUpdatingTodoIds(prev => prev.filter(id => id !== updatedTodo.id));
      });
  };

  const handleSubmit = (formEvent: React.FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();

    if (query.trim().length === 0) {
      setError('Title should not be empty');

      return;
    }

    const newTodo = {
      title: query.trim(),
      userId: USER_ID,
      completed: false,
    };

    addTodo(newTodo);
  };

  const handleClearCompleted = () => {
    todos?.map(todo => todo.completed && deleteTodo(todo.id));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          query={query}
          updatingTodoIds={updatingTodoIds}
          setQuery={setQuery}
          todos={todos}
          handleSubmit={handleSubmit}
          updateTodo={updateTodo}
        />
        {todos && (
          <TodoList
            todos={filteredTodos}
            updateTodo={updateTodo}
            deleteTodo={deleteTodo}
            updatingTodoIds={updatingTodoIds}
          />
        )}

        {todos.length > 0 && (
          <Footer
            todos={todos}
            count={activeCount}
            filter={filter}
            setFilter={setFilter}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${error ? '' : 'hidden'}`}
      >
        <button data-cy="HideErrorButton" type="button" className="delete" />
        {/* show only one message at a time */}
        {error}
      </div>
    </div>
  );
};
