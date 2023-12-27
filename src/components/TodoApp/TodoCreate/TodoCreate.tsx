import {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { DispatchContext, StateContext } from '../../../libs/state';
import { USER_ID } from '../../../libs/constants';
import { Actions, ErrorMessages } from '../../../libs/enums';
import { createTodo } from '../../../api/todos';
import { Todo } from '../../../libs/types';
import { setErrorMessage } from '../../../libs/helpers';

export const TodoCreate: React.FC = () => {
  const dispatch = useContext(DispatchContext);
  const { loader } = useContext(StateContext);
  const [title, setTitle] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current && !loader.isLoading) {
      inputRef.current.focus();
    }
  }, [loader.isLoading]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const saveTodo = useCallback((newTodo: Omit<Todo, 'id'>) => {
    dispatch({
      type: Actions.setLoader,
      payload: { isLoading: true, todoIds: [0] },
    });

    dispatch({
      type: Actions.addTempTodo,
      payload: { todo: { ...newTodo, id: 0 } },
    });

    createTodo(newTodo)
      .then((response => {
        dispatch({ type: Actions.add, payload: { todo: response } });
        setTitle('');
      }))
      .catch(() => {
        setErrorMessage(dispatch, ErrorMessages.FailedToAdd);
      })
      .finally(() => {
        dispatch({ type: Actions.setLoader, payload: { isLoading: false } });
        dispatch({ type: Actions.addTempTodo, payload: { todo: null } });
      });
  }, [dispatch]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimedTitle = title.trim();

    if (!trimedTitle) {
      setErrorMessage(dispatch, ErrorMessages.EmptyTitle);

      return;
    }

    const newTodo = {
      userId: USER_ID,
      title: trimedTitle,
      completed: false,
    };

    saveTodo(newTodo);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        ref={inputRef}
        disabled={loader.isLoading}
        value={title}
        onChange={handleTitleChange}
      />
    </form>
  );
};
