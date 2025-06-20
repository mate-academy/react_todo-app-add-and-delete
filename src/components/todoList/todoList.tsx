import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../todoInfo/todoInfo';

interface TodoListProps {
  todos: Todo[];
  tempTodo?: Todo | null;
  deletedTodos?: number[];
  onDelete: (todoId: number) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  tempTodo,
  deletedTodos,
  onDelete,
}) => {
  const allTodos = tempTodo ? [...todos, tempTodo] : todos;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {allTodos.map(todo => (
        <TodoInfo
          key={todo.id}
          data-cy="Todo"
          todo={todo}
          deletedTodos={deletedTodos}
          onDelete={onDelete}
        />
      ))}
    </section>
  );
};
