import { FC } from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  visibleTodos: Todo[],
  handleRemove: (todoId: number) => Promise<unknown>,
  handleChangeCheckBox: (todoId: number) => void,
}

export const TodoList: FC<Props> = ({
  visibleTodos,
  handleRemove,
  handleChangeCheckBox,
}) => {
  return (
    <section className="todoapp__main">
      {visibleTodos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          handleRemove={handleRemove}
          handleChangeCheckBox={handleChangeCheckBox}
        />
      ))}
    </section>
  );
};
