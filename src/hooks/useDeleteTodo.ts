import { useContext, useState } from 'react';

import { TodosContext } from '../context/TodoContext';

export const useDeleteTodo = () => {
  const [isDeleting, setDeliting] = useState(false);
  const { deleteCompletedTodos, onFocus, deleteTodo } =
    useContext(TodosContext);

  const handleDeleteTodo = async (id: number) => {
    setDeliting(true);

    await deleteTodo(id);

    setDeliting(false);
    onFocus();
  };

  const handleDeleteCompletedTodos = async () => {
    await deleteCompletedTodos();

    onFocus();
  };

  return { handleDeleteTodo, isDeleting, handleDeleteCompletedTodos };
};
