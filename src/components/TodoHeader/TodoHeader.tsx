import { Todo } from '../../types/Todo';
import { TodoInput } from './TodoInput';
import { TodoToggleAll } from './TodoToggleAll';

type Props = {
  todos: Todo[];
};

export const TodoHeader: React.FC<Props> = ({ todos }) => {
  return (
    <header className="todoapp__header">
      <TodoToggleAll todos={todos} />

      <TodoInput />
    </header>
  );
};
