/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { TodoNotification } from './components/TodoNotification';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { Error } from './types/Error';
import { getTodos, addTodos, deleteTodos } from './api/todos';

const USER_ID = 10137;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[] | []>([]);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [error, setError] = useState<Error>(Error.None);
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletedTodosId, setDeletedTodosId] = useState<number[] | []>([]);

  const getTodosList = async () => {
    try {
      const todosFromData = await getTodos(USER_ID);

      setTodos(todosFromData);
    } catch {
      setError(Error.Get);
    }
  };

  useEffect(() => {
    getTodosList();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setError(Error.None);
    }, 3000);
  }, [error]);

  const handleDeleteTodo = (id: number) => {
    setDeletedTodosId([id]);

    deleteTodos(id)
      .then(() => {
        const newTodoList = todos.filter(todo => todo.id !== id);

        setTodos(newTodoList);
      })
      .catch(() => setError(Error.Delete))
      .finally(() => setDeletedTodosId([]));
  };

  const handleClearTodo = () => {
    const completedTodosId = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setDeletedTodosId(completedTodosId);

    Promise.all(completedTodosId.map(id => deleteTodos(id)))
      .then(() => {
        const filteredTodos = todos.filter(todo => !todo.completed);

        setTodos(filteredTodos);
      })
      .catch(() => setError(Error.Delete))
      .finally(() => setDeletedTodosId([]));
  };

  const handleAddTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (value) {
      setIsLoading(true);

      setTempTodo({
        id: 0,
        userId: USER_ID,
        title: value,
        completed: false,
      });

      const newTodo = {
        id: Math.max(...todos.map(todo => todo.id)) + 1,
        userId: USER_ID,
        title: value,
        completed: false,
      };

      addTodos(USER_ID, newTodo)
        .then(() => {
          setTodos([...todos, newTodo]);
        })
        .catch(() => setError(Error.Add))
        .finally(() => {
          setValue('');
          setIsLoading(false);
          setTempTodo(null);
        });
    } else {
      setError(Error.Empty);
    }
  };

  const getFilteredTodos = () => {
    switch (filter) {
      case Filter.Active:
        return todos.filter(todo => !todo.completed);

      case Filter.Completed:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  };

  const visibleTodos = getFilteredTodos();
  const hasCompletedTodos = todos.some(todo => todo.completed);
  const amountActiveTodos = todos.filter(todo => !todo.completed).length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoForm
          amountActiveTodos={amountActiveTodos}
          value={value}
          setValue={setValue}
          handleAddTodo={handleAddTodo}
          isLoading={isLoading}
        />

        {!!todos.length && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              deletedTodosId={deletedTodosId}
              handleDeleteTodo={handleDeleteTodo}
            />

            <TodoFilter
              filter={filter}
              setFilter={setFilter}
              hasCompletedTodos={hasCompletedTodos}
              amountActiveTodos={amountActiveTodos}
              handleClearTodo={handleClearTodo}
            />
          </>
        )}
      </div>

      <TodoNotification
        error={error}
        setError={setError}
      />
    </div>
  );
};
