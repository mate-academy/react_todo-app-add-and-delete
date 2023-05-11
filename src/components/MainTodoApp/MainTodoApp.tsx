import { FC } from 'react';
import { Todo } from '../../types/Todo';
import { Category } from '../../types/Category';
import { CompletedTodo } from '../CompletedTodo';
import { ActiveTodo } from '../ActiveTodo';
import { LoadingTodo } from '../LoadingTodo';
import { UpdateTodo } from '../UpdateTodo';

interface Props {
  todos: Todo[];
  category: Category;
  tempTodo: Todo | null;
  setTempTodo: (tempTodo: Todo | null) => void;
}

export const MainTodoApp: FC<Props> = ({
  todos,
  category,
  tempTodo,
  setTempTodo,
}) => {
  let visibleTodos = todos;

  if (category !== 'all') {
    visibleTodos = todos.filter(({ completed }) => {
      return (category === 'completed')
        ? completed
        : !completed;
    });
  }

  return (
    <section className="todoapp__main">
      {visibleTodos.map(({ id, completed, title }) => {
        if (tempTodo?.id === id) {
          setTempTodo(null);
        }

        return (
          <>
            {completed && (
              <CompletedTodo
                id={id}
                title={title}
                key={id}
              />
            )}

            {!completed && (
              <ActiveTodo
                id={id}
                title={title}
                key={id}
              />
            )}

            {false && <UpdateTodo />}
          </>
        );
      })}

      {tempTodo && <LoadingTodo title={tempTodo.title} />}
    </section>
  );
};
