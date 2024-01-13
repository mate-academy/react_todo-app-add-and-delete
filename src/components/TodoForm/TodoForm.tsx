import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import { TodosContext } from '../../store/TodoProvider';
import { ActionType, ErrorMessage, Item } from '../../types/Todo';
import { createTodo } from '../../api/todos';

type Props = {};

export const TodoForm: React.FC<Props> = () => {
  const { state, dispatch } = useContext(TodosContext);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const { tempTodo } = state;

  const addTodoItem = (title: string) => {
    const temp: Item = {
      id: 0,
      userId: 0,
      title: title.trim(),
      completed: false,
    };

    dispatch({ type: ActionType.UPDATE_TEMP, payload: temp });

    createTodo({
      title: temp.title,
      completed: temp.completed,
    })
      .then(todo => {
        dispatch({ type: ActionType.ADD, payload: todo });
        setQuery('');
      })
      .catch(() => {
        dispatch({
          type: ActionType.ERROR,
          payload: ErrorMessage.UNABLE_CREATE,
        });
      })
      .finally(() => {
        dispatch({ type: ActionType.UPDATE_TEMP, payload: null });
      });
  };

  const handleTodoFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const title = inputRef?.current?.value || '';

    if (title.trim()) {
      addTodoItem(title);
    } else {
      dispatch({ type: ActionType.ERROR, payload: ErrorMessage.EMPTY_TITLE });
    }
  };

  useEffect(() => {
    if (!tempTodo) {
      inputRef?.current?.focus();
    }
  }, [tempTodo]);

  return (
    <form onSubmit={handleTodoFormSubmit}>
      <input
        ref={inputRef}
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        data-cy="NewTodoField"
        disabled={!!tempTodo}
      />
    </form>
  );
};
