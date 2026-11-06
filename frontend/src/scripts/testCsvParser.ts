import {
  parseAndValidateCsv,
  validateEmailField,
  validateRoleField,
  validateActiveField,
  validateHeaders,
  FileDuplicateDetector,
  MAX_CSV_FILE_SIZE_BYTES,
  MAX_CSV_ROW_COUNT,
} from "../lib/roster-import";

interface TestReport {
  name: string;
  passed: boolean;
  details: string;
}

const reports: TestReport[] = [];

function recordTest(name: string, passed: boolean, details: string) {
  reports.push({ name, passed, details });
  console.log(`${passed ? "✓ PASS" : "✗ FAIL"}: ${name} - ${details}`);
}

export function runParserUnitTests() {
  console.log("=== Starting Member Roster CSV Parser & Validation Test Suite ===");

  // 1. Email validation tests
  const validEmail1 = validateEmailField("user@example.com");
  const validEmail2 = validateEmailField("  john.doe+test@sub.domain.org  ");
  const invalidEmail1 = validateEmailField("plainaddress");
  const invalidEmail2 = validateEmailField("@missingusername.com");
  const emptyEmail = validateEmailField("");

  recordTest(
    "Email Validator - Valid RFC emails",
    validEmail1.isValid && validEmail1.value === "user@example.com" &&
    validEmail2.isValid && validEmail2.value === "john.doe+test@sub.domain.org",
    "Properly validates and normalizes valid email addresses."
  );

  recordTest(
    "Email Validator - Invalid and empty emails",
    !invalidEmail1.isValid && !invalidEmail2.isValid && !emptyEmail.isValid,
    "Strictly rejects malformed or empty email addresses."
  );

  // 2. Role validation tests
  const validAdmin = validateRoleField("admin");
  const validMember = validateRoleField("MEMBER");
  const rejectedIntern = validateRoleField("intern");
  const rejectedInternSpaces = validateRoleField("  intern  ");
  const defaultRole = validateRoleField("");
  const invalidRole = validateRoleField("superadmin");

  recordTest(
    "Role Validator - Allowed and default roles",
    validAdmin.isValid && validAdmin.value === "admin" &&
    validMember.isValid && validMember.value === "member" &&
    defaultRole.isValid && defaultRole.value === "member",
    "Accepts admin and member, defaults blank to member."
  );

  recordTest(
    "Role Validator - Rejects intern role",
    !rejectedIntern.isValid &&
    !rejectedInternSpaces.isValid &&
    Boolean(rejectedIntern.error?.includes("intern")),
    "Strictly rejects 'intern' role with explicit validation error."
  );

  recordTest(
    "Role Validator - Rejects unauthorized roles",
    !invalidRole.isValid,
    "Rejects arbitrary or unrecognized roles."
  );

  // 3. Active boolean validation tests
  const activeTrue = validateActiveField("true");
  const activeFalse = validateActiveField("FALSE");
  const activeDefault = validateActiveField("");
  const activeInvalid1 = validateActiveField("yes");
  const activeInvalid2 = validateActiveField("1");

  recordTest(
    "Active Validator - Strict boolean parsing",
    activeTrue.isValid && activeTrue.value === true &&
    activeFalse.isValid && activeFalse.value === false &&
    activeDefault.isValid && activeDefault.value === true,
    "Strictly parses 'true' and 'false' case-insensitively, defaults to true."
  );

  recordTest(
    "Active Validator - Rejects pseudo-booleans (1, yes, active)",
    !activeInvalid1.isValid && !activeInvalid2.isValid,
    "Strictly rejects 'yes', '1', and non-boolean strings."
  );

  // 4. Header validation
  const validHeaders = validateHeaders(["name", "email", "role", "active"]);
  const validEmailOnly = validateHeaders(["email"]);
  const missingEmailHeader = validateHeaders(["name", "role", "active"]);
  const emptyHeaders = validateHeaders([]);

  recordTest(
    "Header Validator - Required fields",
    validHeaders.isValid && validEmailOnly.isValid && !missingEmailHeader.isValid && !emptyHeaders.isValid,
    "Ensures 'email' column is present; rejects missing email header or empty headers."
  );

  // 5. Intra-file duplicate detector
  const detector = new FileDuplicateDetector();
  const reg1 = detector.registerEmail("duplicate@test.com", 2);
  const reg2 = detector.registerEmail("duplicate@test.com", 4);
  const reg3 = detector.registerEmail("other@test.com", 5);

  recordTest(
    "Duplicate Detector - Intra-file email duplicate detection",
    !reg1.isDuplicate && reg2.isDuplicate && reg2.firstLine === 2 && !reg3.isDuplicate,
    "Detects duplicate emails within the file and captures the first seen line number."
  );

  // 6. Quoted fields and commas inside quotes (RFC-4180)
  const quotedCsv = `name,email,role,active
"Smith, John",john.smith@example.com,member,true
"Vance, Dr. Elena",elena.vance@example.com,admin,true
"Escape ""Quote"" Test",quote.test@example.com,member,false`;

  const parsedQuoted = parseAndValidateCsv(quotedCsv);
  recordTest(
    "RFC-4180 Parser - Quoted fields and escaped quotes",
    parsedQuoted.success &&
    parsedQuoted.rows.length === 3 &&
    parsedQuoted.rows[0].name === "Smith, John" &&
    parsedQuoted.rows[2].name.includes('Escape "Quote" Test'),
    "Correctly parses commas inside quotes and escaped quotes without splitting fields."
  );

  // 7. Empty and oversized CSV handling
  const emptyCsv = "";
  const whitespaceCsv = "   \n\t  ";
  const parseEmpty = parseAndValidateCsv(emptyCsv);
  const parseWhitespace = parseAndValidateCsv(whitespaceCsv);

  recordTest(
    "Empty Upload Rejection",
    !parseEmpty.success && !parseWhitespace.success &&
    parseEmpty.globalErrors.length > 0,
    "Rejects empty or whitespace-only CSV uploads."
  );

  // Size limit simulation
  const dummyLargeCsv = "email\n" + "x".repeat(100);
  const sizeLimitedParse = parseAndValidateCsv(dummyLargeCsv, { maxSizeBytes: 50 });
  recordTest(
    "Oversized File Rejection",
    !sizeLimitedParse.success &&
    sizeLimitedParse.globalErrors[0].message.includes("exceeds maximum permitted limit"),
    "Enforces configurable file size limit and reports clear error."
  );

  // Row count limit simulation
  const fourRowsCsv = `email\na@test.com\nb@test.com\nc@test.com\nd@test.com`;
  const rowLimitedParse = parseAndValidateCsv(fourRowsCsv, { maxRowCount: 2 });
  recordTest(
    "Row Count Limit Rejection",
    !rowLimitedParse.success &&
    rowLimitedParse.globalErrors[0].message.includes("exceeds the maximum limit"),
    "Enforces configurable row count limits and halts processing."
  );

  // 8. Line numbering and comprehensive row errors
  const mixedCsv = `name,email,role,active
Valid One,valid1@test.com,member,true
Bad Email,not-an-email,member,true
Bad Role,valid2@test.com,superuser,true
Bad Active,valid3@test.com,member,yes
Intern Rejected,valid4@test.com,intern,true
Dup Row,valid1@test.com,member,true`;

  const mixedParsed = parseAndValidateCsv(mixedCsv);
  const row2 = mixedParsed.rows.find((r) => r.line === 3); // line 3 is row index 1
  const row3 = mixedParsed.rows.find((r) => r.line === 4);
  const row4 = mixedParsed.rows.find((r) => r.line === 5);
  const row5 = mixedParsed.rows.find((r) => r.line === 6);
  const row6 = mixedParsed.rows.find((r) => r.line === 7);

  recordTest(
    "Line Numbering & Granular Row Errors",
    row2?.status === "invalid" &&
    row3?.status === "invalid" &&
    row4?.status === "invalid" &&
    row5?.status === "invalid" &&
    row5?.errors.some((e) => e.field === "role" && e.message.includes('Invalid role "intern"')) &&
    row6?.status === "duplicate_in_file",
    "Accurately maps line numbers to errors, rejects intern role, and flags intra-file duplicates."
  );

  console.log("\n=== Parser Unit Tests Summary ===");
  const passed = reports.filter((r) => r.passed).length;
  const failed = reports.filter((r) => !r.passed).length;
  console.log(`Total: ${reports.length}, Passed: ${passed}, Failed: ${failed}`);

  if (failed > 0) {
    throw new Error(`${failed} parser unit test(s) failed.`);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runParserUnitTests();
}
