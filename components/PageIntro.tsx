import type { ReactNode } from "react";

export function PageIntro({
  eyebrow,
  title,
  children,
  action,
}: {
  eyebrow?: string;
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="page-intro">
      <div className="page-intro__title">
        <div className="page-intro__rail" aria-hidden="true">
          <span>01</span>
          <span>{eyebrow ?? "Ampara"}</span>
        </div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
      </div>
      <div className="page-intro__body">
        <div>{children}</div>
        {action}
      </div>
    </section>
  );
}
