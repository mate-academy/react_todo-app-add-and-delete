import { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { TodoAppHeader } from './components/TodoAppHeader';
import { TodoList } from './components/TodoList';
import { TodoAppFooter } from './components/TodoAppFooter';
import { ErrorNotification } from './components/ErrorNotification';
import { Nullable } from './types/Nullable';
import { Todo } from './types/Todo';
import { FilterOption } from './types/FilterOption';
import { filterTodos } from './utils/filterTodos';
import { postTodo, deleteTodo, getTodos, USER_ID } from './api/todos';

export const App = () => {
  const [errorMessage, setErrorMessage] = useState<Nullable<string>>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterOption>(FilterOption.ALL);
  const [tempTodo, setTempTodo] = useState<Nullable<Todo>>(null);
  const [pendingTodoIds, setPendingTodoIds] = useState<Todo['id'][]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  const hasTodos = todos.length > 0;
  const activeTodosCount = filterTodos(todos, FilterOption.ACTIVE).length;
  const hasCompletedTodos = todos.length - activeTodosCount > 0;
  const allCompleted = hasTodos && activeTodosCount === 0;

  const visibleTodos = filterTodos(todos, filter);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timerId = setTimeout(() => {
      setErrorMessage(null);
    }, 3000);

    return () => clearTimeout(timerId);
  }, [errorMessage]);

  const handleCreateTodo = async (newTodoTitle: string) => {
    setErrorMessage(null);
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: newTodoTitle,
      completed: false,
    });

    try {
      const newTodo = await postTodo(newTodoTitle);

      setTodos(prev => [...prev, newTodo]);
    } catch (error) {
      setErrorMessage('Unable to add a todo');
      throw error;
    } finally {
      setTempTodo(null);
    }
  };

  const handleRemoveTodo = async (id: Todo['id']) => {
    setErrorMessage(null);
    setPendingTodoIds(prev => [...prev, id]);
    try {
      await deleteTodo(id);

      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch {
      setErrorMessage('Unable to delete a todo');
    } finally {
      inputRef.current?.focus();
      setPendingTodoIds(prev => prev.filter(pendingId => pendingId !== id));
    }
  };

  const handleRemoveCompleted = async () => {
    setErrorMessage(null);
    const completedTodoIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    await Promise.all(completedTodoIds.map(id => handleRemoveTodo(id)));
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoAppHeader
          allCompleted={allCompleted}
          inputRef={inputRef}
          onAddTodo={handleCreateTodo}
          onError={setErrorMessage}
        />

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          onDeleteTodo={handleRemoveTodo}
          pendingTodoIds={pendingTodoIds}
        />

        {hasTodos && (
          <TodoAppFooter
            hasCompletedTodos={hasCompletedTodos}
            activeTodosCount={activeTodosCount}
            filter={filter}
            onSelectFilter={setFilter}
            onRemoveCompleted={handleRemoveCompleted}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onClose={() => setErrorMessage(null)}
      />
    </div>
  );
};
