import {
  useState,
  FormEvent,
  ChangeEvent,
  useContext,
  useLayoutEffect,
} from 'react';
import { isOnlyWhiteSpace } from '../utils/string/isOnlyWhiteSpace';
import { TodoErrors } from '../utils/enums/TodoErrors';
import { TodosContext } from '../context/TodoContext';

export const useTodoForm = () => {
  const { addTodo, showError, onFocus } = useContext(TodosContext);

  const [isInputDisabled, setInputDisabled] = useState(false);

  const [title, setTitle] = useState('');

  useLayoutEffect(() => {
    if (!isInputDisabled) {
      onFocus();
    }
  }, [isInputDisabled]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title || isOnlyWhiteSpace(title)) {
      showError(TodoErrors.title);
      return;
    }

    setInputDisabled(true);

    try {
      await addTodo(title.trim());
      setTitle('');
    } catch {
      showError(TodoErrors.add);
    } finally {
      setInputDisabled(false);
    }
  };

  const handleChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  return {
    title,
    handleSubmit,
    handleChangeTitle,
    setTitle,
    isInputDisabled,
  };
};
