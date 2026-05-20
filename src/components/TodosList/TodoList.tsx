import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { TodoViewModel } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: TodoViewModel[];
  tempTodo: TodoViewModel | null;
  handleDelete: (id: number) => void;
};

export function TodoList({ todos, handleDelete, tempTodo }: Props) {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos?.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem todo={todo} onDelete={handleDelete} />
          </CSSTransition>
        ))}
        {tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TodoItem todo={tempTodo} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
}
