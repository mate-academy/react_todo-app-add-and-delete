import React, { useContext } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { TodoContext } from '../../context';
import { TodoItem } from '../TodoItem/TodoItem';
import { Todo } from '../../types/Todo';
import { TempTodo } from '../TempTodo';

type Props = {
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({ tempTodo }) => {
  const { filteredTodos } = useContext(TodoContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <ul className="todoList">
        <TransitionGroup>
          {filteredTodos.map(todo => (
            <CSSTransition key={todo.id} timeout={300} classNames="item">
              <TodoItem todo={todo} />
            </CSSTransition>
          ))}

          {tempTodo && (
            <CSSTransition key={0} timeout={500} classNames="temp-item">
              <TempTodo />
            </CSSTransition>
          )}
        </TransitionGroup>
      </ul>
    </section>
  );
};
