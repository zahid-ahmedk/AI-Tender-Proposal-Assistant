type ClassValue = string | false | null | undefined;

/** Joins class names, skipping falsy values. (No Tailwind-merge: custom tokens like text-label-sm would be misread.) */
export const cn = (...values: ClassValue[]): string => values.filter(Boolean).join(" ");
