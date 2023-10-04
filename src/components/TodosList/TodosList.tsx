import { useContext } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import { TodosContext } from '../../TodosContext';

type Props = {
  todos: Todo[],
};

export const TodosList: React.FC<Props> = ({
  todos,
}) => {
  const { tempTodo } = useContext(TodosContext);

  const isProcessed = tempTodo !== null;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map((todo: Todo) => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem todo={todo} />
          </CSSTransition>
        ))}

        {tempTodo !== null && (
          <CSSTransition
            key={tempTodo.id}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem
              todo={tempTodo}
              isProcessed={isProcessed}
            />
          </CSSTransition>
        )}

      </TransitionGroup>

    </section>
  );
};
