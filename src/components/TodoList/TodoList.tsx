import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';

type Props = {
  todos: (Todo[]),
  onDelete: (todoId: number) => void,
  onChangeCompleted: (todoId: number) => void,
  tempTodo: Todo | null,
  deletedTodoId: number[],
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  onChangeCompleted,
  tempTodo,
  deletedTodoId,
}) => (
  <section className="todoapp__main">
    {todos.map(todo => (
      <TodoInfo
        key={todo.id}
        todo={todo}
        onDelete={onDelete}
        deletedTodoId={deletedTodoId}
        onChangeCompleted={onChangeCompleted}
      />
    ))}

    {tempTodo && (
      <TodoInfo
        todo={tempTodo}
        onChangeCompleted={onChangeCompleted}
        onDelete={onDelete}
        deletedTodoId={deletedTodoId}
      />
    )}
  </section>
);
