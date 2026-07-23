import classNames from 'classnames';
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  addTodo,
  changeTodo,
  deleteTodo,
  getTodos,
  USER_ID,
} from './api/todos';
import { AddForm } from './components/AddForm/AddForm';
import { ErrComponent } from './components/ErrComponent/ErrComponent';
import { Footer } from './components/Footer/Footer';
import { TodoList } from './components/TodoList/TodoList';
import { ErrorMessage } from './types/Errors';
import { FilterStatus } from './types/Filter';
import { NewTodo, Todo, TodoId } from './types/Todo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [skeletonTodo, setSkeletonTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>(
    ErrorMessage.None,
  );
  const [loadingTodoId, setLoadingTodoId] = useState<TodoId | null>(null);
  const [editingId, setEditingId] = useState<TodoId | null>(null);
  const [filter, setFilter] = useState<FilterStatus>('all');

  useEffect(() => {
    const loadTodos = async () => {
      if (!USER_ID) {
        return;
      }

      setIsLoading(true);
      setErrorMessage(ErrorMessage.None);

      try {
        const fetchedTodos = await getTodos();

        setTodos(fetchedTodos);
      } catch (error) {
        setErrorMessage(ErrorMessage.Load);
      } finally {
        setIsLoading(false);
      }
    };

    loadTodos();
  }, []);

  const visibleTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const onSubmitTodo = async (title: string): Promise<boolean> => {
    if (skeletonTodo) {
      return false;
    }

    setErrorMessage(ErrorMessage.None);

    const newTodo: NewTodo = {
      title,
      completed: false,
      userId: USER_ID,
    };

    setSkeletonTodo({ ...newTodo, id: 0 });

    try {
      const createdTodo = await addTodo(newTodo);

      setTodos(currentTodos => [...currentTodos, createdTodo]);

      return true;
    } catch (error) {
      setErrorMessage(ErrorMessage.Add);

      return false;
    } finally {
      setSkeletonTodo(null);
    }
  };

  const onDeleteTodo = async (todoId: TodoId): Promise<boolean> => {
    if (loadingTodoId === todoId) {
      return false;
    }

    setLoadingTodoId(todoId);
    setErrorMessage(ErrorMessage.None);

    try {
      await deleteTodo(todoId);

      setTodos(current => current.filter(t => t.id !== todoId));

      return true;
    } catch (error) {
      setErrorMessage(ErrorMessage.Delete);

      return false;
    } finally {
      setLoadingTodoId(null);
    }
  };

  const onChangeTodo = async (newTodo: Todo): Promise<boolean> => {
    setLoadingTodoId(newTodo.id);
    setErrorMessage(ErrorMessage.None);

    try {
      await changeTodo(newTodo);

      setTodos(currentTodos =>
        currentTodos.map(todo => (todo.id === newTodo.id ? newTodo : todo)),
      );

      return true;
    } catch (err) {
      setErrorMessage(ErrorMessage.Update);

      return false;
    } finally {
      setLoadingTodoId(null);
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (!completedTodos.length) {
      return;
    }

    const previousTodos = [...todos];

    setTodos(current => current.filter(todo => !todo.completed));
    setErrorMessage(ErrorMessage.None);

    try {
      await Promise.allSettled(completedTodos.map(todo => deleteTodo(todo.id)));
    } catch (error) {
      setTodos(previousTodos);
      setErrorMessage(ErrorMessage.Clear);
    }
  };

  const activeTodosCount = todos.filter(t => !t.completed).length;
  const isAllCompleted = todos.length > 0 && activeTodosCount === 0;

  const handleToggleAll = async () => {
    const targetStatus = !isAllCompleted;

    const todosToUpdate = todos.filter(todo => todo.completed !== targetStatus);

    if (todosToUpdate.length === 0) {
      return;
    }

    const previousTodos = [...todos];

    setTodos(current =>
      current.map(todo => ({ ...todo, completed: targetStatus })),
    );
    setErrorMessage(ErrorMessage.None);

    try {
      await Promise.all(
        todosToUpdate.map(todo =>
          changeTodo({ ...todo, completed: targetStatus }),
        ),
      );
    } catch (error) {
      setTodos(previousTodos);
      setErrorMessage(ErrorMessage.Toggle);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {!isLoading && todos.length > 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: isAllCompleted,
              })}
              data-cy="ToggleAllButton"
              onClick={handleToggleAll}
            />
          )}

          <AddForm
            onSubmit={onSubmitTodo}
            onError={setErrorMessage}
            disabled={!!skeletonTodo}
          />
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          <TodoList
            todos={visibleTodos}
            skeletonTodo={skeletonTodo}
            onDelete={onDeleteTodo}
            onChange={onChangeTodo}
            loadingTodoId={loadingTodoId}
            editingId={editingId}
            setEditingId={setEditingId}
          />
        </section>

        {!isLoading && todos.length > 0 && (
          <Footer
            todos={todos}
            filter={filter}
            onFilterChange={setFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>
      <ErrComponent
        errMessage={errorMessage}
        onClose={setErrorMessage}
        duration={1000}
      />
    </div>
  );
};
