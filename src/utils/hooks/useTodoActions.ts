import { addTodos, delateTodos, patchTodos } from '../../api/todos';
import { useTodoContext } from './useTodoContext';
import { ErrorMessages } from '../../types/ErrorMessages/ErrorMessages';
import { Todo } from '../../types/Todo/Todo';

export const useTodoActions = () => {
  const {
    todos,
    setTodos,
    setErrorMessage,
    showError,
    setLoadingTodoIds,
    setLockedFocus,
  } = useTodoContext();

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
    } catch (error) {
      showError(ErrorMessages.Edit);
      throw error;
    }
  };

  const createTodo = async ({ userId, completed, title }: Todo) => {
    try {
      const newTodo = await addTodos({ userId, completed, title });

      setTodos(curenTodos => [...curenTodos, newTodo]);
    } catch (error) {
      showError(ErrorMessages.Add);
      throw error;
    }
  };

  const deleteTodo = async (todosId: number[]) => {
    setLockedFocus(false);
    try {
      setErrorMessage('');
      setLoadingTodoIds(todosId);

      for (const id of todosId) {
        await delateTodos(id);
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
      }

      setLockedFocus(true);
    } catch (error) {
      showError(ErrorMessages.Delete);
      setLockedFocus(true);
      throw error;
    } finally {
      setLoadingTodoIds(null);
    }
  };

  const clearCompletedTodos = async () => {
    let updatedTodos = [...todos];

    const results = await Promise.allSettled(
      todos
        .filter(todo => todo.completed)
        .map(async todo => {
          try {
            await deleteTodo([todo.id]);

            return { id: todo.id, success: true };
          } catch {
            showError(ErrorMessages.Delete);

            return { id: todo.id, success: false };
          }
        }),
    );

    updatedTodos = updatedTodos.filter(todo => {
      const result = results.find(
        r => r.status === 'fulfilled' && r.value && r.value.id === todo.id,
      );

      return (
        !result || (result.status === 'fulfilled' && !result.value.success)
      );
    });

    setTodos(updatedTodos);
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
      setLoadingTodoIds(todosToToggleIds);

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
    } finally {
      setLoadingTodoIds(null);
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
