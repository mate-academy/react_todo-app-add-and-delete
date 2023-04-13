import { Todo } from '../../types/Todo';
import { Todos } from '../Todos/Todos';

type Props = {
  todos: Todo[];
  onDeleteTodo: (id: number) => void;
  temporaryTodo: Todo | undefined;
};

export const ListofTodo: React.FC<Props> = ({
  todos,
  onDeleteTodo,
  temporaryTodo,
}) => (
  <>
    {todos.map((todo) => (
      <Todos todo={todo} key={todo.id} onDelete={onDeleteTodo} />
    ))}
    {temporaryTodo && (
      <Todos todo={temporaryTodo} key={temporaryTodo.id} onDelete={() => {}} />
    )}
  </>
);
