import React, { FC } from 'react';
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
  setErrorDeleteTodo: (errorDeleteTodo: boolean) => void;
}

export const MainTodoApp: FC<Props> = React.memo(({
  todos,
  category,
  tempTodo,
  setTempTodo,
  setErrorDeleteTodo,
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
          <div key={id}>
            {completed && (
              <CompletedTodo
                id={id}
                title={title}
                setErrorDeleteTodo={setErrorDeleteTodo}
              />
            )}

            {!completed && (
              <ActiveTodo
                id={id}
                title={title}
                setErrorDeleteTodo={setErrorDeleteTodo}
              />
            )}

            {false && <UpdateTodo />}
          </div>
        );
      })}

      {tempTodo && <LoadingTodo title={tempTodo.title} />}
    </section>
  );
});
