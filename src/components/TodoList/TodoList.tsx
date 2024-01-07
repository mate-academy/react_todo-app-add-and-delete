import { FC } from 'react';
import { TodoItem } from '../TodoItem/TodoItem';
import { Todo as TodoType } from '../../types/Todo';

interface Props {
  todos: TodoType[];
  deleteTodo: (id: number) => void;
  tempTodo: TodoType | null;
  loadingTodosIds: number[];
}

export const TodoList: FC<Props> = ({
  todos,
  deleteTodo,
  tempTodo,
  loadingTodosIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        return (
          <TodoItem
            todo={todo}
            deleteTodo={deleteTodo}
            Loader={loadingTodosIds.includes(todo.id)}
          />
        );
      })}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          deleteTodo={deleteTodo}
          Loader
        />
      )}
    </section>
  );
};
