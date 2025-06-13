/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorMessage } from './components/ErrorMessage';
import { USER_ID } from './api/todos';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Header } from './components/Header';
import { FilterParams, TodoErrorMessage } from './types/enums';

const activeTodosCount = (todos: Todo[]) =>
  todos.filter(todo => !todo.completed).length;

const isAllTodosCompleted = (todos: Todo[]): boolean =>
  todos.every(todo => todo.completed);

function filterTodosByParam(todos: Todo[], filter: FilterParams): Todo[] {
  switch (filter) {
    case FilterParams.Active:
      return todos.filter(todo => !todo.completed);

    case FilterParams.Completed:
      return todos.filter(todo => todo.completed);

    default:
      return todos;
  }
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(TodoErrorMessage.DEFAULT);
  const [selectedFilterParam, setSelectedFilterParam] = useState<FilterParams>(
    FilterParams.All,
  );
  const [pendingTodoIds, setPendingTodoIds] = useState<Set<number>>(new Set());
  const [newTodoTitle, setNewTodoTitle] = useState('');

  useEffect(() => {
    setIsLoading(true);
    todoService
      .getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage(TodoErrorMessage.UNABLE_TO_LOAD);
        setTimeout(() => {
          setErrorMessage(TodoErrorMessage.DEFAULT);
        }, 3000);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  function addTodo({ title, userId, completed }: Omit<Todo, 'id'>) {
    setIsLoading(true);
    const tempId = 0;
    const tempTodoItem: Todo = {
      id: tempId,
      title: newTodoTitle,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo(tempTodoItem);

    todoService
      .createTodos({ title, userId, completed })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTempTodo(null);
        setNewTodoTitle('');
      })
      .catch(() => {
        setErrorMessage(TodoErrorMessage.UNABLE_TO_ADD);
        setTempTodo(null);
        setTimeout(() => setErrorMessage(TodoErrorMessage.DEFAULT), 3000);
      })
      .finally(() => {
        setIsLoading(false);
        inputRef.current?.focus();
      });
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = newTodoTitle.trim();

    if (!trimmedTitle) {
      setErrorMessage(TodoErrorMessage.EMPTY_TiTLE);
      setTimeout(() => setErrorMessage(TodoErrorMessage.DEFAULT), 3000);
      inputRef.current?.focus();
      setIsLoading(false);

      return;
    }

    setIsLoading(true);

    addTodo({
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
    });
  };

  function deleteTodo(todoId: number) {
    setPendingTodoIds(prev => new Set(prev).add(todoId));
    todoService
      .deleteTodos(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage(TodoErrorMessage.UNABLE_TO_DELETE);
        setTimeout(() => setErrorMessage(TodoErrorMessage.DEFAULT), 3000);
      })
      .finally(() => {
        setIsLoading(false);
        setPendingTodoIds(prev => {
          const updated = new Set(prev);

          updated.delete(todoId);

          return updated;
        });
        inputRef.current?.focus();
      });
  }

  const handleDelete = (todoId: number) => {
    if (!deleteTodo) {
      return;
    }

    deleteTodo(todoId);
  };

  const clearCompletedTodos = () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const loadingSet = new Set(pendingTodoIds);

    completedTodos.forEach(todo => loadingSet.add(todo.id));
    setPendingTodoIds(new Set(loadingSet));

    const deletePromises = completedTodos.map(todo =>
      todoService
        .deleteTodos(todo.id)
        .then(() => {
          setTodos(currentTodos =>
            currentTodos.filter(todoItem => todoItem.id !== todo.id),
          );
        })
        .catch(() => {
          setErrorMessage(TodoErrorMessage.UNABLE_TO_DELETE);
          setTimeout(() => setErrorMessage(TodoErrorMessage.DEFAULT), 3000);
        })
        .finally(() => {
          setPendingTodoIds(prev => {
            const updated = new Set(prev);

            updated.delete(todo.id);

            return updated;
          });
        }),
    );

    Promise.allSettled(deletePromises).then(() => {
      inputRef.current?.focus();
    });
  };

  const handleChangeFilterParam = useCallback((filterParam: FilterParams) => {
    setSelectedFilterParam(filterParam);
  }, []);

  const filteredTodos = filterTodosByParam(todos, selectedFilterParam);

  const shouldShowTodoList = todos.length > 0 || isLoading;
  const shouldShowFooter = todos.length > 0;
  const isAllCompleted = isAllTodosCompleted(todos);
  const numberOfActiveTodos = activeTodosCount(todos);
  const hasCompletedTodo = todos.some(todo => todo.completed);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          isAllCompleted={isAllCompleted}
          handleSubmit={handleSubmit}
          setNewTodoTitle={setNewTodoTitle}
          newTodoTitle={newTodoTitle}
          isLoading={isLoading}
          inputRef={inputRef}
        />

        {shouldShowTodoList && (
          <TodoList
            todos={filteredTodos}
            tempTodo={tempTodo}
            onDelete={handleDelete}
            pendingTodoIds={pendingTodoIds}
          />
        )}
        {shouldShowFooter && (
          <Footer
            numberOfActiveTodos={numberOfActiveTodos}
            selectedFilterParam={selectedFilterParam}
            handleChangeFilterParam={handleChangeFilterParam}
            clearCompletedTodos={clearCompletedTodos}
            hasCompletedTodo={hasCompletedTodo}
          />
        )}
      </div>
      <ErrorMessage errorMessage={errorMessage} />
    </div>
  );
};
