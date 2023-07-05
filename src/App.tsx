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
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [filterBy, setFilterBy] = useState(FilterBy.All);
  const [errorText, setErrorText] = useState<null | string>(null);

  const resetError = () => {
    setErrorText(null);
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch((error) => {
        setErrorText(error.message);
        setTimeout(resetError, 3000);
      });
  }, []);

  const handleFilterChange = useCallback((event: React.MouseEvent) => {
    const target = event.target as HTMLButtonElement;

    setFilterBy(target.innerText.toLowerCase() as FilterBy);
  }, []);

  const onAddTodo = async (title: string) => {
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

  const onDeleteTodo = useCallback(async (todoId: number) => {
    setLoadingTodoIds(prevIds => [...prevIds, todoId]);

    try {
      await deleteTodo(todoId);

      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    } catch {
      setErrorText('Unable to delete a todo');
    } finally {
      setLoadingTodoIds(prevIds => prevIds.filter(id => id !== todoId));
    }
  }, []);

  const visibleTodos = filterBy === FilterBy.All
    ? todos
    : todos.filter(todo => (
      filterBy === FilterBy.Active
        ? !todo.completed
        : todo.completed
    ));

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoForm
          todos={todos}
          onAddTodo={onAddTodo}
        />

        {Boolean(todos.length) && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              onDelete={onDeleteTodo}
              loadingTodoIds={loadingTodoIds}
            />
            <TodoFilter
              todos={todos}
              statusFilter={filterBy}
              handleFilterChange={handleFilterChange}
              onDeleteTodo={onDeleteTodo}
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
