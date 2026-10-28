# Liya Bridal Studio — website starter

## Files
- `index.html` — page structure and sections
- `styles.css` — black/gold theme and responsive layouts
- `script.js` — mobile navigation, animations, before/after slider, product cart, guided appointment booking, five daily sample slots, custom package PDF and local appointment countdown.

## Run locally
1. Keep all three files in the same folder.
2. Open `index.html` in a browser, or use the VS Code Live Server extension.
3. Internet access is needed for Google Fonts and remote demo images.

## Guided booking flow
- Select a main service, then optionally add services to the package.
- Choose a future date and one of five daily sample slots.
- Slots marked booked are disabled; a selected slot is shown distinctly.
- Enter name and phone, review the estimated package, then confirm.
- The site saves the appointment in browser `localStorage`, shows a success message, and displays a live countdown on the landing page while the appointment is upcoming.
- Generate a custom appointment/package PDF through the browser print dialog (choose **Save as PDF**).
- The user can cancel the locally saved appointment; its slot is released in this browser.

## Critical limitations before publishing
This is a front-end demo, not a real salon booking backend:
- Appointment and slot data are saved only in the current browser/device. Other users and devices cannot see the bookings, so this cannot guarantee that a slot is free at the salon.
- To enable real shared availability, multiple customers, admin management and true booking confirmation, connect a backend/database and implement atomic slot reservation.
- Sample slots are illustrative: 10:00 AM, 11:30 AM, 1:00 PM, 2:30 PM and 4:00 PM. Confirm salon hours and actual appointment durations.
- Package prices shown in the booking assistant are illustrative estimates. Replace them with approved prices before publishing.
- The success message currently means “saved in this browser”, not confirmed by the studio.
- Product shop prices are also sample values; product order PDF is print-to-PDF and the WhatsApp shop feature requires the actual number.
- Set `WHATSAPP_NUMBER` in `script.js` to the salon's WhatsApp number with country code and digits only, e.g. `919876543210`.
- Replace demo photos, placeholder team names, testimonials and service details with verified, approved studio assets.
- Confirm salon address, opening hours and booking policy before launch.
