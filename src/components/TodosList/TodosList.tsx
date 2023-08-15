import { useContext } from 'react';
import { TodosContext } from '../../TodosContext';
import { Todo } from '../../types/Todo';
import { TodosItem } from '../TodosItem/TodosItem';

type Props = {
  todos: Todo[];
};

export const TodosList: React.FC<Props> = ({ todos }) => {
  const { tempTodo } = useContext(TodosContext);

  return (
    <ul className="todoapp__main">
      {todos.map(todo => <TodosItem todo={todo} key={todo.id} />)}
      {tempTodo && (
        <li className="todo">
          <label className="todo__status-label">
            <input type="checkbox" className="todo__status" />
          </label>

          <span className="todo__title">{tempTodo.title}</span>
          <button type="button" className="todo__remove">×</button>

          <div className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </li>
      )}
    </ul>
  );
};
