import Link from "next/link";

export type NotFoundProps = {
  title?: string;
  description?: string;
  linkHref?: string;
  linkLabel?: string;
};

const defaultProps: Required<NotFoundProps> = {
  title: "ページが見つかりません",
  description: "お探しのページは存在しないか、移動した可能性があります。",
  linkHref: "/",
  linkLabel: "ホームに戻る",
};

export function NotFound(props: NotFoundProps) {
  const { title, description, linkHref, linkLabel } = {
    ...defaultProps,
    ...props,
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-destructive">{title}</h1>
        <p className="mt-4 whitespace-pre-line text-lg text-muted-foreground">{description}</p>
      </div>
      <Link
        href={linkHref}
        className="rounded-md bg-primary px-6 py-3 text-primary-foreground transition-colors hover:bg-primary/90"
      >
        {linkLabel}
      </Link>
    </div>
  );
}
