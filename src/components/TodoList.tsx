import React from 'react';
import { Todo as TodoType } from '../types/Todo';
import { Todo } from './Todo';

type Props = {
  todos: TodoType[];
  tempTodo: TodoType | null;
  onDelete: (todoId: number) => void;
  processingTodoIds: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDelete,
  processingTodoIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <Todo
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          isLoading={processingTodoIds.includes(todo.id)}
        />
      ))}

      {tempTodo && <Todo todo={tempTodo} isLoading />}
    </section>
  );
};
