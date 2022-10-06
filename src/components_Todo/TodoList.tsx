import { FormEvent } from 'react';
import { Todo } from '../types/Todo';
import { TodoInfo } from './TodoInfo';

interface Props {
  todos: Todo[] | null;
  statusPatch: string;
  setStatusPatch: (event: string) => void;
  handleDeleteTodo: (event: FormEvent, element: number) => void;
  isAdding: boolean;
}

export const TodoList: React.FC<Props> = ({
  todos,
  statusPatch,
  setStatusPatch,
  handleDeleteTodo,
  isAdding,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos && (todos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          statusPatch={statusPatch}
          setStatusPatch={setStatusPatch}
          handleDeleteTodo={handleDeleteTodo}
          isAdding={isAdding}
        />
      )))}
    </section>

  );
};
