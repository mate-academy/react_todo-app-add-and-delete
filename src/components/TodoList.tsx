import { Todo } from '../types/Todo';
import { TempTodo } from './TempTodo';
import { TodoInfo } from './TodoInfo';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  deleteTodo: (userId: number) => void;
  loading: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  deleteTodo,
  tempTodo,
  loading,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoInfo todo={todo} deleteTodo={deleteTodo} loading={loading} />
          </CSSTransition>
        ))}
        {tempTodo && (
          <CSSTransition key="temp" timeout={300} classNames="temp-item">
            <TempTodo tempTitle={tempTodo.title} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
