import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';

type Props = {
  todos: Todo[];
  tempTodo: Todo;
  isAdding: boolean;
  onDelete: (todoId:number) => void;
  todosToDelete: number[];
};

export const TodosList: React.FC<Props> = ({
  todos,
  tempTodo,
  isAdding,
  onDelete,
  todosToDelete,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoInfo
        key={todo.id}
        todo={todo}
        isAdding={todosToDelete.includes(todo.id)}
        onDelete={onDelete}
      />
    ))}
    {(isAdding && (
      <TodoInfo
        todo={tempTodo}
        isAdding={isAdding}
        onDelete={onDelete}
      />
    ))}
  </section>
);
