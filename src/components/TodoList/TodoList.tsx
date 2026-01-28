import React from 'react';
import { Todo } from '../../type/Todo';
import { TodoListItem } from '../TodoListItem/TodoListItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  onDelete: (todoId: number) => void;
  deletingTodoIds: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDelete = () => {},
  deletingTodoIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoListItem
          todo={todo}
          key={todo.id}
          onDelete={onDelete}
          isLoading={deletingTodoIds.includes(todo.id)}
        />
      ))}

      {tempTodo && <TodoListItem todo={tempTodo} isLoading={true} />}
    </section>
  );
};
