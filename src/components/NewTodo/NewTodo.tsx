import React, { RefObject, useState } from 'react';
import { createTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { User } from '../../types/User';

type Props = {
  newTodoField: RefObject<HTMLInputElement>;
  todos: Todo[];
  user: User | null
  setTodos: any;
  setErrorNotification: (value: string) => void;
  setIsShownTempTodo: (value: boolean) => void;
  setPreviewTitle: (value: string) => void;

};

export const NewTodo: React.FC<Props> = ({
  newTodoField,
  todos,
  user,
  setTodos,
  setErrorNotification,
  setIsShownTempTodo,
  setPreviewTitle,
}) => {
  const [title, setTitle] = useState('');

  const handledTitle = (event:React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value.replace(/^(\s)*/g, ''));
    setPreviewTitle(event.target.value.replace(/^(\s)*/g, ''));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title) {
      setErrorNotification('Title can\'t be empty');

      return;
    }

    const createTodos = async () => {
      setIsShownTempTodo(true);
      try {
        if (user) {
          const newTodo = await createTodo(title, user?.id);

          setTodos([...todos, newTodo]);
        }
      } catch (error) {
        setErrorNotification('Unable to add a todo');
      } finally {
        setIsShownTempTodo(false);
      }
    };

    createTodos();
    setTitle('');
  };

  return (
    <form
      onSubmit={handleSubmit}
    >
      <input
        data-cy="NewTodoField"
        type="text"
        ref={newTodoField}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={handledTitle}
      />
    </form>
  );
};
