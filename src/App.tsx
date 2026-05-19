/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID, addTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { ErrorType } from './types/Errors';
import { ErrorNotification } from './components/ErrorNotification';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { TodoItem } from './components/TodoItem';

enum TodoStatus {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}

export const App: React.FC = () => {
  const [todoList, setTodoList] = React.useState<Todo[]>([]);
  const [error, setError] = React.useState<ErrorType | null>(null);
  const [filterByStatus, setFilterByStatus] = React.useState<TodoStatus>(
    TodoStatus.All,
  );
  const [newTodoTitle, setNewTodoTitle] = React.useState('');
  const [isAddingTodo, setIsAddingTodo] = React.useState(false);
  const [tempTodo, setTempTodo] = React.useState<Todo | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [loadingTodoIds, setLoadingTodoIds] = React.useState<number[]>([]);

  React.useEffect(() => {
    inputRef.current?.focus();
    const loadTodos = async () => {
      try {
        setError(null);

        const data = await getTodos();

        setTodoList(data);
      } catch {
        setError('unableToLoad');
      }
    };

    void loadTodos();
  }, []);

  React.useEffect(() => {
    if (!error) {
      return;
    }

    const timer = setTimeout(() => {
      setError(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [error]);

  const filteredTodosList = React.useMemo(() => {
    switch (filterByStatus) {
      case TodoStatus.All:
        return todoList;

      case TodoStatus.Active:
        return todoList.filter(todo => !todo.completed);

      case TodoStatus.Completed:
        return todoList.filter(todo => todo.completed);

      default:
        return todoList;
    }
  }, [filterByStatus, todoList]);

  const isAllCompleted =
    todoList.length > 0 && todoList.every(todo => todo.completed);

  const activeTodosCount = React.useMemo(() => {
    return todoList.filter(todo => !todo.completed).length;
  }, [todoList]);

  const handleAddTodo = async (event: React.FormEvent) => {
    event.preventDefault();

    const normalizedTitle = newTodoTitle.trim();

    if (!normalizedTitle) {
      setError('titleInput');

      return;
    }

    try {
      setError(null);
      setIsAddingTodo(true);

      const temporaryTodo: Todo = {
        id: 0,
        title: normalizedTitle,
        completed: false,
        userId: USER_ID,
      };

      setTempTodo(temporaryTodo);

      const createdTodo = await addTodo({
        title: normalizedTitle,
        completed: false,
        userId: USER_ID,
      });

      setTodoList(currentTodos => [...currentTodos, createdTodo]);

      setNewTodoTitle('');
    } catch {
      setError('unableToCreate');
    } finally {
      setIsAddingTodo(false);
      setTempTodo(null);

      setTimeout(() => {
        inputRef.current?.focus();
      });
    }
  };

  const addLoadingTodo = (todoId: number) => {
    setLoadingTodoIds(current => [...current, todoId]);
  };

  const removeLoadingTodo = (todoId: number) => {
    setLoadingTodoIds(current => current.filter(id => id !== todoId));
  };

  const handleDeleteTodo = async (todoId: number) => {
    try {
      setError(null);

      addLoadingTodo(todoId);

      await deleteTodo(todoId);

      setTodoList(currentTodos =>
        currentTodos.filter(todo => todo.id !== todoId),
      );
    } catch {
      setError('unableToDelete');
    } finally {
      removeLoadingTodo(todoId);
      inputRef.current?.focus();
    }
  };

  const handleClearCompleted = async () => {
    const todosToDelete = todoList.filter(todo => todo.completed);

    await Promise.all(todosToDelete.map(todo => handleDeleteTodo(todo.id)));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          isAllCompleted={isAllCompleted}
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
          isAddingTodo={isAddingTodo}
          inputRef={inputRef}
          onSubmit={handleAddTodo}
        />

        <TodoList
          todos={filteredTodosList}
          onDelete={handleDeleteTodo}
          loadingTodoIds={loadingTodoIds}
        />
        {tempTodo && (
          <TodoItem todo={tempTodo} isLoading onDelete={handleDeleteTodo} />
        )}

        {/* Hide the footer if there are no todos */}
        {todoList.length > 0 && (
          <TodoFooter
            todosLeft={activeTodosCount}
            hasCompletedTodos={todoList.some(todo => todo.completed)}
            filterByStatus={filterByStatus}
            setFilterByStatus={setFilterByStatus}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>
      <ErrorNotification error={error} setError={setError} />
    </div>
  );
};
