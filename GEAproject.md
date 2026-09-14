# Booking Flow

1. Select treatment
2. Select professional
3. Select date and time
5. Enter required information
6. Confirm appointment

# Components

## InfoLabels

Behavior:
- Values update according to the user's current booking selection.
- Component is read-only.

# Screens

## Select Treatment

Behavior:
- The selector switches between treatment categories.
- Only one treatment can be selected at a time.

## Select Professional

- Only one professional can be selected.

## Select Date

Behaviour:
- Only available dates can be selected.
- When a date is selected, the available time slots for that day are displayed.
- Only one date can be selected at a time.
- Only one time slot can be selected at a time.

## Customer Information

Behavior:
- User must enter their personal information before confirming the appointment.
- Required fields: First and last name, Email, WhatsApp / Phone
- The "Additional notes" field is optional.
- The selected service, professional, date and time are displayed as a summary before confirmation using “infoLabels” components
- The Confirm button should remain disabled until all required fields are valid.
