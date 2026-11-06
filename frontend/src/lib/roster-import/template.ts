/**
 * Generates an RFC-4180 compliant CSV template for Robolution member roster preload.
 */

export const CSV_TEMPLATE_CONTENT = `name,email,role,active
"Alex Mercer",alex.mercer@example.com,member,true
"Jordan Hayes",jordan.hayes@example.com,member,true
"Dr. Elena Vance",elena.vance@example.com,admin,true
"Morgan Reed",morgan.reed@example.com,member,false
`;

export function getCsvTemplate(includeExamples: boolean = true): string {
  if (!includeExamples) {
    return "name,email,role,active\n";
  }
  return CSV_TEMPLATE_CONTENT;
}
