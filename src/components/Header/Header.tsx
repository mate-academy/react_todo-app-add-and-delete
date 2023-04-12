import {
  FC,
  useState,
  ChangeEvent,
  FormEvent,
} from 'react';
import classNames from 'classnames';

type Props = {
  onAdd: (title: string) => void,
  disabled: boolean,
  activeTodos: number,
};

export const Header: FC<Props> = (props) => {
  const {
    onAdd,
    disabled,
    activeTodos,
  } = props;

  const [title, setTitle] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    onAdd(title);
    setTitle('');
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  return (
    <header className="todoapp__header">
      <button
        aria-label="all"
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: activeTodos > 0 },
        )}
      />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={disabled}
          value={title}
          onChange={handleChange}
        />
      </form>
    </header>

  );
};
