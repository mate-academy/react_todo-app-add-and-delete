import { RefObject } from 'react';
import { HeaderForm } from './HeaderForm';

type Props = {
  title: string;
  inputRef: RefObject<HTMLInputElement>;
  isSubmitting: boolean;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export const Header = ({
  title,
  inputRef,
  isSubmitting,
  handleInputChange,
  handleSubmit,
}: Props) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <HeaderForm
        title={title}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        inputRef={inputRef}
        isSubmitting={isSubmitting}
      />
    </header>
  );
};
