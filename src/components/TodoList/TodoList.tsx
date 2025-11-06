import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import cn from 'classnames';

interface Props {
  todos: Todo[];
  loading: boolean;
  selected: number | null;
  handleDoubleClick: (todo: Todo) => void;
  isSubmitting: boolean;
  selectedTitle: string;
  setSelectedTitle: (title: string) => void;
  deleteTodoHandler: (id: number) => void;
  deletingTodosId: number[];
}

export const TodoList = ({
  todos,
  loading,
  selected,
  handleDoubleClick,
  isSubmitting,
  selectedTitle,
  setSelectedTitle,
  deleteTodoHandler,
  deletingTodosId,
}: Props) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': loading })}
      >
        {/* eslint-disable-next-line max-len */}
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>

      {todos.map(todo => {
        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            selected={selected}
            handleDoubleClick={handleDoubleClick}
            selectedTitle={selectedTitle}
            setSelectedTitle={setSelectedTitle}
            isSubmitting={isSubmitting}
            deleteTodoHandler={deleteTodoHandler}
            deletingTodosId={deletingTodosId}
          ></TodoItem>
        );
      })}
    </section>
  );
};
