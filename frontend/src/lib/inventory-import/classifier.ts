import type { CategoryConfidence } from "./types";

export interface ClassificationResult {
  category: string;
  confidence: CategoryConfidence;
  reason?: string;
}

/**
 * Known standard category presets based on existing inventory repository conventions
 * and source spreadsheet usage.
 */
export const STANDARD_INVENTORY_CATEGORIES = [
  "Pneumatics",
  "Stationery",
  "Tools",
  "Hardware",
  "Motors",
  "Motor Drivers",
  "Microcontrollers",
  "Sensors",
  "Displays",
  "Electronic Components",
  "Cables & Connectors",
  "Power Supplies",
  "Fasteners",
] as const;

/**
 * Deterministic category classification.
 * Prioritizes:
 * 1. Explicit categories provided in the spreadsheet row (preserves them).
 * 2. High-confidence deterministic keyword patterns across equipment name and notes.
 * 3. Ambiguous/uncertain items are left unassigned with confidence='unassigned' for admin review.
 */
export function classifyEquipmentCategory(
  name: string,
  existingCategory?: string,
  notes?: string
): ClassificationResult {
  // 1. If spreadsheet already has an explicit non-empty category, preserve it
  if (existingCategory && existingCategory.trim()) {
    return {
      category: existingCategory.trim(),
      confidence: "explicit",
      reason: "Preserved original category from spreadsheet row.",
    };
  }

  const combined = `${name} ${notes || ""}`.toLowerCase();

  // 2. High-confidence deterministic rules
  // Sensors
  if (
    /\b(sensor|sensors|mpu\s*6\d*|ultrasonic|water sensor|flex sensor|water level|load cell|image sensor|cmos|microphone|mic sensor|gyro|accelerometer|lidar)\b/i.test(
      combined
    )
  ) {
    return {
      category: "Sensors",
      confidence: "suggested",
      reason: "Matched sensor / telemetry instrument keyword.",
    };
  }

  // Microcontrollers / Development Boards
  if (
    /\b(arduino|mcu|micro\s*controller|stm32|esp32|esp8266|raspberry|cnc shield|development board|teensy|pic\d+)\b/i.test(
      combined
    )
  ) {
    return {
      category: "Microcontrollers",
      confidence: "suggested",
      reason: "Matched microcontroller / dev board architecture keyword.",
    };
  }

  // Motor Drivers / ESCs
  if (
    /\b(motor driver|cytron|l298n|tb6600|pwm driver|servo driver|esc\b|stepper driver|h-bridge)\b/i.test(
      combined
    )
  ) {
    return {
      category: "Motor Drivers",
      confidence: "suggested",
      reason: "Matched motor actuation driver / ESC module keyword.",
    };
  }

  // Motors & Servos
  if (
    /\b(motor|motors|servo|servos|mg90s|yellow jacket|brushless|stepper|bldc)\b/i.test(
      combined
    )
  ) {
    return {
      category: "Motors",
      confidence: "suggested",
      reason: "Matched mechatronics motor / servo actuator keyword.",
    };
  }

  // Displays
  if (/\b(display|displays|oled|lcd|screen|tft|nextion|e-ink)\b/i.test(combined)) {
    return {
      category: "Displays",
      confidence: "suggested",
      reason: "Matched visual display unit keyword.",
    };
  }

  // Power & Power Supplies
  if (
    /\b(batter(y|ies)|lipo|buck|boost|lm2596|tp\s*4056|voltage converter|signal converter|charging module|discharging|power distribution|dc-dc|converter module)\b/i.test(
      combined
    )
  ) {
    return {
      category: "Power Supplies",
      confidence: "suggested",
      reason: "Matched battery / DC voltage regulation keyword.",
    };
  }

  // Cables & Connectors
  if (
    /\b(cable|cables|wire|wires|jumper|connectors?|jack|header|plug|ttl to rs|usb|ethernet|lan module|dupont)\b/i.test(
      combined
    )
  ) {
    return {
      category: "Cables & Connectors",
      confidence: "suggested",
      reason: "Matched wiring / interconnect / bus converter keyword.",
    };
  }

  // Electronic Components
  if (
    /\b(capacitors?|resistors?|leds?|switch|switches|buzzer|potentiometer|relay|breadboard|ic\b|heat sink|encoder|diode|transistor|optocoupler)\b/i.test(
      combined
    )
  ) {
    return {
      category: "Electronic Components",
      confidence: "suggested",
      reason: "Matched discrete passive or active electronic component keyword.",
    };
  }

  // Pneumatics
  if (
    /\b(pneumatic|pneumatics|valve|cylinder|tube|tubing|fitting|fittings|compressor|pressure gauge|solenoid)\b/i.test(
      combined
    )
  ) {
    return {
      category: "Pneumatics",
      confidence: "suggested",
      reason: "Matched fluid / pneumatic hardware keyword.",
    };
  }

  // Tools & Fabrication
  if (
    /\b(cutter|pliers?|stripper|soldering|iron|multimeter|screwdriver|saw|drill|wrench|spanner|hex key|allen key|tape|tweezers)\b/i.test(
      combined
    )
  ) {
    return {
      category: "Tools",
      confidence: "suggested",
      reason: "Matched hand / benchtop tool keyword.",
    };
  }

  // Mechanical Hardware & Fasteners
  if (
    /\b(bracket|bearing|holder|standoff|screw|screws|nut|nuts|bolt|bolts|fasteners?|spacer|washer|fan\b|chassis|wheel|pulley)\b/i.test(
      combined
    )
  ) {
    return {
      category: "Hardware",
      confidence: "suggested",
      reason: "Matched structural mechanical hardware keyword.",
    };
  }

  // 3. Ambiguous / uncertain - leave unassigned for explicit human review
  return {
    category: "",
    confidence: "unassigned",
    reason: "No unambiguous deterministic keyword match found; left for manual admin review.",
  };
}
