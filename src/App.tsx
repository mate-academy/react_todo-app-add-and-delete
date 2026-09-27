import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, addTodo, getTodos, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { ErrorMessage } from './types/ErrorMessage';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState(Filter.All);
  const [isAdding, setIsAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAddSuccessful, setIsAddSuccessful] = useState(false);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);

  const handleError = (message: ErrorMessage) => {
    setError(message);

    setTimeout(() => {
      setError('');
    }, 3000);
  };

  const handleAddTodo = (trimmedTitle: string) => {
    setIsAdding(true);
    setIsAddSuccessful(false);

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    });

    addTodo(trimmedTitle)
      .then(createdTodo => {
        setTodos(currentTodos => [...currentTodos, createdTodo]);
        setIsAddSuccessful(true);
      })
      .catch(() => {
        handleError(ErrorMessage.Add);
      })
      .finally(() => {
        setIsAdding(false);
        setTempTodo(null);
      });
  };

  const isDeleting = deletingTodoIds.length > 0;

  const handleDeleteTodo = (todoId: number) => {
    setDeletingTodoIds(currentIds => [...currentIds, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        handleError(ErrorMessage.Delete);
      })
      .finally(() => {
        setDeletingTodoIds(currentIds =>
          currentIds.filter(id => id !== todoId),
        );
      });
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => {
      handleDeleteTodo(todo.id);
    });
  };

  let visibleTodos = [...todos];

  if (filter === Filter.Active) {
    visibleTodos = visibleTodos.filter(todo => !todo.completed);
  }

  if (filter === Filter.Completed) {
    visibleTodos = visibleTodos.filter(todo => todo.completed);
  }

  function loadTodos() {
    setError('');

    getTodos()
      .then(loadedTodos => {
        setTodos(loadedTodos);
      })
      .catch(() => {
        handleError(ErrorMessage.Load);
      });
  }

  useEffect(loadTodos, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onError={handleError}
          onAddTodo={handleAddTodo}
          isAdding={isAdding}
          isAddSuccessful={isAddSuccessful}
          isDeleting={isDeleting}
        />

        {(todos.length > 0 || tempTodo !== null) && (
          <TodoList
            visibleTodos={visibleTodos}
            tempTodo={tempTodo}
            handleDeleteTodo={handleDeleteTodo}
            deletingTodoIds={deletingTodoIds}
          />
        )}

        {todos.length > 0 && (
          <Footer
            todos={todos}
            filter={filter}
            onFilterChange={setFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification error={error} onClose={() => setError('')} />
    </div>
  );
};
