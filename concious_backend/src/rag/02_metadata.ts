export function buildMetadataText(input: {
  title?: string | null | undefined;
  link?: string | null | undefined;
  type?: string | null | undefined;
  tags?: string[] | null | undefined;
  collection?: string | null | undefined;
  importance?: string | null | undefined;
  whySaved?: string | null | undefined;
  personalNote?: string | null | undefined;
  description?: string | null | undefined;
  summary?: string | null | undefined;
}): string {
  const parts: string[] = [];

  if (input.title) parts.push(`Title: ${input.title}`);
  if (input.type) parts.push(`Type: ${input.type}`);
  if (input.link) parts.push(`Link: ${input.link}`);
  if (input.tags?.length) parts.push(`Tags: ${input.tags.join(", ")}`);
  if (input.collection) parts.push(`Collection: ${input.collection}`);
  if (input.importance) parts.push(`Importance: ${input.importance}`);
  if (input.whySaved) parts.push(`Remember this for: ${input.whySaved}`);
  if (input.personalNote) parts.push(`Personal note: ${input.personalNote}`);
  if (input.summary) parts.push(`User summary: ${input.summary}`);
  if (input.description) parts.push(`Description: ${input.description}`);

  return parts.join("\n");
}
