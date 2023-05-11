import { TransitionGroup, CSSTransition } from 'react-transition-group';

import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  filteringList: Todo[] | null
  tempTodo: Todo | null;
  loadingTodoIds: number[] ;
  deleteClickHandler: (
    id: number,
    loaderState: (loaderTodo: boolean) => void
  ) => void;
};

export const TodoList: React.FC<Props> = ({
  filteringList,
  tempTodo,
  loadingTodoIds,
  deleteClickHandler,
}) => {
  return (
    <section className="todoapp__main">
      <TransitionGroup>
        {filteringList?.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="todo"
          >
            <TodoItem
              todo={todo}
              loadingTodoIds={loadingTodoIds}
              deleteClickHandler={deleteClickHandler}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            timeout={300}
            classNames="todo-temp"
          >
            <TodoItem
              todo={tempTodo}
              loadingTodoIds={loadingTodoIds}
              deleteClickHandler={deleteClickHandler}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
