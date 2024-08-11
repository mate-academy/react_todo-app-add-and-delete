import { FC } from 'react';
import { TodoItem } from '../TodoItem/TodoItem';
import { useTodoContext } from '../../context/TodoContext';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { TempTodo } from '../TodoTemp/TodoTemp';

export const TodoList: FC = () => {
  const { filteredTodos, todoTemp } = useTodoContext();

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {filteredTodos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem todo={todo} />
          </CSSTransition>
        ))}
        {todoTemp && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TempTodo value={todoTemp} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
