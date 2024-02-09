/* eslint-disable react/jsx-no-undef */
import { useContext } from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { TodoContext } from '../contexts/TodoContext';
import { TodoItem } from './TodoItem';

export const TodoList: React.FC = () => {
  const {
    filteredTodos,
    tempTodo,
  } = useContext(TodoContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        <ul className="todolist">
          {filteredTodos.map(todo => (
            <CSSTransition
              key={todo.id}
              timeout={300}
              classNames="item"
            >
              <TodoItem todo={todo} />
            </CSSTransition>
          ))}

          {!!tempTodo && (
            <CSSTransition
              key={0}
              timeout={300}
              classNames="temp-item"
            >
              <TodoItem todo={tempTodo} isTempTodo />
            </CSSTransition>
          )}
        </ul>
      </TransitionGroup>
    </section>
  );
};
