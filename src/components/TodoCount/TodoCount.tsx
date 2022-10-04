import { Todo } from '../../types/Todo';

type Props = {
  activeTodo: Todo[]
};

export const TodoCount: React.FC<Props> = ({ activeTodo }) => {
  return (
    <span className="todo-count" data-cy="todosCounter">
      {`${activeTodo.length} items left`}
    </span>
  );
};
