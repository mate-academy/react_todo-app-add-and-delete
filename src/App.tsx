/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';
import { TodoList } from './components/TodoList/TodoList';
import { Todo } from './types/Todo';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { TodoFilter } from './components/TodoFilter/TodoFilter';
import { FilterBy } from './utils/enums';
import { TodoForm } from './components/TodoForm/TodoForm';

const USER_ID = 10897;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<null | Todo>(null);
  const [loadingTodoId, setLoadingTodoId] = useState<number[]>([]);
  const [filterBy, setFilterBy] = useState(FilterBy.All);
  const [errorText, setErrorText] = useState<null | string>(null);

  const resetError = () => {
    setErrorText(null);
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then(response => {
        setTodos(response);
      })
      .catch((error) => {
        setErrorText(error.message);
        setTimeout(resetError, 3000);
      });
  }, []);

  const handleFilterChange = useCallback((event: React.MouseEvent) => {
    const target = event.target as HTMLButtonElement;

    setFilterBy(target.innerText.toLowerCase() as FilterBy);
  }, []);

  const visibleTodos = filterBy === FilterBy.All
    ? todos
    : todos.filter(todo => (
      filterBy === FilterBy.Active
        ? !todo.completed
        : todo.completed
    ));

  const activeactiveTodosNumber = todos.filter(todo => !todo.completed).length;

  const onSubmit = async (title: string) => {
    if (!/\S/g.test(title)) {
      setErrorText('Title can\'t be empty');

      return false;
    }

    const newTodo = {
      title,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo({ ...newTodo, id: 0 });

    try {
      const addedTodo = await addTodo(newTodo);

      setTodos(prevTodos => [...prevTodos, addedTodo]);
    } catch {
      setErrorText('Unable to add a todo');
    } finally {
      setTempTodo(null);
    }

    return true;
  };

  const onDelete = useCallback(async (todoId: number) => {
    setLoadingTodoId(prevIds => [...prevIds, todoId]);

    try {
      await deleteTodo(todoId);

      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    } catch {
      setErrorText('Unable to delete a todo');
    } finally {
      setLoadingTodoId(prevIds => prevIds.filter(id => id !== todoId));
    }
  }, []);

  const clearCompleted = () => {
    const completedTodosId = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    completedTodosId.forEach(onDelete);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoForm
          hasActive={todos.some(todo => !todo.completed)}
          onSubmit={onSubmit}
          hasTodos={Boolean(todos.length)}
        />

        {Boolean(todos.length) && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              onDelete={onDelete}
              loadingTodoId={loadingTodoId}
            />
            <TodoFilter
              activeTodosNumber={activeactiveTodosNumber}
              statusFilter={filterBy}
              handleFilterChange={handleFilterChange}
              hasCompleted={todos.some(todo => todo.completed)}
              clearCompleted={clearCompleted}
            />
          </>
        )}
      </div>

      <ErrorMessage
        errorText={errorText}
        clearError={resetError}
      />
    </div>
  );
};
