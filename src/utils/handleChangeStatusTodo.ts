import { editTodo } from '../api/todos';

export const handleChangeStatusTodo = (status: boolean, todoId: number) => {
  editTodo(todoId, {
    completed: !status,
  });
};
