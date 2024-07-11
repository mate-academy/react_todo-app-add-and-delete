import { useGlobalState } from '../../GlobalStateProvider';
import { Status } from '../../types/Status';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

type Props = {
  deleteTodosFromServer: (arg: Todo) => void;
};

export const TodoList: React.FC<Props> = ({ deleteTodosFromServer }) => {
  const { todos, status, tempTodo } = useGlobalState();

  const getList = (sortType: Status): Todo[] => {
    switch (sortType) {
      case Status.active:
        return todos.filter(todo => !todo.completed);
      case Status.completed:
        return todos.filter(todo => todo.completed);
      case Status.all:
        return todos;
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {getList(status).map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              deleteTodosFromServer={deleteTodosFromServer}
              key={todo.id}
              todo={todo}
            />
          </CSSTransition>
        ))}
        {tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TodoItem
              deleteTodosFromServer={deleteTodosFromServer}
              key={tempTodo.id}
              todo={tempTodo}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
