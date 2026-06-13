/* eslint-disable */

import { TodoItem } from '../TodoItem'
import type { Todo } from '../../types/Todo';

type Props = {
  todos : (Todo[]);
  onDelete : ( id: number) => void;
  deletingIds : number[]
}

export const TodoList: React.FC<Props> = ({ todos, onDelete, deletingIds }) => (
  <>
    {todos.map(todo=> (
      <TodoItem
        key={todo.id}
        todo={todo}
        onDelete={onDelete}
        isLoading={deletingIds.includes(todo.id)}
      />
    ))}
  </>
);
