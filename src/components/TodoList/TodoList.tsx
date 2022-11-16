import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { TodoWithLoader } from '../TodoWithLoader';

type Props = {
  todos: Todo[];
  todoTitle: string;
  onDeleteTodo: (event: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
  isLoading: boolean;
  isAdding: boolean;
  deletedTodoIds: number[];
  deleteTodoId: number;
};

export const TodoList: React.FC<Props> = ({
  todos,
  todoTitle,
  onDeleteTodo,
  isLoading,
  isAdding,
  deletedTodoIds,
  deleteTodoId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <ul>
        {todos.map(todo => (
          <TodoItem
            todo={todo}
            key={todo.id}
            onDeleteTodo={onDeleteTodo}
            isLoading={isLoading}
            deletedTodoIds={deletedTodoIds}
            deleteTodoId={deleteTodoId}
          />
        ))}

        {isAdding && <TodoWithLoader todoTitle={todoTitle} />}
      </ul>
    </section>
  );
};
