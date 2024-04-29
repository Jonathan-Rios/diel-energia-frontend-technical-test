export function dateFormat(dateRaw: string): string {
  const date = new Date(dateRaw);
  const format = new Intl.DateTimeFormat("pt-BR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const [{ value: day }, , { value: month }, , { value: year }] =
    format.formatToParts(date);

  return `${day}/${month}/${year}`;
}
