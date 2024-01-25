import { useContext } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoField } from '../TodoField';
import { TodoItem } from '../TodoItem/TodoItem';
import { StateContext } from '../../State/State';

type Props = {
  todos: Todo[];
};

export const TodoList: React.FC<Props> = ({ todos }) => {
  const { tempTodo } = useContext(StateContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoField todo={todo} key={todo.id} />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem todo={tempTodo} />
          </CSSTransition>
        )}
      </TransitionGroup>

    </section>
  );
};
