/* eslint-disable react/jsx-no-undef */
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import '../../styles/todolist.scss';
type Props = {
  filteredTodos: Todo[];
  onDeleteTodo: (todoId: number) => void;
  loadingTodos: number[];
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = props => {
  const { filteredTodos, onDeleteTodo, loadingTodos, tempTodo } = props;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {filteredTodos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              todo={todo}
              onDeleteTodo={onDeleteTodo}
              isLoading={loadingTodos.includes(todo.id)}
            />
          </CSSTransition>
        ))}
        {tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TodoItem todo={tempTodo} onDeleteTodo={() => {}} isLoading />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
