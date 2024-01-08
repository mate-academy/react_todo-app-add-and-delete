import {
  useState, useEffect, Dispatch, SetStateAction,
} from 'react';
import * as postService from '../api/todos';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  setTodo: Dispatch<SetStateAction<Todo>>
  todos: Todo[],
  setTodos: Dispatch<SetStateAction<Todo[]>>
  setErrorId: Dispatch<SetStateAction<number>>
};

export const Header: React.FC<Props> = ({
  todo,
  setTodo,
  todos,
  setTodos,
  setErrorId,
}) => {
  const setEmptyTitleErrorWithTimeOut = () => {
    setErrorId(4);
    setTimeout(() => {
      setErrorId(0);
    }, 2000);
  };

  useEffect(() => {
    const setPostErrorWithTimeOut = () => {
      setErrorId(2);
      setTimeout(() => {
        setErrorId(0);
      }, 2000);
    };

    async function postData() {
      try {
        await postService.createTodo(todo);
      } catch (error) {
        setPostErrorWithTimeOut();
      }
    }

    postData();
  }, [todo, setErrorId]);

  const [text, setText] = useState('');

  const handleInputTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!text.trim()) {
      setEmptyTitleErrorWithTimeOut();

      return;
    }

    const newTodo = {
      id: Math.floor(Math.random() * 1000000),
      userId: 12147,
      title: text,
      completed: false,
    };

    setTodo(newTodo);
    setTodos([...todos, newTodo]);
    setText('');
  };

  return (
    <header className="todoapp__header">
      <button
        aria-label="toggle between 3 buttons"
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          value={text}
          onChange={handleInputTitle}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
