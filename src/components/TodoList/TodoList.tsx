/* eslint-disable no-console */
import { useContext } from 'react';
// eslint-disable-next-line import/no-cycle
import { TodoItem } from '../TodoItem/TodoItem';
// eslint-disable-next-line import/no-cycle
import {
  TodosContext,
} from '../../TodosContext/TodosContext';
import { Status } from '../../types/Status';
import { filterByStatus } from '../../services/filterByStatus';

type Props = {
  status: Status,
};

export const TodoList: React.FC<Props> = ({ status }) => {
  const { todos } = useContext(TodosContext);
  const todosWithStatus = filterByStatus(todos, status);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* This is a completed todo */}
      {todosWithStatus.map((todo) => (<TodoItem todo={todo} key={todo.id} />))}
    </section>
  );
};
