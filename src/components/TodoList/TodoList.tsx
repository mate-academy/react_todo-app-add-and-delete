import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoTask } from '../TodoTask/TodoTask';
import { DeletingTodo } from '../../types/DeletingTodo';

type Props = {
  todos: Todo[]
  onDelete: (todoId: number) => void,
  deletingTodos: DeletingTodo[],
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  deletingTodos,
}) => {
  return (
    <>
      {todos?.map(todo => (
        <TodoTask
          onDelete={onDelete}
          todo={todo}
          deletingTodos={deletingTodos}
          key={todo.id}
        />
      ))}
    </>
  );
};
