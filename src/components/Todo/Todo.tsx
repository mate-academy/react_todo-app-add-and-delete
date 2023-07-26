import React, {
  useContext,
  useEffect, useRef, useState,
} from 'react';
import classNames from 'classnames';
import { ITodo } from '../../types/Todo';
import { Form, TodoCard } from '../common';
import { StateContext } from '../GlobalStateProvider';
import { Toggler } from '../common/Toggler';

type Props = {
  todo: ITodo
  deleteTodo: (id: number) => void;
  editTodo: (id: number, newTitle: string) => void;
  toggleTodoStatus: (id: number) => void;

};

export const Todo: React.FC<Props> = (
  {
    todo: { id, title, completed },
    deleteTodo,
    editTodo,
    toggleTodoStatus,

  },
) => {
  const { loading, selectedTodoId } = useContext(StateContext);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const input = useRef<HTMLInputElement>(null);

  const isSelected = selectedTodoId === id;

  useEffect(() => {
    if (isEditing && input.current) {
      input.current.focus();
    }
  }, [isEditing]);

  const onDoubleClick = () => {
    setIsEditing(true);
    input.current?.focus();
  };

  const onEdit = (newTitle: string) => {
    editTodo(
      id,
      newTitle,
    );

    setIsEditing(false);
  };

  return (
    <div className={
      classNames('todo', {
        completed,
      })
    }
    >
      <Toggler
        completed={completed}
        onToggle={() => toggleTodoStatus(id)}
      />

      {!isEditing ? (
        <TodoCard
          todoTitle={title}
          deleteTodo={() => deleteTodo(id)}
          onDoubleClick={onDoubleClick}
          loading={loading}
          isSelected={isSelected}
        />
      ) : (
        <Form
          ref={input}
          todoTitle={title}
          onSubmit={onEdit}
        />

      )}

    </div>

  );
};
