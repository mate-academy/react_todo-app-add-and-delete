import { useContext } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import { TodosContext } from '../../TodosContext';

type Props = {
  todos: Todo[],
  isDeleting: boolean,
};

export const TodosList: React.FC<Props> = ({
  todos,
  isDeleting,
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
            <TodoItem
              todo={todo}
              isProcessed={todo.completed && isDeleting}
            />
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
