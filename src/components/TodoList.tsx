/* eslint-disable jsx-a11y/label-has-associated-control */
import { FC } from 'react';

import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  todoToDelete: number[];
  handleDeleteTodo: (todoId: number) => void;
};

export const TodoList: FC<Props> = ({
  todos,
  todoToDelete,
  handleDeleteTodo,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        todoToDelete={todoToDelete}
        handleDeleteTodo={handleDeleteTodo}
      />
    ))}
  </section>
);
