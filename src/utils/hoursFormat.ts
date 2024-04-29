export function convertMinutesToHours(
  minutes: number,
  short: boolean = false
): string {
  if (minutes < 60) {
    return short ? `${minutes}m` : `${minutes} minutos`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (short) {
      if (remainingMinutes === 0) {
        return `${hours}h`;
      } else {
        return `${hours}h ${remainingMinutes}m`;
      }
    }

    if (remainingMinutes === 0) {
      return `${hours} horas`;
    } else {
      return `${hours} horas ${remainingMinutes} minutos`;
    }
  }
}

export function hourFormat(dateRaw: string): string {
  const date = new Date(dateRaw);
  const format = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const [{ value: hour }, , { value: minute }] = format.formatToParts(date);

  return `${hour}:${minute}`;
}
