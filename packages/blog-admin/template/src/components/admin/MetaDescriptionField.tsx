"use client";

interface MetaDescriptionFieldProps {
  value: string;
  onChange: (value: string) => void;
  focusKeyword: string;
}

function barColor(length: number): string {
  if (length >= 120 && length <= 160) return "var(--forest-500)";
  if (length >= 90 && length <= 170) return "var(--amber-500)";
  return "var(--rose-500)";
}

export default function MetaDescriptionField({
  value,
  onChange,
  focusKeyword,
}: MetaDescriptionFieldProps) {
  const len = value.length;
  const hasKeyword =
    focusKeyword.trim() &&
    value.toLowerCase().includes(focusKeyword.trim().toLowerCase());

  return (
    <label className="admin-field">
      <span className="admin-field__label">Meta description</span>
      <textarea
        className="admin-field__textarea"
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write a compelling summary for Google — include your focus keyword naturally."
      />
      <div className="meta-bar">
        <div className="meta-bar__track">
          <div
            className="meta-bar__fill"
            style={{
              width: `${Math.min(100, (len / 160) * 100)}%`,
              background: barColor(len),
            }}
          />
        </div>
        <div className="meta-bar__meta">
          <span style={{ color: barColor(len) }}>{len} / 160 chars</span>
          <span className={hasKeyword ? "meta-bar__ok" : "meta-bar__warn"}>
            {hasKeyword ? "Keyword found" : "Add focus keyword"}
          </span>
        </div>
      </div>
    </label>
  );
}
