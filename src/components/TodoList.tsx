/* eslint-disable jsx-a11y/label-has-associated-control */
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Todo as TodoType } from '../types/Todo';
import { TodoListItem } from './TodoListItem';

type Props = {
  filteredTodos: TodoType[];
  onDelete: (id: number) => void;
  isLoading: boolean;
  tempTodo: TodoType | null;
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  onDelete,
  isLoading,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {filteredTodos.map(({ id, title, completed }) => (
          <CSSTransition key={id} timeout={300} classNames="item">
            <TodoListItem
              id={id}
              title={title}
              completed={completed}
              onDelete={onDelete}
              isLoading={isLoading}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition key={tempTodo.id} timeout={300} classNames="item">
            <TodoListItem
              id={tempTodo.id}
              title={tempTodo.title}
              completed={tempTodo.completed}
              onDelete={onDelete}
              isLoading={true}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
