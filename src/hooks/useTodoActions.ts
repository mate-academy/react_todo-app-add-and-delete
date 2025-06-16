import React, { useCallback, useState } from 'react';
import { deleteTodo } from '../api/todos';
import { Todo } from '../types/Todo';
import { ErrorMessages } from '../types/ErrorMessages';

export const useTodoActions = (
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setErrorMessage: React.Dispatch<React.SetStateAction<ErrorMessages | null>>,
) => {
  const [processingTodoIds, setProcessingTodoIds] = useState<Todo['id'][]>([]);

  const addToProcessing = (ids: Todo['id'][]) => {
    setProcessingTodoIds(prev => [...prev, ...ids]);
  };

  const removeFromProcessing = (ids: Todo['id'][]) => {
    setProcessingTodoIds(prev => prev.filter(id => !ids.includes(id)));
  };

  const deleteSingleTodo = useCallback(
    async (todoId: Todo['id']) => {
      addToProcessing([todoId]);

      try {
        await deleteTodo(todoId);
        setTodos(prev => prev.filter(todo => todo.id !== todoId));
      } catch {
        setErrorMessage(ErrorMessages.DeleteFailed);
      } finally {
        removeFromProcessing([todoId]);
      }
    },
    [setTodos, setErrorMessage],
  );

  const deleteCompletedTodos = useCallback(
    async (completedIds: Todo['id'][]) => {
      if (completedIds.length === 0) {
        return;
      }

      addToProcessing(completedIds);

      try {
        const results = await Promise.allSettled(
          completedIds.map(id =>
            deleteTodo(id).then(() => ({ id, success: true })),
          ),
        );

        const successfulIds = results
          .filter(
            (
              res,
            ): res is PromiseFulfilledResult<{ id: number; success: true }> =>
              res.status === 'fulfilled',
          )
          .map(res => res.value.id);

        const isSomeFailed = results.some(res => res.status === 'rejected');

        if (isSomeFailed) {
          setErrorMessage(ErrorMessages.DeleteFailed);
        }

        setTodos(prev => prev.filter(todo => !successfulIds.includes(todo.id)));
      } catch (err) {
        setErrorMessage(ErrorMessages.DeleteFailed);
      } finally {
        removeFromProcessing(completedIds);
      }
    },
    [setTodos, setErrorMessage],
  );

  return {
    processingTodoIds,
    deleteSingleTodo,
    deleteCompletedTodos,
  };
};
