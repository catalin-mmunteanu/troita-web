import { RopeDivider } from "./icons";

/**
 * A section laid out like an almanac page: the heading sits in a narrow margin
 * column on the left, the content in the wide column. Left-aligned, never
 * centred (DESIGN.MD ban 5), separated by the carved-rope rule.
 */
export function Section({
  id,
  eyebrow,
  title,
  children,
  rope = true,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
  rope?: boolean;
}) {
  return (
    <section aria-labelledby={id} className="mx-auto max-w-6xl px-4 sm:px-6">
      {rope && <RopeDivider className="mb-10 md:mb-14" />}
      <div className="grid gap-6 pb-14 md:grid-cols-[minmax(0,3fr)_minmax(0,9fr)] md:gap-10 md:pb-20">
        <div>
          <div className="md:sticky md:top-24">
            {eyebrow && <p className="rubric text-red">{eyebrow}</p>}
            <h2 id={id} className="mt-1.5 text-[26px] font-semibold leading-tight text-ink sm:text-[28px]">
              {title}
            </h2>
          </div>
        </div>
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}
