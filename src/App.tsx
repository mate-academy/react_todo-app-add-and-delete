import React, { useEffect, useState, useRef } from 'react';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

export enum FilterType {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

function getVisibleTodos(todos: Todo[], filter: string) {
  let newTodosList = [...todos];

  if (filter) {
    switch (filter) {
      case FilterType.Active:
        newTodosList = newTodosList.filter(todo => !todo.completed);
        break;
      case FilterType.Completed:
        newTodosList = newTodosList.filter(todo => todo.completed);
        break;
      case FilterType.All:
      default:
        break;
    }
  }

  return newTodosList;
}

function getActiveTodosCounter(todos: Todo[]) {
  return todos.filter(todo => !todo.completed).length;
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<FilterType>(FilterType.All);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [processingTodoIds, setProcessingTodoIds] = useState<number[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const showError = (message: string) => {
    setErrorMessage(message);

    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  const handleHideError = () => {
    setErrorMessage('');
  };

  const handleAddTodo = async (title: string) => {
    setErrorMessage('');
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      showError('Title should not be empty');

      return;
    }

    setIsAdding(true);
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    });

    try {
      const newTodo = await addTodo({
        userId: USER_ID,
        title: trimmedTitle,
        completed: false,
      });

      setTodos(currentTodos => [...currentTodos, newTodo]);
      setNewTodoTitle('');
    } catch (error) {
      showError('Unable to add a todo');
    } finally {
      setIsAdding(false);
      setTempTodo(null);
      inputRef.current?.focus();
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    setErrorMessage('');
    setProcessingTodoIds(prevIds => [...prevIds, todoId]);

    try {
      await deleteTodo(todoId);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch (error) {
      showError('Unable to delete a todo');
    } finally {
      setProcessingTodoIds(prevIds => prevIds.filter(id => id !== todoId));
    }
  };

  const handleClearCompletedTodos = async () => {
    setErrorMessage('');
    const completedTodos = todos.filter(todo => todo.completed);
    const idsToDelete = completedTodos.map(todo => todo.id);

    if (idsToDelete.length === 0) {
      return;
    }

    setProcessingTodoIds(prevIds => [...prevIds, ...idsToDelete]);

    const deletionPromises = completedTodos.map(todo =>
      deleteTodo(todo.id)
        .then(() => ({ id: todo.id, success: true }))
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .catch(_error => {
          return { id: todo.id, success: false };
        }),
    );

    const results = await Promise.all(deletionPromises);

    const failedDeletionExist = results.some(res => !res.success);

    if (failedDeletionExist) {
      showError('Unable to delete a todo');
    }

    const successfullyDeletedIds = results
      .filter(res => res.success)
      .map(res => res.id);

    setTodos(currentTodos =>
      currentTodos.filter(todo => !successfullyDeletedIds.includes(todo.id)),
    );

    setProcessingTodoIds(prevIds =>
      prevIds.filter(id => !idsToDelete.includes(id)),
    );
  };

  const handleToggleTodoStatus = async (todoId: number) => {
    setErrorMessage('');
    const todoToUpdate = todos.find(todo => todo.id === todoId);

    if (!todoToUpdate) {
      showError('Todo not found');

      return;
    }

    setTodos(currentTodos =>
      currentTodos.map(todo =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo,
      ),
    );

    setProcessingTodoIds(prevIds => [...prevIds, todoId]);

    try {
      await updateTodo(todoId, { completed: !todoToUpdate.completed });
    } catch (error) {
      setTodos(currentTodos =>
        currentTodos.map(todo =>
          todo.id === todoId
            ? { ...todo, completed: todoToUpdate.completed }
            : todo,
        ),
      );
      showError('Unable to update a todo');
    } finally {
      setProcessingTodoIds(prevIds => prevIds.filter(id => id !== todoId));
    }
  };

  useEffect(() => {
    setErrorMessage('');
    getTodos()
      .then(setTodos)
      .catch(() => showError('Unable to load todos'));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos: Todo[] = getVisibleTodos(todos, filter);
  const activeTodosCounter = getActiveTodosCounter(todos);
  const hasCompletedTodos = todos.some(todo => todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
          onAddTodo={handleAddTodo}
          isAdding={isAdding}
          inputRef={inputRef}
        />

        <TodoList
          todos={visibleTodos}
          onDeleteTodo={handleDeleteTodo}
          onToggleTodoStatus={handleToggleTodoStatus}
          processingTodoIds={processingTodoIds}
          tempTodo={tempTodo}
        />

        {todos.length > 0 && (
          <Footer
            setFilter={setFilter}
            filter={filter}
            activeTodosCounter={activeTodosCounter}
            deleteCompletedTodos={handleClearCompletedTodos}
            hasCompletedTodos={hasCompletedTodos}
          />
        )}
      </div>

      <ErrorNotification errorMessage={errorMessage} onHide={handleHideError} />
    </div>
  );
};
