import React from 'react';
import { TempTodo } from './TempTodo';
import { Todo } from '../types/Todo';
import { TodoInfo } from './TodoInfo';

type Props = {
  visibleTodos: Todo[];
  deleteTodo: (id: number) => void;
  isAdded: boolean;
  newTitile: string;
};

export const TodoList: React.FC<Props> = ({
  visibleTodos, deleteTodo, isAdded, newTitile,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {visibleTodos.map(todo => (
      <TodoInfo
        todo={todo}
        deleteTodo={deleteTodo}
        key={todo.id}
      />
    ))}

    {isAdded
      && <TempTodo title={newTitile} />}
  </section>

);
