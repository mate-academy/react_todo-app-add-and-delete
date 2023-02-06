type Props = {
  title: string,
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  setTitle: (event: string) => void
  placeholder: string
  className: string
  isLoading: boolean
};

export const Form: React.FC<Props> = ({
  title,
  onSubmit,
  setTitle,
  placeholder,
  className,
  isLoading,
}) => {
  return (
    <form
      onSubmit={onSubmit}
    >
      <input
        type="text"
        className={className}
        placeholder={placeholder}
        value={title}
        onChange={(event) => {
          setTitle(event.target.value);
        }}
        disabled={isLoading}

      />
    </form>
  );
};
