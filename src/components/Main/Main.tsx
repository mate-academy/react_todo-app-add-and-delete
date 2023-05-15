import { Todo } from '../../types/Todo';
import { TodoInfo } from '../Todo/TodoInfo';
import { TodoList } from '../TodoList';

interface Props {
  tempTodo: Todo | null;
}

export const Main:React.FC<Props> = ({ tempTodo }) => {
  return (
    <section className="todoapp__main">
      <TodoList />
      {tempTodo && (<TodoInfo todo={tempTodo} isWaitingResponse />)}
    </section>
  );
};
