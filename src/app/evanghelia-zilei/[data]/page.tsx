import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pageMeta } from "@/lib/seo";
import { AppNote, Breadcrumbs, PageHeader } from "@/components/chrome";
import { Readings } from "@/components/lecturi";
import { Section } from "@/components/section";
import { addDays, capitalize, formatLong, formatWithWeekday, fromIso, iso, monthSlug } from "@/lib/dates";
import { LECTURI_DATES, lecturaOn } from "@/lib/lecturi";

export function generateStaticParams() {
  return LECTURI_DATES.map((data) => ({ data }));
}

export async function generateMetadata({ params }: PageProps<"/evanghelia-zilei/[data]">): Promise<Metadata> {
  const { data } = await params;
  const lectura = /^\d{4}-\d{2}-\d{2}$/.test(data) ? lecturaOn(fromIso(data)) : null;
  if (!lectura) return {};
  const date = fromIso(data);
  return pageMeta({
    title: `Evanghelia zilei ${formatLong(date)}`,
    description: lectura.none
      ? `${capitalize(formatWithWeekday(date, true))}: ${lectura.none}.`
      : `Evanghelia (${lectura.evanghelieCite}) și Apostolul (${lectura.apostolCite}) de ${formatWithWeekday(date, true)}, cu textul integral.`,
    path: `/evanghelia-zilei/${data}`,
  });
}

export default async function EvangheliaPeZi({ params }: PageProps<"/evanghelia-zilei/[data]">) {
  const { data } = await params;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) notFound();
  const date = fromIso(data);
  const lectura = lecturaOn(date);
  if (!lectura) notFound();
  const prev = addDays(date, -1);
  const next = addDays(date, 1);
  return (
    <>
      <Breadcrumbs items={[{ href: "/", label: "Acasă" }, { href: "/evanghelia-zilei", label: "Evanghelia zilei" }, { label: formatLong(date) }]} />
      <PageHeader eyebrow={capitalize(formatWithWeekday(date, true))} title={lectura.title ?? "Apostolul și Evanghelia zilei"}>
        {lectura.none
          ? lectura.none + "."
          : `Ev. ${lectura.evanghelieCite}${lectura.apostolCite ? ` · Ap. ${lectura.apostolCite}` : ""}`}
      </PageHeader>
      <Section id="lecturi" eyebrow="La Sfânta Liturghie" title="Lecturile zilei" rope={false}>
        <Readings lectura={lectura} />
        <nav aria-label="Alte zile" className="mt-8 flex flex-wrap justify-between gap-4 text-[16px]">
          {lecturaOn(prev) ? (
            <Link href={`/evanghelia-zilei/${iso(prev)}`} className="text-red underline-offset-4 hover:underline">
              ← {formatWithWeekday(prev)}
            </Link>
          ) : <span />}
          <Link href={`/calendar-ortodox/${date.y}/${monthSlug(date.m)}#ziua-${date.d}`} className="text-red underline-offset-4 hover:underline">
            Ziua în calendar
          </Link>
          {lecturaOn(next) ? (
            <Link href={`/evanghelia-zilei/${iso(next)}`} className="text-red underline-offset-4 hover:underline">
              {formatWithWeekday(next)} →
            </Link>
          ) : <span />}
        </nav>
      </Section>
      <AppNote>
        În aplicația Troița puteți primi Evanghelia zilei în fiecare dimineață. Aplicația pentru Android vine în
        curând pe Google Play.
      </AppNote>
    </>
  );
}
