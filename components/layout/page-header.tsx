type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHeader({
  eyebrow,
  title,
  description,
}: PageHeaderProps) {
  return (
    <header className="px-1 pt-1">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="display-title mt-3">{title}</h1>
      <p className="support-text mt-3 max-w-[34rem]">{description}</p>
    </header>
  );
}
