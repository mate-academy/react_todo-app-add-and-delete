import React, { useEffect, useMemo, useRef, useState } from 'react';

import { UserWarning } from './UserWarning';
import { getTodos, USER_ID, addTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { Notification } from './components/Notification';
import { Filter } from './FilterEnum';
import { filterTodos } from './utils/todo/filterTodos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [isNotificationHidden, setIsNotificationHidden] = useState(true);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  const showErrorMessage = (message: string) => {
    setErrorMessage(message);
    setIsNotificationHidden(false);

    setTimeout(() => {
      setErrorMessage('');
      setIsNotificationHidden(true);
    }, 3000);
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        showErrorMessage('Unable to load todos');
      });
  }, []);

  const hasTodos = !!todos.length;

  const visibleTodos = useMemo(
    () => filterTodos(todos, filter),
    [todos, filter],
  );

  const activeTodosCount = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );

  const areAllTodosCompleted = useMemo(
    () => activeTodosCount === 0,
    [activeTodosCount],
  );

  const hasCompletedTodos = useMemo(
    () => todos.some(todo => todo.completed),
    [todos],
  );

  const handleAddTodo = (title: string) => {
    setErrorMessage('');

    const trimmedTitle = title.trim();

    if (!trimmedTitle.length) {
      showErrorMessage('Title should not be empty');

      return Promise.reject('Title is empty');
    }

    setTempTodo({
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
      id: 0,
    });

    return addTodo({ title: trimmedTitle, userId: USER_ID, completed: false })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
      })
      .catch(error => {
        showErrorMessage('Unable to add a todo');
        throw new Error(error);
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setDeletingTodoIds([todoId]);

    return deleteTodo(todoId)
      .then(() => {
        setTodos(curr => curr.filter(todo => todo.id !== todoId));
      })
      .catch(error => {
        showErrorMessage('Unable to delete a todo');
        throw new Error(error);
      })
      .finally(() => {
        setDeletingTodoIds([]);

        if (inputRef.current) {
          inputRef.current.focus();
        }
      });
  };

  const handleClearCompletedTodos = () => {
    const completedTodoIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setDeletingTodoIds(completedTodoIds);
    Promise.all(
      completedTodoIds.map(id =>
        deleteTodo(id)
          .then(() => {
            setTodos(curr => curr.filter(todo => todo.id !== id));
          })
          .catch(error => {
            showErrorMessage('Unable to delete a todo');
            throw new Error(error);
          })
          .finally(() => {
            setDeletingTodoIds([]);
            if (inputRef.current) {
              inputRef.current.focus();
            }
          }),
      ),
    );
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          areAllTodosCompleted={areAllTodosCompleted}
          onAdd={handleAddTodo}
          inputRef={inputRef}
          hasTodos={hasTodos}
        />

        {hasTodos && (
          <TodoList
            todos={visibleTodos}
            tempTodo={tempTodo}
            todoIdsToDelete={deletingTodoIds}
            onDelete={handleDeleteTodo}
          />
        )}

        {hasTodos && (
          <Footer
            currFilter={filter}
            activeTodosCount={activeTodosCount}
            hasCompletedTodos={hasCompletedTodos}
            onFilterClick={setFilter}
            onClearCompletedTodos={handleClearCompletedTodos}
          />
        )}
      </div>

      <Notification
        errorMessage={errorMessage}
        isHidden={isNotificationHidden}
        onClose={setIsNotificationHidden}
      />
    </div>
  );
};
