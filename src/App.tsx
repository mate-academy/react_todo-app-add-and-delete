/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import { getTodos, addTodos, deleteTodos } from './api/todos';
import { Todo } from './types/Todo';
import { Todolist } from './TodoList';
import { Filters } from './types/Filters';
import { Filter } from './Filter';
import { TodoForm } from './TodoForm';

const USER_ID = 10925;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(Filters.ALL);
  const [errorText, setErrorText] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodos, setLoadingTodos] = useState([0]);

  useEffect(() => {
    getTodos(USER_ID)
      .then((fetchedTodos: Todo[]) => {
        setTodos(fetchedTodos);
      })
      .catch((error: Error) => {
        setErrorText(error.message);
        throw new Error(error.message);
      });
  }, []);

  const addTodo = async (title: string) => {
    try {
      const newTodo = {
        title,
        userId: USER_ID,
        completed: false,
      };

      setTempTodo({ id: 0, ...newTodo });

      const createdTodo = await addTodos(newTodo);

      setTodos([...todos, createdTodo]);
    } catch {
      setErrorText('Unable to add a todo');
    } finally {
      setTempTodo(null);
    }
  };

  const removeTodo = async (todoId: number) => {
    try {
      setLoadingTodos(prevIds => [todoId, ...prevIds]);
      await deleteTodos(todoId);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    } catch {
      setErrorText('Unable to delete a todo');
    } finally {
      setLoadingTodos(prevIds => prevIds.filter(id => id !== todoId));
    }
  };

  const completedTodos = todos.filter((todo) => todo.completed);
  const activeTodos = todos.filter((todo) => !todo.completed);

  const visibletodos = useMemo(() => {
    switch (filter) {
      case Filters.COMPLETED:
        return completedTodos;
      case Filters.ACTIVE:
        return activeTodos;
      default:
        return todos;
    }
  }, [todos, filter]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleClearCompleted = async () => {
    const deletePromises = completedTodos.map(todo => deleteTodos(todo.id));

    try {
      await Promise.all(deletePromises);
    } catch {
      setErrorText('Unable to delete todos');
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          <button type="button" className="todoapp__toggle-all active" />

          {/* Add a todo on form submit */}
          <TodoForm
            tempTodo={tempTodo}
            addTodo={addTodo}
            setErrorText={setErrorText}
          />
        </header>

        <Todolist
          todos={visibletodos}
          removeTodo={removeTodo}
          loadingTodos={loadingTodos}
        />

        {/* Hide the footer if there are no todos */}
        <footer className="todoapp__footer">
          <span className="todo-count">
            {`${visibletodos.length} items left`}
          </span>

          {/* Active filter should have a 'selected' class */}
          <Filter filter={filter} setFilter={setFilter} />

          {/* don't show this button if there are no completed todos */}
          {completedTodos.length > 0 && (
            <button
              type="button"
              className="todoapp__clear-completed"
              onClick={handleClearCompleted}
            >
              Clear completed
            </button>
          )}
        </footer>
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !errorText },
      )}
      >
        <button
          type="button"
          className="delete"
          onClick={() => setErrorText('')}
        />
        {errorText}
      </div>
    </div>
  );
};
