import classNames from 'classnames';
import { FC, useContext, useState } from 'react';
import { Todo } from '../types/Todo';
import { deleteTodo } from '../api/todos';
import { AuthContext } from './Auth/AuthContext';
import { Loader } from './Loader';

type Props = {
  visibleTodos: Todo[],
  isNewTodoLoaded: boolean,
  setVisibleTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setClickedIndex: React.Dispatch<React.SetStateAction<number>>,
  clickedIndex: number,
  isCompletedTodosDeleting: boolean,
};

export const TodoList: FC<Props> = ({
  isNewTodoLoaded,
  visibleTodos,
  setVisibleTodos,
  clickedIndex,
  setClickedIndex,
  isCompletedTodosDeleting,
}) => {
  const user = useContext(AuthContext);
  const [isTodoDeleted, setIsTodoDeleted] = useState(true);

  const deleteTodoHandler = (todoId: number) => {
    setIsTodoDeleted(false);

    if (user) {
      deleteTodo(user.id, todoId)
        .then((() => {
          setIsTodoDeleted(true);
          setVisibleTodos(prevTodos => prevTodos.filter(x => x.id !== todoId));
        }));
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map((todo: Todo, index) => {
        return (
          <div
            key={todo.id}
            data-cy="Todo"
            className={classNames(
              'todo',
              { completed: todo.completed },
            )}
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                defaultChecked
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              {todo.title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => {
                setClickedIndex(index);
                deleteTodoHandler(todo.id);
              }}
            >
              ×
            </button>

            {index === clickedIndex && (
              <Loader isActiveCondition={!isNewTodoLoaded || !isTodoDeleted} />
            )}

            <Loader isActiveCondition={
              todo.completed && isCompletedTodosDeleting
            }
            />
          </div>
        );
      })}
    </section>
  );
};
