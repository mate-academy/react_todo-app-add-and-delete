import { ChangeEvent, FC, useContext, useRef, useState } from 'react';
import { addTodo, USER_ID } from '../../api/todos';
import { TodoContext } from '../../context/todo/TodoContext';
import { TodoErrorMessage } from '../../types/TodoErrorMessage';

export const TodoForm: FC = ({}) => {
  const [text, setText] = useState('');

  const [addTodoLoading, setAddTodoLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const { setErrorMessage, setIsLoading, setTempTodoText } =
    useContext(TodoContext);

  const onTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const onTodoSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    const trimmedText = text.trim();

    e.preventDefault();

    if (trimmedText) {
      setAddTodoLoading(true);
      setTempTodoText(trimmedText);

      addTodo({
        completed: false,
        title: trimmedText,
        userId: USER_ID,
      })
        .then(() => {
          setIsLoading(true);
          setText('');
        })

        .catch(() => {
          setText(trimmedText);
          setErrorMessage(TodoErrorMessage.ADD_ERROR);
        })

        .finally(() => {
          setAddTodoLoading(false);
          if (inputRef.current) {
            setTimeout(() => {
              if (inputRef.current) {
                inputRef.current.focus();
              }
            }, 0);
          }

          setTimeout(() => {
            setTempTodoText('');
          }, 300);
        });
    } else {
      setErrorMessage(TodoErrorMessage.TITLE_ERROR);
    }
  };

  return (
    <form onSubmit={onTodoSubmit}>
      <input
        ref={inputRef}
        data-cy="NewTodoField"
        value={text}
        onChange={onTextChange}
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        disabled={addTodoLoading}
        autoFocus
      />
    </form>
  );
};
