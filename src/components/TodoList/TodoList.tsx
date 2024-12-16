/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  handleDeleteTodo: (id: number, callback: CallableFunction) => void;
  deletingCompleteTodos: boolean;
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  handleDeleteTodo,
  deletingCompleteTodos,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            handleDeleteTodo={handleDeleteTodo}
            deleting={deletingCompleteTodos && todo.completed}
          />
        );
      })}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          handleDeleteTodo={handleDeleteTodo}
          deleting={true}
        />
      )}
    </section>
  );
};
