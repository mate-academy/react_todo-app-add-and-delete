import { useContext } from 'react';
import { Todo } from '../../types/Todo';
import { AppContext } from '../AppProvider/AppProvider';
import { TodoInfo } from '../TodoInfo';

type Props = {
  todos: Todo[]
};

export const TodoList: React.FC<Props> = ({ todos }) => {
  const { tempTodo } = useContext(AppContext);

  return (
    <>
      {todos.map(todo => (
        <TodoInfo key={todo.id} todo={todo} />
      ))}

      {tempTodo && <TodoInfo key={0} todo={tempTodo} />}
    </>
  );
};
