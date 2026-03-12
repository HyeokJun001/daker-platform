import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { HackathonDetail } from "@/lib/types";

export default function TabInfo({ detail }: { detail: HackathonDetail }) {
  const { info } = detail.sections;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>공지사항</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {info.notice.map((text, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="text-primary font-bold mt-0.5">•</span>
                <span className="text-muted-foreground">{text}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>링크</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <a
            href={info.links.rules}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>
            규칙 보기
          </a>
          <a
            href={info.links.faq}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
            FAQ 보기
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
