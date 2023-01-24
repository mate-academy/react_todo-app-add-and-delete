import { useContext } from 'react';
import { ITodo } from '../../types/ITodo';
import { AppContext } from '../AppProvider/AppProvider';
import { Todo } from '../Todo';

type Props = {
  todos: ITodo[]
};

export const TodoList: React.FC<Props> = ({ todos }) => {
  const { tempTodo } = useContext(AppContext);

  return (
    <>
      {todos.map(todo => (
        <Todo key={todo.id} todo={todo} />
      ))}

      {tempTodo && <Todo key={0} todo={tempTodo} />}
    </>
  );
};
