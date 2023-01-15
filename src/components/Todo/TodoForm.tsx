import {
  RefObject, SetStateAction, useContext, useState,
} from 'react';
import { addTodo } from '../../api/todos';
import { ErrorContextType } from '../../types/ErrorContextType';
import { LoaderContextType } from '../../types/LoaderContextType';
import { TodoContextType } from '../../types/TodoContextType';
import { User } from '../../types/User';
import { AuthContext } from '../Auth/AuthContext';
import { ErrorContext } from '../Error/ErrorContext';
import { LoaderContext } from './LoaderContext';
import { TodoContext } from './TodoContext';

type Props = {
  newTodoField: RefObject<HTMLInputElement>,
  setIsAdding: (value: boolean) => void,
  isAdding: boolean,
};

const TodoForm: React.FC<Props> = ({
  newTodoField,
  setIsAdding,
  isAdding,
}) => {
  const user = useContext<User | null>(AuthContext);
  const { visibleTodos, setVisibleTodos }
  = useContext(TodoContext) as TodoContextType;
  const { setIsLoaderActive } = useContext(LoaderContext) as LoaderContextType;
  const { setIsError, setErrorText }
  = useContext(ErrorContext) as ErrorContextType;
  const [inputValue, setInputValue] = useState('');

  const setInput = (event: { target: { value: SetStateAction<string>; }; }) => {
    setInputValue(event.target.value);
  };

  const checkKey = async (event: {
    keyCode: number; preventDefault: () => void;
  }) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      setIsAdding(true);
      setIsLoaderActive(true);

      if (inputValue.trim().length === 0) {
        setErrorText('Title can\'t be empty');
        setIsAdding(false);

        return setIsError(true);
      }

      try {
        if (!user) {
          return false;
        }

        visibleTodos.push({
          title: inputValue,
          userId: user.id,
          id: 0,
          completed: false,
        });

        const result = await addTodo({
          title: inputValue,
          userId: user.id,
          completed: false,
          id: 0,
        });

        visibleTodos.pop();
        setVisibleTodos([...visibleTodos, result]);
        setInputValue('');
        setIsAdding(false);

        return setIsLoaderActive(false);
      } catch (error) {
        visibleTodos.pop();
        setIsError(true);
        setErrorText('Unable to add a todo');
        setIsAdding(false);

        return setIsLoaderActive(false);
      }
    }

    return false;
  };

  return (
    <form>
      <input
        data-cy="NewTodoField"
        type="text"
        ref={newTodoField}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={inputValue}
        onChange={setInput}
        onKeyDown={checkKey}
        disabled={isAdding}
      />
    </form>
  );
};

export default TodoForm;
