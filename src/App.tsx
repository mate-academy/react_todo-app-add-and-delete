import React, { useState, useRef, useEffect } from 'react';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  getTodos,
  postTodos,
  patchTodo,
  deleteTodo,
} from './api/todos';
import Notifications from './components/Notifications';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { TodoHeader } from './components/TodoHeader';
import { TodoFooter } from './components/TodoFooter';
import { FilterStatus } from './types/FilterStatus';
import { ErrorMessage } from './types/errorMessage';

const allFilters = {
  [FilterStatus.All]: () => true,
  [FilterStatus.Active]: (td: Todo) => !td.completed,
  [FilterStatus.Completed]: (td: Todo) => td.completed,
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [currentFilter, setCurrentFilter] = useState<FilterStatus>(
    FilterStatus.All,
  );
  const [errorMessage, setErrorMessage] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);
  const [updatingTodoIds, setUpdatingTodoIds] = useState<number[]>([]);
  const focusedInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setErrorMessage('');
    focusedInput.current?.focus();

    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessage.LOAD_TODO);
        setTimeout(() => setErrorMessage(''), 3000);
      });
  }, []);

  const filteredTodos = todos.filter(allFilters[currentFilter]);
  const incompletedTodos = todos.filter(allFilters[FilterStatus.Active]);

  const handleAddTodo = async (title: string): Promise<void> => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage(ErrorMessage.TITLE_NOT_EMPTY);
      setTimeout(() => setErrorMessage(''), 3000);
      focusedInput.current?.focus();

      return;
    }

    const newTodo: Omit<Todo, 'id'> = {
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    };

    setIsAdding(true);

    setTempTodo({
      id: 1,
      ...newTodo,
    });

    try {
      const todo = await postTodos(newTodo);

      setTodos(prev => [...prev, todo]);
    } catch (error) {
      setErrorMessage(ErrorMessage.ADD_TODO);
      focusedInput.current?.focus();
      setTimeout(() => setErrorMessage(''), 3000);
      throw error;
    } finally {
      setTempTodo(null);
      setIsAdding(false);
    }
  };

  const handleToggleTodo = (id: number) => {
    const todo = todos.find(td => td.id === id);

    if (!todo) {
      return;
    }

    setUpdatingTodoIds(prev => [...prev, id]);

    patchTodo(id, { completed: !todo.completed })
      .then(updated =>
        setTodos(prev =>
          prev.map(td => (td.id === id ? { ...td, ...updated } : td)),
        ),
      )
      .catch(() => {
        setErrorMessage(ErrorMessage.UPDATE_TODO);
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setUpdatingTodoIds(prev => prev.filter(td => td !== id));
      });
  };

  const handleToggleAll = () => {
    const isAllCompleted = todos.every(td => td.completed);

    const todosToUpdate = isAllCompleted
      ? todos
      : todos.filter(td => !td.completed);

    todosToUpdate.forEach(todo => {
      handleToggleTodo(todo.id);
    });
  };

  const handleDeleteTodo = (id: number) => {
    setDeletingTodoIds(prev => [...prev, id]);

    deleteTodo(id)
      .then(() => {
        setTodos(prev => prev.filter(td => td.id !== id));
        focusedInput.current?.focus();
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.DELETE_TODO);
        setTimeout(() => setErrorMessage(''), 3000);
      });
  };

  const handleClearCompleted = () => {
    const completed = todos.filter(td => td.completed);
    const completedId = completed.map(todo => todo.id);

    setDeletingTodoIds(completedId);

    Promise.allSettled(completed.map(td => deleteTodo(td.id))).then(results => {
      const successfulIds = completed
        .filter((_, index) => results[index].status === 'fulfilled')
        .map(td => td.id);

      setTodos(prev => prev.filter(td => !successfulIds.includes(td.id)));

      setDeletingTodoIds([]);

      focusedInput.current?.focus();

      const hasError = results.some(result => result.status === 'rejected');

      if (hasError) {
        setErrorMessage(ErrorMessage.DELETE_TODO);
        setTimeout(() => setErrorMessage(''), 3000);
      }
    });
  };

  const handleRenameTodo = async (
    id: number,
    newTitle: string,
  ): Promise<void> => {
    setUpdatingTodoIds(prev => [...prev, id]);

    try {
      const updated = await patchTodo(id, { title: newTitle });

      setTodos(prev =>
        prev.map(td => (td.id === id ? { ...td, ...updated } : td)),
      );
    } catch (error) {
      setErrorMessage(ErrorMessage.UPDATE_TODO);
      setTimeout(() => setErrorMessage(''), 3000);
      throw error;
    } finally {
      setUpdatingTodoIds(prev => prev.filter(t => t !== id));
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleCloseError = () => setErrorMessage('');

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          focusedInput={focusedInput}
          isAdding={isAdding}
          onToggleAll={handleToggleAll}
          onAddTodo={handleAddTodo}
        />

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          deletingTodoIds={deletingTodoIds}
          updatingTodoIds={updatingTodoIds}
          onToggle={handleToggleTodo}
          onDelete={handleDeleteTodo}
          onRename={handleRenameTodo}
        />

        {todos.length > 0 && (
          <TodoFooter
            incompletedTodosCount={incompletedTodos.length}
            completedTodosCount={todos.length - incompletedTodos.length}
            currentFilter={currentFilter}
            onFilterChange={setCurrentFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <Notifications message={errorMessage} onClose={handleCloseError} />
    </div>
  );
};
