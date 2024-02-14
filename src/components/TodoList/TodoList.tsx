import { useContext } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { filterTodos } from '../../utils/filterTodos';
import { TodoItem } from '../TodoItem';
import { TodoContext } from '../State/TodoContext';

export const TodoList: React.FC = () => {
  const {
    status,
    todos,
    tempToDo,
  } = useContext(TodoContext);

  const filteredTodos = filterTodos(status, todos);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {filteredTodos.map(({ completed, id, title }) => (
          <CSSTransition
            key={id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              key={id}
              completed={completed}
              id={id}
              title={title}
            />
          </CSSTransition>
        ))}

        {tempToDo && (
          <CSSTransition
            key={tempToDo.id}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem
              key={tempToDo.id}
              completed={tempToDo.completed}
              id={tempToDo.id}
              title={tempToDo.title}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
