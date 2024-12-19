/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { TodoItem } from '../components/TodoItem';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  tempoTodo: Todo | null;
  deletedTodo: number | null;
  isDeleteCompleted: boolean;
  onDelete: (todoId: number) => void;
};
export const TodoList: React.FC<Props> = props => {
  const { todos, tempoTodo, deletedTodo, isDeleteCompleted, onDelete } = props;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          deletedTodo={deletedTodo}
          isDeleteCompleted={isDeleteCompleted}
          isTempoTodo={false}
          onDelete={onDelete}
        />
      ))}
      {tempoTodo && (
        <TodoItem todo={tempoTodo} isTempoTodo={true} onDelete={onDelete} />
      )}
    </section>
  );
};
