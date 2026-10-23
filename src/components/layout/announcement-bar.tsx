import { site } from "@/config/site";
import { BoltIcon } from "@/components/ui/icons";

export function AnnouncementBar() {
  const messages = site.announcement;
  if (messages.length === 0) return null;
  return (
    <div className="bg-ink text-white">
      <ul className="container-page flex h-9 items-center justify-center gap-x-6 overflow-hidden text-[10px] font-bold uppercase tracking-[0.16em] sm:text-[11px]">
        {messages.map((message, index) => (
          <li key={message} className={index > 0 ? "hidden items-center gap-6 sm:flex" : "flex"}>
            {index > 0 && <BoltIcon className="size-3 text-volt" />}
            <span>{message}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
