import { FC } from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from './TodoInfo';

type Props = {
  todos: Todo[];
  deleteTodo: (todoId: number) => Promise<void>;
  isAdding: boolean;
  tempTodo: Todo;
  deleteCompleted: boolean;
};

export const TodoList: FC<Props> = ({
  todos,
  deleteTodo,
  isAdding,
  tempTodo,
  deleteCompleted,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoInfo
        key={todo.id}
        todo={todo}
        deleteTodo={deleteTodo}
        deleteCompleted={deleteCompleted}
      />
    ))}
    {isAdding && (
      <TodoInfo todo={tempTodo} isAdding={isAdding} />
    )}
  </section>
);
