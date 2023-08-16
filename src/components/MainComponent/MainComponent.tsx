import { useContext } from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';

import { AppContext } from '../../context';
import { TodoItemComponent } from '../TodoItemComponent';

import '../../styles/transition.css';

export const MainComponent:React.FC = () => {
  const { state } = useContext(AppContext);
  const todos = state.getVisibleTodos();

  return (
    <section className="todoapp__main">
      {todos.length > 0 && (
        <TransitionGroup component={null}>
          {
            todos.map((todo) => (
              <CSSTransition
                key={todo.id}
                timeout={300}
                classNames="item"
              >
                <TodoItemComponent todo={todo} />
              </CSSTransition>
            ))
          }
        </TransitionGroup>
      )}
    </section>
  );
};
