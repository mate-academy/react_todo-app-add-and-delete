/* eslint-disable jsx-a11y/label-has-associated-control */
import { FC, Dispatch, SetStateAction } from 'react';
import { Todo } from '../../types/Todo';

import { TodoInfo } from '../TodoInfo';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  setIdsForDelete: Dispatch<SetStateAction<number[]>>;
  idsForDelete: number[];
}

export const ToodoList: FC<Props> = ({
  todos,
  tempTodo,
  setIdsForDelete,
  idsForDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        return (
          <TodoInfo
            todo={todo}
            key={todo.id}
            setIdsForDelete={setIdsForDelete}
            idsForDelete={idsForDelete}
          />
        );
      })}
      {tempTodo && (
        <TodoInfo todo={tempTodo} setIdsForDelete={setIdsForDelete} />
      )}
    </section>
  );
};
