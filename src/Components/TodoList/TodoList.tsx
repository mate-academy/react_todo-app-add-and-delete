import { Todo as TodoType } from '../../types/Todo';
import { Todo } from '../Todo/Todo';

type Props = {
  todos: TodoType[];
  handleTodoDeletion?: (status: boolean, id?: number) => void;
  activeTodos: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  handleTodoDeletion,
  activeTodos,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(({ id, title, completed }) => (
        <Todo
          key={id}
          title={title}
          completed={completed}
          todoId={id}
          handleTodoDeletion={handleTodoDeletion}
          activeTodos={activeTodos}
        />
      ))}
    </section>
  );
};
