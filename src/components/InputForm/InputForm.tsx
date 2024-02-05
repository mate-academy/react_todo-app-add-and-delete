/* eslint-disable import/no-cycle */
/* eslint-disable no-console */
import {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';
import { USER_ID } from '../../App';
import { ErrorsContext, TodosContext } from '../../TodosContext/TodosContext';
import {
  checkAllStatuses,
  returnStatus,
} from '../../services/checkAllStatuses';
import { changeAllStatuses } from '../../services/changeAllStatuses';
import { ErrorMessages } from '../../types/Error';

/* eslint-disable jsx-a11y/control-has-associated-label */
type Props = {
  onSubmit: (todo: Todo) => void;
  onCompleted: (id: number, completeAll: boolean) => void;
};

export const InputForm: React.FC<Props> = ({ onSubmit, onCompleted }) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [completeAll, setCompleteAll] = useState(false);
  const { todos } = useContext(TodosContext);
  const { setNewError, setShowError } = useContext(ErrorsContext);

  const handleChangeAll = () => {
    if (checkAllStatuses(todos)) {
      console.log('change');
      const isCompleted = returnStatus(todos);
      const changeAll = changeAllStatuses(todos, isCompleted);

      changeAll.forEach(todo => {
        const { id } = todo;

        onCompleted(id, !isCompleted);
      });
    } else {
      const changeAll = changeAllStatuses(todos, true);

      changeAll.forEach(todo => {
        const { id, completed } = todo;

        onCompleted(id, completed);
      });
    }
  };

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    try {
      const newTodo: Todo = {
        id: 0,
        title: newTodoTitle.trim(),
        userId: USER_ID,
        completed: false,
      };

      if (newTodoTitle.trim() !== '') {
        onSubmit(newTodo);
      }
    } catch (error) {
      throw new Error('error');
    } finally {
      if (newTodoTitle.trim() === '') {
        setNewError(ErrorMessages.emptyTitle);
        setShowError(true);
      }

      setNewTodoTitle('');
    }
  }

  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, []);

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
        onClick={() => {
          handleChangeAll();
          setCompleteAll(!completeAll);
        }}
      />
      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          ref={titleField}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={event => {
            setNewTodoTitle(event.target.value);
          }}
        />
      </form>
    </header>
  );
};
