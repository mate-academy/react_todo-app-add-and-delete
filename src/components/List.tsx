/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC } from 'react';
import { Todo as TodoType } from '../types/Todo';
import { Todo } from './Todo';
import { TempTodo } from './TempTodo';

interface Props {
  onDelete: (id: number) => Promise<void>;
  onEdit: (id: number, data: Partial<TodoType>) => Promise<void>;
  todos: TodoType[];
  tempTodoTitle: string | null;
  idsProccesing: number[];
}

export const List: FC<Props> = ({
  todos,
  tempTodoTitle,
  onDelete,
  onEdit,
  idsProccesing,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <Todo
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          onEdit={onEdit}
          idsProccesing={idsProccesing}
        />
      ))}

      {tempTodoTitle && <TempTodo title={tempTodoTitle} />}
    </section>
  );
};
