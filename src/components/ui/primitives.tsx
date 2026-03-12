import { ComponentProps, ReactNode } from "react";

export const Button = (props: ComponentProps<"button">) => (
  <button
    {...props}
    className={`rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50 ${props.className ?? ""}`}
  />
);

export const Input = (props: ComponentProps<"input">) => (
  <input {...props} className={`w-full rounded-md border px-3 py-2 text-sm ${props.className ?? ""}`} />
);

export const Textarea = (props: ComponentProps<"textarea">) => (
  <textarea {...props} className={`w-full rounded-md border px-3 py-2 text-sm ${props.className ?? ""}`} />
);

export const Badge = ({ children }: { children: ReactNode }) => (
  <span className="rounded-full bg-gray-100 px-2 py-1 text-xs">{children}</span>
);
