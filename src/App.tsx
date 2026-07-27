import classNames from 'classnames';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

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
  const [loadingTodoIds, setLoadingTodoIds] = useState<TodoId[]>([]);
  const [editingId, setEditingId] = useState<TodoId | null>(null);
  const [filter, setFilter] = useState<FilterStatus>('all');

  const todoInputRef = useRef<HTMLInputElement>(null);

  const focusNewTodoInput = () => {
    if (editingId === null) {
      todoInputRef.current?.focus();
    }
  };

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
        focusNewTodoInput();
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
      focusNewTodoInput();
    }
  };

  const onDeleteTodo = useCallback(
    async (todoId: TodoId): Promise<boolean> => {
      if (loadingTodoIds.includes(todoId)) {
        return false;
      }

      setLoadingTodoIds(current => [...current, todoId]);
      setErrorMessage(ErrorMessage.None);

      try {
        await deleteTodo(todoId);

        setTodos(current => current.filter(t => t.id !== todoId));

        return true;
      } catch (error) {
        setErrorMessage(ErrorMessage.Delete);

        return false;
      } finally {
        setLoadingTodoIds(current => current.filter(id => id !== todoId));
        focusNewTodoInput();
      }
    },
    [loadingTodoIds],
  );

  const onChangeTodo = useCallback(
    async (newTodo: Todo): Promise<boolean> => {
      if (loadingTodoIds.includes(newTodo.id)) {
        return false;
      }

      setLoadingTodoIds(current => [...current, newTodo.id]);
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
        setLoadingTodoIds(current => current.filter(id => id !== newTodo.id));
        focusNewTodoInput();
      }
    },
    [loadingTodoIds],
  );

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (!completedTodos.length) {
      return;
    }

    const targetIds = completedTodos.map(todo => todo.id);

    setLoadingTodoIds(current => [...current, ...targetIds]);
    setErrorMessage(ErrorMessage.None);

    const results = await Promise.allSettled(
      completedTodos.map(todo => deleteTodo(todo.id)),
    );

    const successfulIds: TodoId[] = [];
    let hasError = false;

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        successfulIds.push(completedTodos[index].id);
      } else {
        hasError = true;
      }
    });

    setTodos(current =>
      current.filter(todo => !successfulIds.includes(todo.id)),
    );

    if (hasError) {
      setErrorMessage(ErrorMessage.Delete);
    }

    setLoadingTodoIds(current => current.filter(id => !targetIds.includes(id)));
    focusNewTodoInput();
  };

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const isAllCompleted = todos.length > 0 && activeTodosCount === 0;

  const handleToggleAll = async () => {
    const targetStatus = !isAllCompleted;
    const todosToUpdate = todos.filter(todo => todo.completed !== targetStatus);

    if (todosToUpdate.length === 0) {
      return;
    }

    const targetIds = todosToUpdate.map(todo => todo.id);

    setLoadingTodoIds(current => [...current, ...targetIds]);
    setErrorMessage(ErrorMessage.None);

    const results = await Promise.allSettled(
      todosToUpdate.map(todo =>
        changeTodo({ ...todo, completed: targetStatus }).then(() => todo.id),
      ),
    );

    const successfulIds: TodoId[] = [];
    let hasError = false;

    for (const res of results) {
      if (res.status === 'fulfilled') {
        successfulIds.push(res.value);
      } else {
        hasError = true;
      }
    }

    setTodos(current =>
      current.map(todo =>
        successfulIds.includes(todo.id)
          ? { ...todo, completed: targetStatus }
          : todo,
      ),
    );

    if (hasError) {
      setErrorMessage(ErrorMessage.Toggle);
    }

    setLoadingTodoIds(current => current.filter(id => !targetIds.includes(id)));
    focusNewTodoInput();
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
            inputRef={todoInputRef}
          />
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          <TodoList
            todos={visibleTodos}
            skeletonTodo={skeletonTodo}
            onDelete={onDeleteTodo}
            onChange={onChangeTodo}
            loadingTodoIds={loadingTodoIds}
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
