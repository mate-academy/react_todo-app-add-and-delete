import React from 'react';

import { Todo } from '../../types/Todo';
import { TempTodo } from '../TempTodo';

import { TodoInfo } from '../TodoInfo';

interface Props {
  todos: Todo[];
  isAdding: boolean;
  todoTitle: string;
  onDeleteTodo: (todoId: number) => void;
  deletedTodoIds: number[];
}

export const TodosList: React.FC<Props> = ({
  todos,
  isAdding,
  todoTitle,
  onDeleteTodo,
  deletedTodoIds,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoInfo
        key={todo.id}
        todo={todo}
        onDeleteTodo={onDeleteTodo}
        deletedTodoIds={deletedTodoIds}
      />
    ))}

    {isAdding && <TempTodo todoTitle={todoTitle} />}
  </section>
);
