/**
 * Intra-file duplicate detector.
 * Tracks email occurrences and flags subsequent rows with the same normalized email.
 */

export class FileDuplicateDetector {
  private emailFirstSeenLine = new Map<string, number>();

  /**
   * Checks whether the normalized email has been observed before in this file.
   * Returns:
   * - isDuplicate: true if seen before
   * - firstLine: line number where it first appeared (if duplicate)
   */
  public registerEmail(
    normalizedEmail: string,
    currentLine: number
  ): { isDuplicate: boolean; firstLine?: number } {
    if (!normalizedEmail) {
      return { isDuplicate: false };
    }

    const existingLine = this.emailFirstSeenLine.get(normalizedEmail);
    if (existingLine !== undefined) {
      return { isDuplicate: true, firstLine: existingLine };
    }

    this.emailFirstSeenLine.set(normalizedEmail, currentLine);
    return { isDuplicate: false };
  }

  public getSeenCount(): number {
    return this.emailFirstSeenLine.size;
  }

  public reset(): void {
    this.emailFirstSeenLine.clear();
  }
}
