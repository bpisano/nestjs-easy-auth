import { add } from "date-fns";
import { Optional } from "../types/optional";

export function parseDayString(dayString: string): Optional<Date> {
  const numericValue: number = parseInt(dayString);
  const unit: string = dayString.charAt(dayString.length - 1).toLowerCase();

  const unitMap: Record<string, string> = {
    d: "days",
    h: "hours",
    m: "minutes",
    s: "seconds",
  };

  // eslint-disable-next-line no-prototype-builtins
  if (!unitMap.hasOwnProperty(unit)) {
    console.error(`Invalid unit when parsing day string: ${dayString}`);
    return undefined;
  }

  const durationUnit: string = unitMap[unit];
  const resultDate: Date = add(new Date(), { [durationUnit]: numericValue });

  return resultDate;
}
