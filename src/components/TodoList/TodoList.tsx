import { FC } from 'react';
import { Todo as TodoType } from '../../types/Todo';
import { Todo } from '../Todo/Todo';

type Props = {
  todos: TodoType[];
  deleteTodo: (id: number) => void,
  tempTodo: TodoType | null,
  loadingTodosIds: number[];
};

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
          <Todo
            todo={todo}
            deleteTodo={deleteTodo}
            Loader={loadingTodosIds.includes(todo.id)}
          />
        );
      })}
      {tempTodo && (
        <Todo
          todo={tempTodo}
          deleteTodo={deleteTodo}
          Loader
        />
      )}
    </section>
  );
};
