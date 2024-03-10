import { useContext } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { TodoItem } from '../TodoItem';
import { TodoContext } from '../../context/TodoContext';
import { filterByTodoStatus } from '../../utils/filterTodoByStatus';

export const TodoList: React.FC = () => {
  const { todos, tempTodo, filterStatus } = useContext(TodoContext);

  const visibleGoods = filterByTodoStatus(todos, filterStatus);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {visibleGoods.map((todo) => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem todo={todo} key={todo.id} />
          </CSSTransition>
        ))}

        {tempTodo !== null && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TodoItem todo={tempTodo} key={tempTodo.id} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
