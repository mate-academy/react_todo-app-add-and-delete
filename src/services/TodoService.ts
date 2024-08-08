import { useEffect } from 'react';
import { addTodos, delateTodos, patchTodos } from '../api/todos';
import { useTodoContext } from '../utils/hooks/useTodoContext';
import { ErrorMessages } from '../types/ErrorMessages/ErrorMessages';
import { Todo } from '../types/Todo/Todo';

export const TodoService = () => {
  const {
    todos,
    setTodos,
    setErrorMessage,
    showError,
    setLoading,
    setFocusInput,
    inputRef,
    focusInput,
  } = useTodoContext();

  useEffect(() => {
    inputRef.current?.focus();
  }, [focusInput, inputRef]);

  const editTodo = async (id: number, data: Partial<Todo>) => {
    try {
      const editTodoItem = await patchTodos(id, data);

      setTodos(currToto =>
        currToto.map(todo => {
          if (todo.id === id) {
            return editTodoItem;
          }

          return todo;
        }),
      );
    } catch {
      showError(ErrorMessages.Edit);
    }
  };

  const createTodo = async ({ userId, completed, title }: Todo) => {
    try {
      const newTodo = await addTodos({ userId, completed, title });

      setTodos(curenTodos => [...curenTodos, newTodo]);
    } catch (error) {
      showError(ErrorMessages.Add);
      throw error;
    } finally {
    }
  };

  const deleteTodo = async (todosId: number[]) => {
    try {
      setFocusInput(false);
      setErrorMessage('');
      setLoading(todosId);

      for (const id of todosId) {
        await delateTodos(id);
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
      }
    } catch (error) {
      showError(ErrorMessages.Delete);
      setFocusInput(true);
      throw error;
    } finally {
      setFocusInput(true);
      setLoading(null);
    }
  };

  const clearCompletedTodos = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    try {
      setErrorMessage('');
      setLoading(completedTodos.map(todo => todo.id));

      const deletionResults = await Promise.allSettled(
        completedTodos.map(async todo => {
          try {
            await deleteTodo([todo.id]);

            return todo.id;
          } catch {
            showError(ErrorMessages.Delete);

            return null;
          }
        }),
      );

      const successfulDeletions = deletionResults
        .filter(
          (result): result is PromiseFulfilledResult<number> =>
            result.status === 'fulfilled' && result.value !== null,
        )
        .map(result => result.value);

      setTodos(currentTodos =>
        currentTodos.filter(todo => !successfulDeletions.includes(todo.id)),
      );
    } catch (error) {
      showError(ErrorMessages.ClearCompleted);
      throw error;
    } finally {
      setLoading(null);
    }
  };

  const toggleAllCompleted = async () => {
    const allCompleted = todos.every(todo => todo.completed);
    const toggleState = !allCompleted;

    const todosToToggle = todos.filter(todo => todo.completed !== toggleState);
    const todosToToggleIds = todosToToggle.map(todo => todo.id);

    if (todosToToggleIds.length === 0) {
      return;
    }

    try {
      setLoading(todosToToggleIds);

      const updateTodos = todosToToggle.map(async todo => {
        await editTodo(todo.id, { completed: toggleState });
      });

      await Promise.all(updateTodos);

      setTodos(currentTodos =>
        currentTodos.map(todo =>
          todosToToggleIds.includes(todo.id)
            ? { ...todo, completed: toggleState }
            : todo,
        ),
      );
    } catch (error) {
      showError(ErrorMessages.Edit);
      throw error;
    } finally {
      setLoading(null);
    }
  };

  return {
    createTodo,
    deleteTodo,
    editTodo,
    clearCompletedTodos,
    toggleAllCompleted,
  };
};
