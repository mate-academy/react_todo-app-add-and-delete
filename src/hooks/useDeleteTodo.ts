import { useState } from 'react';
import { Todo } from '../types/Todo';
import { deleteTodo } from '../api/todos';

interface UseDeleteTodoProps {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: (msg: string) => void;
  mainInputRef: React.RefObject<HTMLInputElement | null>;
}

export const useDeleteTodo = ({
  todos,
  setTodos,
  setErrorMessage,
  mainInputRef,
}: UseDeleteTodoProps) => {
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);

  const handleDelete = (todoId: number) => {
    setDeletingTodoIds(prevIds => [...prevIds, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      })
      .catch(() => setErrorMessage('Unable to delete a todo'))
      .finally(() => {
        setDeletingTodoIds(prevIds => prevIds.filter(id => id !== todoId));
        setTimeout(() => {
          mainInputRef.current?.focus();
        }, 0);
      });
  };

  const clearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => handleDelete(todo.id));
    setTimeout(() => {
      mainInputRef.current?.focus();
    }, 0);
  };

  return {
    deletingTodoIds,
    handleDelete,
    clearCompleted,
  };
};
