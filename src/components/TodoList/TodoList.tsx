import { memo, FC } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  todos: Todo[];
  completedTodos: number[];
  isClearCompletedTodos: boolean;
  onUpdateCompleted: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
}

export const TodoList: FC<Props> = memo(({
  todos, onUpdateCompleted, onDelete, completedTodos, isClearCompletedTodos,
}) => (
  <section className="todoapp__main">
    {todos.map(todo => (
      <TodoItem
        todo={todo}
        completedTodos={completedTodos}
        isClearCompletedTodos={isClearCompletedTodos}
        onUpdateCompleted={onUpdateCompleted}
        onDelete={onDelete}
        key={todo.id}
      />
    ))}
  </section>
));
