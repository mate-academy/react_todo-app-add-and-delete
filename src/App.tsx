/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todoServises from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import classNames from 'classnames';

export enum FilterProps {
  all = 'all',
  active = 'active',
  completed = 'completed',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterProps>(FilterProps.all);
  const [inputValue, setInputValue] = useState('');
  const [tempoTodo, setTempoTodo] = useState<Todo | null>(null);
  const [todoDelete, setTodoDelete] = useState<number[]>([]);

  const filteredTodo = todos.filter(todo => {
    if (filter === FilterProps.active) {
      return !todo.completed;
    }

    if (filter === FilterProps.completed) {
      return todo.completed;
    }

    return true;
  });

  const activeCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.filter(todo => todo.completed).length;

  useEffect(() => {
    const timer = setTimeout(() => {
      setError(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [error]);

  useEffect(() => {
    todoServises
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setError('Unable to load todos');
      });

    const timer = setTimeout(() => {
      setError(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!todoServises.USER_ID) {
    return <UserWarning />;
  }

  //#region addTodo
  const addTodo = async (
    title: string,
    userId: number,
    completed: boolean = false,
  ): Promise<void> => {
    const newTempoTodo: Todo = {
      id: 0,
      title: inputValue.trim(),
      userId: todoServises.USER_ID,
      completed: false,
    };

    setTempoTodo(newTempoTodo);

    try {
      const newTodo = await todoServises.addTodos({ title, userId, completed });

      setTodos(currentTodo => [...currentTodo, newTodo]);
    } catch {
      setError('Unable to add a todo');

      throw Error('Unable to add a todo');
    } finally {
      setTempoTodo(null);
    }
  };

  //#endregion

  //#region deleteTodo
  const deleteTodo = async (todoId: number) => {
    setTodoDelete(prevTodos => [...prevTodos, todoId]);

    return todoServises
      .deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodo => currentTodo.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setError('Unable to delete a todo');
      })
      .finally(() => {
        setTodoDelete(prevTodos =>
          prevTodos.filter(prevTodo => prevTodo !== todoId),
        );
      });
  };
  //#endregion

  const handleDeleteCompledTodo = async () => {
    const completedTodo = todos.filter(todo => todo.completed);

    if (completedTodo.length === 0) {
      return;
    }

    await Promise.allSettled(completedTodo.map(todo => deleteTodo(todo.id)));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          inputValue={inputValue}
          setInputValue={setInputValue}
          addTodo={addTodo}
          setError={setError}
          filteredTodo={filteredTodo}
          todoDelete={todoDelete}
        />

        <TodoList
          filteredTodo={filteredTodo}
          deleteTodo={deleteTodo}
          tempoTodo={tempoTodo}
          todoDelete={todoDelete}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            currentFilter={filter}
            activeCount={activeCount}
            completedCount={completedCount}
            onFilterChange={setFilter}
            onClearCompleted={handleDeleteCompledTodo}
          />
        )}
      </div>
      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !error,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError(null)}
        />
        {/* show only one message at a time */}
        {error}
      </div>
    </div>
  );
};
