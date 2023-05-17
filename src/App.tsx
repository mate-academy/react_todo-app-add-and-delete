/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback, useEffect, useState, useMemo,
} from 'react';
import cn from 'classnames';
import { Todo, EnumTodoFilter } from './types/types';
import { getTodos, deleteTodo, USER_ID } from './api/todos';

import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { TodoForm } from './components/TodoForm';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState(EnumTodoFilter.ALL);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);
  const isExistCompleted = completedTodos.length > 0;

  const getFilteredTodos = useCallback((filter: EnumTodoFilter) => {
    switch (filter) {
      case EnumTodoFilter.ACTIVE:
        return todos.filter(todo => !todo.completed);

      case EnumTodoFilter.COMPLETED:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  }, [filterBy, todos]);

  const createTodo = (newTodo: Todo) => {
    setTodos(prevTodos => [...prevTodos, newTodo]);
  };

  const deleteErrorMessage = useCallback(() => {
    setErrorMessage('');
  }, []);

  const loadData = useCallback(async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch {
      setErrorMessage('Failed to load data');
    }
  }, []);

  const handleTodoDelete = useCallback(async (todoToDelete: Todo) => {
    try {
      setErrorMessage('');
      setTempTodo(todoToDelete);
      await deleteTodo(todoToDelete.id);
      loadData();
    } catch {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setTempTodo(null);
    }
  }, []);

  const handleClearCompleted = useCallback(() => {
    for (let i = 0; i < completedTodos.length; i += 1) {
      handleTodoDelete(completedTodos[i]);
    }
  }, [todos]);

  useEffect(() => {
    loadData();
  }, []);

  const filteredTodos = useMemo(() => {
    return getFilteredTodos(filterBy);
  }, [todos, filterBy]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={cn('todoapp__toggle-all', {
              active: activeTodos.length,
            })}
          />

          <TodoForm
            setErrorMessage={setErrorMessage}
            setTempTodo={setTempTodo}
            createTodo={createTodo}
          />
        </header>

        <TodoList
          todos={filteredTodos}
          onDelete={handleTodoDelete}
          tempTodo={tempTodo}
        />

        {todos && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {`${activeTodos.length} items left`}
            </span>

            <TodoFilter
              filter={filterBy}
              onChange={setFilterBy}
            />

            <button
              type="button"
              className="todoapp__clear-completed"
              disabled={!isExistCompleted}
              onClick={handleClearCompleted}
              style={isExistCompleted ? {} : { color: 'white' }}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <ErrorMessage message={errorMessage} onDelete={deleteErrorMessage} />
    </div>
  );
};
