import React, { useEffect, useMemo, useState } from 'react';
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { TodosFilter } from './components/TodosFilter';
import { ErrorMessage } from './types/ErrorMessage';
import { Status } from './types/Status';
import { createTodo, deleteTodo, getTodos } from './api/todos';

const USER_ID = 11357;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<ErrorMessage | null>(null);
  const [todoTitle, setTodoTitle] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filterBy, setFilterBy] = useState<Status>(Status.all);
  const [processingIds, setProcessingIds] = useState<number[]>([]);

  const showError = (errorType: ErrorMessage) => {
    setIsError(true);
    setError(errorType);
    setTimeout(() => {
      setIsError(false);
      setError(null);
    }, 3000);
  };

  const filteredTodos = useMemo(() => {
    switch (filterBy) {
      case Status.active:
        return todos.filter(todo => !todo.completed);
      case Status.completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [filterBy, todos]);

  const resetField = (): void => {
    setTodoTitle('');
    setIsError(false);
    setError(null);
  };

  const handleDeleteTodo = (todoId: number) => {
    setProcessingIds(current => [...current, todoId]);
    deleteTodo(todoId)
      .then(() => setTodos(
        currentTodos => currentTodos.filter(todo => todo.id !== todoId),
      ))
      .catch(() => {
        showError(ErrorMessage.deleteError);
      })
      .finally(() => setProcessingIds([]));
  };

  const clearCompleted = () => {
    todos.map(todo => {
      if (todo.completed) {
        setProcessingIds(current => [...current, todo.id]);
        handleDeleteTodo(todo.id);
      }

      return todo;
    });
  };

  const handleAddTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!todoTitle.trim()) {
      showError(ErrorMessage.emptyTitle);

      return;
    }

    const newTodo: Todo = {
      id: Math.max(...todos.map(todo => todo.id)) + 1,
      title: todoTitle,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo({ ...newTodo, id: 0 });

    setProcessingIds(current => [...current, 0]);
    createTodo(newTodo)
      .then(newToDo => {
        setTodos(currentTodos => [...currentTodos, newToDo]);
        resetField();
      })
      .catch(() => {
        setTempTodo(null);
        showError(ErrorMessage.addError);
      })
      .finally(() => {
        setTempTodo(null);
        setProcessingIds([]);
      });

    resetField();
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then(data => {
        const todosData = data as Todo[];

        setTodos(todosData);
      })
      .catch(() => {
        showError(ErrorMessage.loadError);
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            aria-label="toggle-button"
            type="button"
            className="todoapp__toggle-all"
          />
          {!todos.find(todo => todo.completed === false) && (
            <button
              type="button"
              aria-label="button"
              className={
                cn(
                  'todoapp__toggle-all',
                  {
                    active: !!todos.length,
                  },
                )
              }
            />
          )}

          <form onSubmit={handleAddTodo}>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={todoTitle}
              onChange={event => setTodoTitle(event.target.value)}
              disabled={!!tempTodo}
            />
          </form>
        </header>

        {tempTodo
          ? (
            <TodoList
              todos={[...filteredTodos, tempTodo]}
              onDelete={handleDeleteTodo}
              processingIds={processingIds}
            />
          )
          : (
            <TodoList
              todos={filteredTodos}
              onDelete={handleDeleteTodo}
              processingIds={processingIds}
            />
          )}

        {
          todos.length > 0 && (
            <TodosFilter
              todos={todos}
              filterBy={filterBy}
              setFilterBy={setFilterBy}
              clearCompleted={clearCompleted}
            />
          )
        }
      </div>

      {isError && (
        <div className="notification is-danger is-light has-text-weight-normal">
          <button
            type="button"
            className="delete"
            aria-label="button"
            onClick={() => setIsError(false)}
          />
          {error}
          <br />
        </div>
      )}
    </div>
  );
};
