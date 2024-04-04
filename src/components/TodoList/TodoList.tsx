import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import { USER_ID } from '../../api/todos';

type Props = {
  todos: Todo[];
  creating: boolean;
  processings: number[];
  todoTitle: string;
  onDelete: (todoId: number) => Promise<void>;
  onUpdate: (todo: Todo) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  creating,
  processings,
  todoTitle,
  onDelete,
  onUpdate,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos?.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              todo={todo}
              onDelete={onDelete}
              onUpdate={onUpdate}
              multipleLoading={processings.includes(todo.id)}
            />
          </CSSTransition>
        ))}

        {creating && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TodoItem
              todo={{
                id: Math.random(),
                title: todoTitle,
                completed: false,
                userId: USER_ID,
              }}
              multipleLoading
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
