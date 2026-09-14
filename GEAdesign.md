# NAME— Design System

## Colors

- Primary: #BCA5C1
- Secondary: #291F2C
- Tertiary: #D8DFA4
- Background: #F0F1F4
- Surface: #DCD0DE
- Text Primary: #0A0A0A
- Text Secondary: #6B6B6B
- Error: #EF4444
- Warning: #F59E0B
- Success: #10B981

## Typography
Font Family: Inter

- H1: 28px / 600
- H2: 24px / 600
- H3: 18px / 600
- Body: 16px /400, line-height 18px
- Small: 14px / 400, line-height 16px

## Radius

- Cards: 8px
- Inputs: 12px
- Buttons: 12px
- Labels: 8px
- Dias: 12px
- Horarios: 12px

## Shadow

Card:

x: 1px
y: 2px
desenfocar: 4px
propagacion: 1px
rgba(0,0,0,0.3)

# Components

##Primary

### Button

States:
- Default
- Hover
- Selected
- Disabled

Height: 48px.
Gap: 8
Margin: 16, 12

Width adapts to content or fills its container depending on context.

### Input

States:
- Default
- Focus
- Success
- Error
- Disabled

Height: 48px.
Gap: 8
Margin horizontal: 12

Uses full available width.

### Service Card

Contains:
- Treatment
- Duration
- Price
- Description

Background: Surface.
Radius: 8px.
Uses Card shadow.

Responsive:
- Card adapts to available width.
- Description can wrap.
- Price remains aligned right.

### Professional Card

Contains:
- Professional image
- Name
- Specialty

Background: Surface.
Radius: 8px.
Uses Card shadow.

Responsive:
- Card adapts to available width.
- Height adapts to content.
- Image must crop rather than distort.

### Time Slot

States:
- Default
- Hover
- Selected
- Disabled

radius: 12px

### Calendar Day

States:
- Default
- Hover
- Selected
- Disabled

Radius: 12px

### StatePoints

States:
- Default
- Selected
- Completed

### InfoLabels

Purpose:
Displays key booking information as label/value pairs.

Contains:
- Date and time
- Professional
- Treatment
- Duration

Responsive:
- Text can wrap if necessary on small screens.
- Uses available container width.
- Height adapts to content.

# Layout

## Mobile

- Content uses the available screen width.
- Horizontal padding: 16px on small mobile screens, 20px on larger mobile screens.
- Cards adapt to the container width.
- Components must not be proportionally scaled.
- Section gap: 24px
- Component gap: 12px

## Desktop

- Content uses the available width up to a maximum of 1200px.
- Content is centered horizontally.
- Horizontal padding: 32px.

# Screens

## Select Treatment

Uses:
- Progress indicator
- treatment type selector
- Selectable Service Card

Layout:
- Single-column mobile layout.
- Progress indicator at the top.
- Elements stacked vertically.
- Treatment type selector spans the available width.
- Service cards appear one below another.
- Service cards displayed vertically with consistent spacing.

## Select Professional

Uses:
- Progress indicator
- Selectable Professional Card

Layout:
- Double-column mobile layout.
- Progress indicator at the top.
- Elements stacked vertically.
- Professional cards displayed vertically with consistent spacing

## Select Date

Uses:
- Calendar Day
- Time Slot

## Customer Information

Uses:
- Progress indicator
- Input
- Selection Summary
- Button

Layout:
- Single-column mobile layout.
- Form fields are stacked vertically.
- Appointment summary appears below the form fields.
- Primary confirmation button is placed at the bottom of the content flow.

## Confirmation

Shows:
- Confirmation message
- Cancellation code
- infoLabel component

# General Rules

- Use the defined components consistently.
- Do not stretch or distort images.
- Do not proportionally scale components for mobile.
- Components should adapt to their containers.
- Selected is a persistent selection state.
- Figma is the visual reference for the final implementation in /references
