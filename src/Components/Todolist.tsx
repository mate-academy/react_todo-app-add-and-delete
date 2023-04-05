import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface TodoListPropsType {
  todosToShow: Todo[],
  todoDelete: (todoId: number) => void,
  deletedId: number,
  tempTodo: Todo,
  added: boolean,
}

export const TodoList: React.FC<TodoListPropsType> = ({
  todosToShow,
  todoDelete,
  deletedId,
  tempTodo,
  added,
}) => {
  if (added) {
    todosToShow.push(tempTodo);
  }

  return (
    <section className="todoapp__main">
      <TransitionGroup>
        {todosToShow.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames={classNames(
              'item',
              { 'temp-item': todo.id === 0 },
            )}
          >
            <TodoItem
              todo={todo}
              deletedId={deletedId}
              todoDelete={todoDelete}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>
    </section>
  );
};
