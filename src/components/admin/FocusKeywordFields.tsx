"use client";

const MAX_SECONDARY = 6;

interface FocusKeywordFieldsProps {
  primary: string;
  secondary: string[];
  onPrimaryChange: (value: string) => void;
  onSecondaryChange: (values: string[]) => void;
}

export default function FocusKeywordFields({
  primary,
  secondary,
  onPrimaryChange,
  onSecondaryChange,
}: FocusKeywordFieldsProps) {
  function updateSecondary(index: number, value: string) {
    onSecondaryChange(secondary.map((item, i) => (i === index ? value : item)));
  }

  function removeSecondary(index: number) {
    onSecondaryChange(secondary.filter((_, i) => i !== index));
  }

  function addSecondary() {
    if (secondary.length >= MAX_SECONDARY) return;
    onSecondaryChange([...secondary, ""]);
  }

  return (
    <div className="wp-keywords">
      <label className="wp-side-field">
        <span>Focus keyword</span>
        <input
          value={primary}
          onChange={(e) => onPrimaryChange(e.target.value)}
          placeholder="e.g. how to calculate cgpa"
        />
        <small>Primary keyword — used for title, URL, intro, and H2 checks.</small>
      </label>

      {secondary.map((keyword, index) => (
        <label key={`secondary-${index}`} className="wp-side-field wp-keywords__row">
          <span>Secondary keyword {index + 1}</span>
          <div className="wp-keywords__input-row">
            <input
              value={keyword}
              onChange={(e) => updateSecondary(index, e.target.value)}
              placeholder="e.g. IUB CGPA calculator"
            />
            <button
              type="button"
              className="wp-keywords__remove"
              onClick={() => removeSecondary(index)}
              aria-label={`Remove secondary keyword ${index + 1}`}
            >
              ✕
            </button>
          </div>
        </label>
      ))}

      {secondary.length < MAX_SECONDARY && (
        <button type="button" className="wp-keywords__add" onClick={addSecondary}>
          + Add secondary keyword
        </button>
      )}

      <p className="wp-keywords__hint">
        Secondary keywords count toward keyword density when the primary phrase is used less often.
      </p>
    </div>
  );
}
