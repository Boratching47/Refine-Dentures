# Dental animated site, part 1

An Apple-style scrolling landing page for a demo denture clinic ("Brightside Dentures").
The goal of the site is to **build trust and turn visitors into calls and enquiries**.

## Page structure
1. **Hero**: clear offer, Book / Call buttons, trust bar (rating, experience, free consult, payment plans)
2. **Pinned statement**: "Look natural. Feel secure. Smile again."
3. **Denture showcase**: photo starts enlarged, shrinks to the side, then four features pop out one by one with numbered hotspots. Click "Enlarge" to view the photo full size.
4. **Why us**: comparison against a standard denture, plus count-up stats
5. **Services**: full, partial, implant-retained, repairs and relines
6. **Your journey**: five steps from free consult to aftercare (horizontal scroll on desktop)
7. **Reviews**: placeholders for real Google reviews
8. **FAQ**: common questions, one open at a time
9. **Contact**: big phone number, hours, address and an enquiry form
10. **Mobile call bar**: Call / Free consult always one tap away on phones

## Files
- `index.html`: page content
- `style.css`: all styling (colours are in `:root` at the top)
- `script.js`: all animation and interaction code
- `images/denture.svg`: placeholder illustration, replace with a real photo

## Before going live
- Replace everything in [square brackets], the phone number, address, email, stats and reviews with real details
- Swap `images/denture.svg` for a real photo and move the `--x` / `--y` hotspot positions in `index.html` to match
- Confirm the comparison claims with the clinic

## Built with
- [GSAP](https://gsap.com/) + ScrollTrigger for scroll animations
- [Lenis](https://lenis.darkroom.engineering/) for smooth scrolling
- Inter font from Google Fonts

## Moving to WordPress
- Paste the `<body>` content of `index.html` into a Custom HTML block (or your theme template)
- Add `style.css` via Appearance > Customize > Additional CSS, or enqueue it in your theme
- Enqueue GSAP, ScrollTrigger and Lenis first, then `script.js` in the footer with those as dependencies
- Replace the demo form with a WPForms or Contact Form 7 shortcode so enquiries actually get emailed
