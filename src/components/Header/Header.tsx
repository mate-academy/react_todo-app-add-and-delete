import { useContext, useEffect, useRef, useState, FC } from 'react';
import { DispatchContext, StateContext } from '../../store/todoReducer';
import { Todo } from '../../types/Todo';
import { Action } from '../../types/actions';
import { USER_ID, createTodo, updateTodo } from '../../api/todos';

type Props = {
  onError: (value: string) => void;
  setTempTodo: (value: Todo | null) => void;
};

export const Header: FC<Props> = ({ onError, setTempTodo }) => {
  const titleRef = useRef<HTMLInputElement>(null);
  const [todoTitle, setTodoTitle] = useState('');
  const [addingTodo, setAddingTodo] = useState(false);
  const dispatch = useContext(DispatchContext);
  const { todos } = useContext(StateContext);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.focus();
    }
  }, [addingTodo]);

  const isAllTodoComplete = todos.every(todo => todo.completed);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAddingTodo(true);

    const trimedTitle = todoTitle.trim();

    if (!trimedTitle) {
      onError('Title should not be empty');

      return;
    }

    const newTodo: Todo = {
      title: todoTitle.trim(),
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(newTodo);

    createTodo(newTodo)
      .then(response => {
        dispatch({ type: Action.addTodo, payload: response });
        setTempTodo(null);
        setTodoTitle('');
      })
      .catch(() => {
        onError('Unable to add a todo');
        setTempTodo(null);
        setAddingTodo(false);
      })
      .finally(() => {
        setAddingTodo(false);
      });
  };

  const handleStatusChange = () => {
    const isActiveTodo = todos.every(todo => todo.completed);

    const newTodoList = todos.map(todo => {
      return { ...todo, completed: !isActiveTodo };
    });

    newTodoList.forEach(todo => {
      updateTodo(todo)
        .then(response => {
          dispatch({ type: Action.updateTodo, payload: response });
        })
        .catch(() => onError('Unable to update a todo'));
    });
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={`todoapp__toggle-all ${isAllTodoComplete && 'active'}`}
          data-cy="ToggleAllButton"
          onClick={handleStatusChange}
        />
      )}

      <form onSubmit={event => handleSubmit(event)}>
        <input
          data-cy="NewTodoField"
          type="text"
          {...(addingTodo && { disabled: true })}
          value={todoTitle}
          ref={titleRef}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={event => setTodoTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
