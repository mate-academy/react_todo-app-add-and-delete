import { FC } from 'react';
import classNames from 'classnames';
import TodoInfo from '../TodoInfo/TodoInfo';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  addTodo: Todo | null,
  isAdd: boolean,
  deleteTodosId: number[] | null,
  onDelete: (idTodo: number) => void,
};

const TodoList: FC<Props> = ({
  todos,
  addTodo,
  isAdd,
  deleteTodosId,
  onDelete,
}) => (
  <section className="todoapp__main">
    {todos.map(todo => (
      <div
        className={classNames(
          'todo',
          { completed: todo.completed },
        )}
        key={todo.id}
      >
        <TodoInfo
          todo={todo}
          onDelete={onDelete}
          deleteTodosId={deleteTodosId}
        />
      </div>
    ))}

    {addTodo && (
      <div
        className={classNames(
          'todo',
          { completed: addTodo.completed },
        )}
        key={addTodo.id}
      >
        <TodoInfo
          todo={addTodo}
          isAdd={isAdd}
        />
      </div>
    )}
  </section>
);

export default TodoList;
