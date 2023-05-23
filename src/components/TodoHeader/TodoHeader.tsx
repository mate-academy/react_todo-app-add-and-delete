import { useState } from 'react';

type Props = {
  showErrorMessage: (message: string) => void,
  handleEnterKeyPress: (todoTitle: string) => void,
  isTempTodoTrue: boolean,
};

export const TodoHeader: React.FC<Props> = ({
  showErrorMessage,
  handleEnterKeyPress,
  isTempTodoTrue,
}) => {
  const [query, setQuery] = useState('');

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputElement = event.target as HTMLInputElement;

    setQuery(inputElement.value);
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedTitle = query.trim();

    if (!normalizedTitle) {
      showErrorMessage('Title can\'t be empty');

      return;
    }

    handleEnterKeyPress(normalizedTitle);
    setQuery('');
  };

  return (
    <header className="todoapp__header">
      <button type="button" className="todoapp__toggle-all active" />

      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={query}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isTempTodoTrue}
          onChange={onInputChange}
        />
      </form>
    </header>
  );
};
