import React, { createContext, useState, useEffect, useMemo } from 'react';
import { Todo, TodoContextType } from '../types/Todo';
import { deleteTodo, getTodos, postCreateTodo } from '../api/todos';
import { FILTERS } from '../filters/filter';

export const TodoContext = createContext<TodoContextType | null>(null);
const USER_ID = 4095;

type Props = {
  children: React.ReactNode;
};

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [todo, setTodo] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<string>(FILTERS.all);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingTodoIds, setProcessingTodoIds] = useState<number[]>([]);
  const [isCreatingTodo, setIsCreatingTodo] = useState(false);

  useEffect(() => {
    setErrorMessage('');
    getTodos()
      .then(setTodo)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    if (errorMessage) {
      const timerId = setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return () => clearTimeout(timerId);
    }
  }, [errorMessage]);

  const handleSelected: TodoContextType['handleSelected'] = () => {};

  const handleCreateTodo = async (title: string) => {
    const trimmedTitle = title.trim();
    const newTempTodo: Todo = {
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    };

    setErrorMessage('');
    setIsCreatingTodo(true);
    setTempTodo(newTempTodo);

    try {
      const createdTodo = await postCreateTodo(newTempTodo);

      setTodo(currentTodos => [...currentTodos, createdTodo]);
      setTempTodo(null);

      return true;
    } catch {
      setErrorMessage('Unable to add a todo');
      setTempTodo(null);

      return false;
    } finally {
      setIsCreatingTodo(false);
    }
  };

  const handleRemove = async (id: number) => {
    setErrorMessage('');
    setProcessingTodoIds(currentIds => [...currentIds, id]);

    try {
      await deleteTodo(id);
      setTodo(currentTodos =>
        currentTodos.filter(currentTodo => currentTodo.id !== id),
      );
    } catch {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setProcessingTodoIds(currentIds =>
        currentIds.filter(currentId => currentId !== id),
      );
    }
  };

  const handleFilterAll = () => {
    setFilter(FILTERS.all);
  };

  const handleActive = () => {
    setFilter(FILTERS.active);
  };

  const handleCompleted = () => {
    setFilter(FILTERS.completed);
  };

  const handleRemoveCompleted = async () => {
    const completedTodoIds = todo
      .filter(currentTodo => currentTodo.completed)
      .map(currentTodo => currentTodo.id);

    if (completedTodoIds.length === 0) {
      return;
    }

    setErrorMessage('');
    setProcessingTodoIds(currentIds => [
      ...currentIds,
      ...completedTodoIds.filter(id => !currentIds.includes(id)),
    ]);

    const results = await Promise.allSettled(
      completedTodoIds.map(id => deleteTodo(id)),
    );

    const failedToDelete = results.some(result => result.status === 'rejected');

    setTodo(currentTodos =>
      currentTodos.filter((currentTodo, index) => {
        const result = results[index];

        return result?.status === 'rejected' || !currentTodo.completed;
      }),
    );

    setProcessingTodoIds(currentIds =>
      currentIds.filter(id => !completedTodoIds.includes(id)),
    );

    if (failedToDelete) {
      setErrorMessage('Unable to delete a todo');
    }
  };

  const filteredTodo = useMemo(() => {
    switch (filter) {
      case FILTERS.active:
        return todo.filter(t => !t.completed);
      case FILTERS.completed:
        return todo.filter(t => t.completed);
      default:
        return todo;
    }
  }, [todo, filter]);

  const contextValue: TodoContextType = {
    todo,
    tempTodo,
    processingTodoIds,
    isCreatingTodo,
    handleSelected,
    handleRemove,
    handleFilterAll,
    handleActive,
    handleCompleted,
    filteredTodo,
    filter,
    handleCreateTodo,
    handleRemoveCompleted,
    setTodo,
    errorMessage,
    setErrorMessage,
  };

  return (
    <TodoContext.Provider value={contextValue}>{children}</TodoContext.Provider>
  );
};
