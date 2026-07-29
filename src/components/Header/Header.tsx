type Props = {
  children: React.ReactNode;
};

export const Header = ({ children }: Props) => {
  return <header className="todoapp__header">{children}</header>;
};
