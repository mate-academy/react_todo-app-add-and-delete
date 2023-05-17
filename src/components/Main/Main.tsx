import { useContext } from 'react';
import { TodoInfo } from '../Todo/TodoInfo';
import { TodoList } from '../TodoList';
import { TodosContext } from '../../contexts/TodosContext';

export const Main:React.FC = () => {
  const { tempTodo } = useContext(TodosContext);

  return (
    <section className="todoapp__main">
      <TodoList />
      {tempTodo && (<TodoInfo todo={tempTodo} isWaitingResponse />)}
    </section>
  );
};
