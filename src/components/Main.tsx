import { TransitionGroup, CSSTransition } from 'react-transition-group';

import { Todo } from '../types/Todo';
import { Errors } from '../types/Errors';
import { TodoItem } from './TodoItem';

type Props = {
  filteringList: Todo[] | null
  setTypeError: (typeError: Errors) => void
  setNotificationError: (notificationError: boolean) => void
  tempTodo: Todo | null;
  todoList: Todo[];
  setTodoList: (todoList: Todo[] | null) => void;
  loadersTodosId: number[] | null;
};

export const Main: React.FC<Props> = ({
  filteringList,
  setTypeError,
  setNotificationError,
  tempTodo,
  todoList,
  setTodoList,
  loadersTodosId,
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
              setTypeError={setTypeError}
              setNotificationError={setNotificationError}
              todoList={todoList}
              setTodoList={setTodoList}
              loadersTodosId={loadersTodosId}
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
              setTypeError={setTypeError}
              setNotificationError={setNotificationError}
              todoList={todoList}
              setTodoList={setTodoList}
              loadersTodosId={loadersTodosId}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
