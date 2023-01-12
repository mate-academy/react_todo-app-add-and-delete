import { FC, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import Todo from '../../models/Todo';
import TodosAsync from '../../store/todos/todosAsync';
import { todosActions } from '../../store/todos/todosSlice';
import { selectFilteredTodos } from '../../store/todos/todosSelectors';
import { selectCurrentUser } from '../../store/users/usersSelectors';
import TodoItem from './TodoItem';

const TodosList:FC = () => {
  const dispatch = useAppDispatch();

  const currentUser = useAppSelector(selectCurrentUser);
  const todos = useAppSelector(selectFilteredTodos);

  useEffect(() => {
    if (currentUser && currentUser.id) {
      dispatch(TodosAsync.fetchTodos(currentUser.id));
    }

    return () => {
      dispatch(todosActions.setInitialField('todos'));
    };
  }, []);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos?.map((todo: Todo) => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem todo={todo} />
          </CSSTransition>
        ))}
      </TransitionGroup>
    </section>
  );
};

export default TodosList;
