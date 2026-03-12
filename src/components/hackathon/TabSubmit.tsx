"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useSubmissionStore } from "@/stores/submissionStore";
import type { HackathonDetail } from "@/lib/types";
import { toast } from "sonner";

export default function TabSubmit({ detail }: { detail: HackathonDetail }) {
  const { submit } = detail.sections;
  const { submissions, addSubmission } = useSubmissionStore();
  const hackathonSubmissions = submissions.filter(
    (s) => s.hackathonSlug === detail.slug
  );

  const hasMultiStep = submit.submissionItems && submit.submissionItems.length > 0;

  return (
    <div className="space-y-6">
      {/* Guide */}
      <Card>
        <CardHeader>
          <CardTitle>제출 가이드</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {submit.guide.map((text, i) => (
              <li key={i} className="flex gap-2 text-sm">
                <span className="text-primary font-bold">•</span>
                <span className="text-muted-foreground">{text}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="text-sm text-muted-foreground">허용 형식:</span>
            {submit.allowedArtifactTypes.map((type) => (
              <Badge key={type} variant="outline">
                {type}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Submission Form(s) */}
      {hasMultiStep ? (
        submit.submissionItems!.map((item) => (
          <SubmissionForm
            key={item.key}
            hackathonSlug={detail.slug}
            itemKey={item.key}
            title={item.title}
            format={item.format}
            existing={hackathonSubmissions.find((s) => s.itemKey === item.key)}
          />
        ))
      ) : (
        <SubmissionForm
          hackathonSlug={detail.slug}
          title="제출"
          format="zip"
          existing={hackathonSubmissions.find((s) => !s.itemKey)}
        />
      )}

      {/* Submission History */}
      {hackathonSubmissions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>제출 이력</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {hackathonSubmissions.map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div>
                    <p className="font-medium text-sm">{sub.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(sub.submittedAt).toLocaleString("ko-KR")}
                    </p>
                    {sub.content && (
                      <p className="text-xs text-muted-foreground mt-1 truncate max-w-xs">
                        {sub.content}
                      </p>
                    )}
                  </div>
                  <Badge
                    variant={sub.status === "submitted" ? "default" : "secondary"}
                  >
                    {sub.status === "submitted" ? "제출됨" : "임시저장"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function SubmissionForm({
  hackathonSlug,
  itemKey,
  title,
  format,
  existing,
}: {
  hackathonSlug: string;
  itemKey?: string;
  title: string;
  format: string;
  existing?: { id: string; content: string; notes?: string };
}) {
  const { addSubmission, updateSubmission } = useSubmissionStore();
  const [content, setContent] = useState(existing?.content || "");
  const [notes, setNotes] = useState(existing?.notes || "");

  const handleSubmit = (status: "draft" | "submitted") => {
    if (!content.trim()) {
      toast.error("내용을 입력해주세요");
      return;
    }

    if (existing) {
      updateSubmission(existing.id, {
        content,
        notes,
        status,
        submittedAt: new Date().toISOString(),
      });
    } else {
      addSubmission({
        id: `sub-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        hackathonSlug,
        itemKey,
        title,
        content,
        notes,
        submittedAt: new Date().toISOString(),
        status,
      });
    }

    toast.success(status === "submitted" ? "제출 완료!" : "임시 저장되었습니다");
  };

  const placeholder =
    format === "url" || format === "pdf_url"
      ? "https://..."
      : format === "text_or_url"
      ? "텍스트 또는 URL을 입력하세요"
      : "파일명 또는 URL을 입력하세요";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-1.5 block">
            {format.includes("url") ? "URL" : "내용"}
          </label>
          <Input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block">
            메모 (선택)
          </label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="추가 메모를 입력하세요"
            rows={3}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleSubmit("draft")}>
            임시저장
          </Button>
          <Button onClick={() => handleSubmit("submitted")}>제출하기</Button>
        </div>
      </CardContent>
    </Card>
  );
}
