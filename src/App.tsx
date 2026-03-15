/* eslint-disable @typescript-eslint/indent */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo, TodoErrorMessages, TodosFilterStatus } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import { TodoHeader } from './components/TodoHeader/TodoHeader';
import { TodoFooter } from './components/TodoFooter/TodoFooter';
import { TodoError } from './components/TodoError/TodoError';

const HIDE_ERROR_TIMEOUT = 3000;

export const App: React.FC = () => {
  const [loadingTodoIds, setLoadingTodoIds] = useState<Todo['id'][]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState<TodoErrorMessages>('');
  const [todosFilterStatus, setFilterTodosStatus] =
    useState<TodosFilterStatus>('All');
  const remainedTodos = todos.filter(todo => !todo.completed).length;

  const newTodoField = useRef<HTMLInputElement>(null);
  const errorTimerRef = useRef<number>();

  function hideErrorMessageAfterTimeout(timeout: number) {
    if (errorTimerRef.current) {
      clearTimeout(errorTimerRef.current);
    }

    errorTimerRef.current = window.setTimeout(() => {
      setErrorMessage('');
    }, timeout);
  }

  async function getTodosFromServer() {
    try {
      const todosFromServer = await getTodos();

      setTodos(todosFromServer);
    } catch {
      setErrorMessage('Unable to load todos');
      hideErrorMessageAfterTimeout(HIDE_ERROR_TIMEOUT);
    }
  }

  useEffect(() => {
    getTodosFromServer();
  }, []);

  async function handleTodoSubmit(
    event: React.FormEvent,
    todoTitle: string,
    setTodoTitle: React.Dispatch<React.SetStateAction<string>>,
  ) {
    event.preventDefault();

    if (todoTitle.trim() === '') {
      setErrorMessage('Title should not be empty');
      hideErrorMessageAfterTimeout(HIDE_ERROR_TIMEOUT);

      return;
    }

    const newTodo = {
      title: todoTitle,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo({
      title: todoTitle,
      completed: false,
      userId: USER_ID,
      id: 0,
    });
    try {
      const todoFromPost = await addTodo(newTodo);

      setTodoTitle('');

      setTodos(currentTodos => {
        return [...currentTodos, todoFromPost];
      });
    } catch (error) {
      setTodoTitle(todoTitle);
      setErrorMessage('Unable to add a todo');
      hideErrorMessageAfterTimeout(HIDE_ERROR_TIMEOUT);
    } finally {
      setTempTodo(null);
    }
  }

  async function handleTodoDelete(todoId: Todo['id']) {
    setLoadingTodoIds(prevIds => [...prevIds, todoId]);
    try {
      await deleteTodo(todoId);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      newTodoField.current?.focus();
    } catch {
      setErrorMessage('Unable to delete a todo');
      hideErrorMessageAfterTimeout(HIDE_ERROR_TIMEOUT);
      setTodos(todos);
    } finally {
      setLoadingTodoIds(prevIds => prevIds.filter(id => id !== todoId));
    }
  }

  async function deleteCompletedTodos() {
    const completedTodoIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setLoadingTodoIds(prevIds => [...prevIds, ...completedTodoIds]);

    const deleteRequests = await Promise.allSettled(
      completedTodoIds.map(id => deleteTodo(id).then(() => id)),
    );

    const deletedTodoIds = deleteRequests
      .filter(
        (request): request is PromiseFulfilledResult<number> =>
          request.status === 'fulfilled',
      )
      .map(request => request.value);

    if (deleteRequests.some(request => request.status === 'rejected')) {
      setErrorMessage('Unable to delete a todo');
      hideErrorMessageAfterTimeout(HIDE_ERROR_TIMEOUT);
    }

    setTodos(prevTodos => {
      return prevTodos.filter(todo => !deletedTodoIds.includes(todo.id));
    });

    setLoadingTodoIds(prevIds =>
      prevIds.filter(id => !completedTodoIds.includes(id)),
    );
    newTodoField.current?.focus();
  }

  const visibleTodos = todos.filter(todo => {
    switch (todosFilterStatus) {
      case 'All':
        return true;
      case 'Completed':
        return todo.completed;
      case 'Active':
        return !todo.completed;
      default:
        return true;
    }
  });

  function isAllTodosComplete() {
    return visibleTodos.length !== 0
      ? visibleTodos.every(todo => todo.completed)
      : false;
  }

  async function handleTodoTitleUpdate(
    todoId: Todo['id'],
    newTitle: string,
    setSelectedTodo: React.Dispatch<React.SetStateAction<Todo | null>>,
    event?: React.FormEvent<HTMLFormElement>,
  ) {
    event?.preventDefault();

    if (newTitle === '') {
      await handleTodoDelete(todoId);
    }

    if (newTitle === todos.find(todo => todo.id === todoId)?.title) {
      setSelectedTodo(null);

      return;
    }

    setTodos(prevTodos => {
      return prevTodos.map(prevTodo => {
        if (prevTodo.id === todoId) {
          return { ...prevTodo, title: newTitle.trim() };
        }

        return prevTodo;
      });
    });

    setLoadingTodoIds(prevIds => [...prevIds, todoId]);
    try {
      await updateTodo(todoId, { title: newTitle.trim() });
      setSelectedTodo(null);
    } catch {
      setSelectedTodo(todos.find(todo => todo.id) ?? null);
      setErrorMessage('Unable to update a todo');
      hideErrorMessageAfterTimeout(HIDE_ERROR_TIMEOUT);
    } finally {
      setLoadingTodoIds(prevIds => prevIds.filter(id => id !== todoId));
    }
  }

  async function handleTodoToggle(todoId: Todo['id'], status: boolean) {
    setLoadingTodoIds(prevIds => [...prevIds, todoId]);
    try {
      await updateTodo(todoId, { completed: status });
      setTodos(currentTodos => {
        return currentTodos.map(todo => {
          if (todo.id === todoId) {
            return {
              ...todo,
              completed: !todo.completed,
            };
          }

          return todo;
        });
      });
    } catch {
      setErrorMessage('Unable to update a todo');
      hideErrorMessageAfterTimeout(HIDE_ERROR_TIMEOUT);
    } finally {
      setLoadingTodoIds(prevIds => prevIds.filter(id => id !== todoId));
    }
  }

  async function handleTodoToggles() {
    if (isAllTodosComplete()) {
      setLoadingTodoIds([...todos.map(todo => todo.id)]);

      const updateRequests = await Promise.allSettled(
        todos.map(todo =>
          updateTodo(todo.id, { completed: false }).then(() => todo.id),
        ),
      );

      const updatedTodoIds = updateRequests
        .filter(
          (request): request is PromiseFulfilledResult<number> =>
            request.status === 'fulfilled',
        )
        .map(request => request.value);

      setTodos(prevTodos => {
        return prevTodos.map(todo => {
          if (updatedTodoIds.includes(todo.id)) {
            return { ...todo, completed: !todo.completed };
          }

          return todo;
        });
      });

      if (updateRequests.some(request => request.status === 'rejected')) {
        setErrorMessage('Unable to update a todo');
        hideErrorMessageAfterTimeout(HIDE_ERROR_TIMEOUT);
      }

      setLoadingTodoIds([]);

      return;
    }

    const notCompletedTodoIds = todos
      .filter(todo => !todo.completed)
      .map(todo => todo.id);

    setLoadingTodoIds(prevIds => [...prevIds, ...notCompletedTodoIds]);

    const updateRequests = await Promise.allSettled(
      notCompletedTodoIds.map(id =>
        updateTodo(id, { completed: true }).then(() => id),
      ),
    );

    const updatedTodoIds = updateRequests
      .filter(
        (request): request is PromiseFulfilledResult<number> =>
          request.status === 'fulfilled',
      )
      .map(request => request.value);

    setTodos(prevTodos => {
      return prevTodos.map(todo => {
        if (updatedTodoIds.includes(todo.id)) {
          return { ...todo, completed: !todo.completed };
        }

        return todo;
      });
    });

    if (updateRequests.some(request => request.status === 'rejected')) {
      setErrorMessage('Unable to update a todo');
      hideErrorMessageAfterTimeout(HIDE_ERROR_TIMEOUT);
    }

    setLoadingTodoIds(prevIds =>
      prevIds.filter(id => !notCompletedTodoIds.includes(id)),
    );
  }

  function isTodosExists() {
    return todos.length !== 0;
  }

  function isSomeTodosCompleted() {
    return visibleTodos ? visibleTodos.some(todo => todo.completed) : false;
  }

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          onToggles={handleTodoToggles}
          onAdd={handleTodoSubmit}
          isAllTodosComplete={isAllTodosComplete}
          newTodoField={newTodoField}
          isTodosExists={isTodosExists}
        />

        <TodoList
          tempTodo={tempTodo}
          onDelete={handleTodoDelete}
          onUpdate={handleTodoTitleUpdate}
          loadingTodoIds={loadingTodoIds}
          todos={visibleTodos}
          onToggle={handleTodoToggle}
        />

        {(todos.length !== 0 || tempTodo) && (
          <TodoFooter
            isSomeTodosCompleted={isSomeTodosCompleted}
            remainedTodos={remainedTodos}
            setFilterTodosStatus={setFilterTodosStatus}
            todosFilterStatus={todosFilterStatus}
            deleteCompletedTodos={deleteCompletedTodos}
          />
        )}
      </div>
      <TodoError
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
