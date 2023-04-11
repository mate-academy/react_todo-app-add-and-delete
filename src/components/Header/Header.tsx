import React from 'react';

type Props = {
  title: string
  onChangeTitle: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmitForm: (event: React.FormEvent) => void
};

export const Header: React.FC<Props> = ({
  title,
  onChangeTitle,
  onSubmitForm,
}) => (
  <header className="todoapp__header">
    <button
      type="button"
      aria-label="toggle-allbutton"
      className="todoapp__toggle-all active"
    />

    <form onSubmit={onSubmitForm}>
      <input
        type="text"
        value={title}
        onChange={onChangeTitle}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
      />
    </form>
  </header>
);
