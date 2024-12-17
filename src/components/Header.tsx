import classNames from 'classnames';
import React from 'react';

interface HeaderProps {  //+++
  onAdd: (title: string) => void;
  isAdding: boolean;
  newTodoTitle: string;
  setNewTodoTitle: React.Dispatch<React.SetStateAction<string>>;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const Header: React.FC<HeaderProps> = ({ onAdd, isAdding, newTodoTitle, setNewTodoTitle, inputRef }) => { //+++


  const handleSubmit = (event: React.FormEvent) => { //+++
    event.preventDefault();
    onAdd(newTodoTitle.trim());
  };

  React.useEffect(() => {
    if (inputRef.current && !isAdding) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  return (
    <header className="todoapp__header">
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          ref={inputRef}
          type="text"
          className={classNames('todoapp__new-todo', {
            'todoapp__new-todo--disabled' : isAdding,
          })}
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
