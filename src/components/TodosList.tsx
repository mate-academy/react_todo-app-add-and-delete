/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React from 'react';

import { Todo as TypeTodo } from '../types/Todo';
import { Todo } from './TodoItem';

type Props = {
  todos: TypeTodo[];
  onDelete: (todoid: number) => Promise<void>;
  tempTodo: TypeTodo | null;
  isDetetingIdTodos: number[];
};

const TodosListComponent: React.FC<Props> = ({
  todos,
  onDelete,
  tempTodo,
  isDetetingIdTodos,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        const isDeteting = isDetetingIdTodos.includes(todo.id);

        return (
          <Todo
            todo={todo}
            key={todo.id}
            onDelete={onDelete}
            isDeteting={isDeteting}
          />
        );
      })}

      {tempTodo && <Todo todo={tempTodo} isDeteting={true} />}
    </section>
  );
};

export const TodosList = React.memo(TodosListComponent);
