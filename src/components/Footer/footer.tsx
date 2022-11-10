import React, { useContext } from 'react';
import { Filter } from '../Filter';
import { AppContext } from '../AppContext';

type Props = {
  numberOfNotCompletedTodo: number | undefined,
};

export const Footer: React.FC<Props> = React.memo(
  ({
    numberOfNotCompletedTodo,
  }) => {
    const {
      setCompletedTodosId,
      todosFromServer,
    } = useContext(AppContext);

    const getCompletedTodosId = () => {
      if (todosFromServer) {
        const completedTodos = todosFromServer.filter(todo => todo.completed);
        const completedTodosId: number[] = [];

        completedTodos.forEach(todo => {
          completedTodosId.push(todo.id);
        });

        setCompletedTodosId(completedTodosId);
      }
    };

    const style = {
      cursor: 'pointer',
      opacity: 1,
    };

    if (numberOfNotCompletedTodo === todosFromServer?.length) {
      style.cursor = 'auto';
      style.opacity = 0;
    }

    return (
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="todosCounter">
          {`${numberOfNotCompletedTodo} items left`}
        </span>

        <Filter />

        <button
          data-cy="ClearCompletedButton"
          type="button"
          className="todoapp__clear-completed"
          onClick={getCompletedTodosId}
          disabled={numberOfNotCompletedTodo === todosFromServer?.length}
          style={style}
        >
          Clear completed
        </button>
      </footer>
    );
  },
);
