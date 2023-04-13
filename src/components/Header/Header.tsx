import cn from 'classnames';
import {
  ChangeEvent,
  FC,
  FormEvent,
  useState,
} from 'react';

interface Props {
  onAdd: (title: string) => void,
  disabled: boolean,
  activeTodos: number,
}

export const Header: FC<Props> = (props) => {
  const {
    onAdd,
    disabled,
    activeTodos,
  } = props;

  const [title, setTitle] = useState('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    onAdd(title);
    setTitle('');
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: !activeTodos,
        })}
        aria-label="all"
      />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleChange}
          disabled={disabled}
        />
      </form>
    </header>
  );
};
