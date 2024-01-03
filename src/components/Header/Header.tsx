/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Error } from '../../types/enums/Error';
import { addTodo } from '../../api/todos';
import { USER_ID } from '../../Variables';
import { DispatchContext, StateContext } from '../../TodosContext';
import { ReducerType } from '../../types/enums/ReducerType';

interface Props {
  updateTodos: () => void
}

export const Header: React.FC<Props> = ({ updateTodos }) => {
  const { todos } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const [todoTitle, setTodoTitle] = useState('');
  const [disableInput, setDisableInput] = useState(false);
  const addTodoInput = useRef<null | HTMLInputElement>(null);

  const activeTodos = todos?.filter(({ completed }) => !completed).length;

  useEffect(() => {
    addTodoInput.current?.focus();
  }, []);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (todoTitle.trim()) {
      setDisableInput(true);
      dispatch({
        type: ReducerType.SetTempTodo,
        payload: {
          id: 0,
          userId: USER_ID,
          title: todoTitle.trim(),
          completed: false,
        },
      });

      addTodo(USER_ID, {
        userId: USER_ID,
        title: todoTitle.trim(),
        completed: false,
      })
        .then(() => {
          updateTodos();
          setTodoTitle('');
        })
        .catch(() => dispatch({
          type: ReducerType.SetError,
          payload: Error.UnableToAddATodo,
        }))
        .finally(() => {
          setDisableInput(false);

          dispatch({
            type: ReducerType.SetTempTodo,
            payload: null,
          });

          addTodoInput.current?.focus();
        });
    } else {
      dispatch({
        type: ReducerType.SetError,
        payload: Error.TitleShouldNotBeEmpty,
      });
    }
  };

  return (
    <header className="todoapp__header">
      {
        activeTodos !== 0 && (
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />
        )
      }

      <form onSubmit={handleFormSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={addTodoInput}
          value={todoTitle}
          onChange={(e) => setTodoTitle(e.target.value)}
          disabled={disableInput}
        />
      </form>
    </header>
  );
};
