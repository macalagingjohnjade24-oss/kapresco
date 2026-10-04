# KAPRESCO WEBSITE — FIGMA TO FULLY FUNCTIONAL RESPONSIVE WEBSITE

I want you to develop a fully functional, responsive website based on my existing Figma design.

## FIGMA DESIGN

Figma file:

https://www.figma.com/design/Tn0nyP9sDPCoBdZcDMZPzN/Kapresco-Website?node-id=0-1&t=bjmYERLcfSF1eG08-1

The Figma design is the PRIMARY SOURCE OF TRUTH.

Your job is to convert the existing Figma design into a working website while preserving the design as accurately as possible.

---

# 1. MOST IMPORTANT REQUIREMENT — DO NOT REDESIGN THE WEBSITE

Do NOT create a completely different UI.

Do NOT replace my design with your own design.

Do NOT randomly change:

* colors
* typography
* spacing
* button shapes
* border radius
* card layouts
* navigation design
* images
* icons
* page structure
* section arrangement
* visual hierarchy

The developed website should look as close as possible to the Figma design.

Think of this as:

"Convert my Figma design into code."

NOT:

"Create a new website inspired by my Figma."

If something is unclear in the Figma design, make the smallest reasonable implementation decision while maintaining the existing visual style.

---

# 2. FIRST — INSPECT THE EXISTING PROJECT

Before changing or creating files:

1. Inspect the entire existing project.
2. Identify the current framework and technology stack.
3. Identify the existing folder structure.
4. Identify package.json and installed dependencies.
5. Identify existing components.
6. Identify existing assets.
7. Identify existing styles.
8. Determine which parts of the project already correspond to the Figma design.

Do not unnecessarily replace the existing project structure.

Reuse existing code when it is useful.

Only add or modify what is necessary.

---

# 3. FIGMA ANALYSIS

Carefully inspect the provided Figma design.

Identify:

* all pages/screens
* navigation
* hero sections
* buttons
* cards
* forms
* images
* icons
* typography
* colors
* spacing
* borders
* shadows
* footer
* responsive behavior
* interactive elements
* authentication screens
* sections that should navigate to other pages

Create an internal implementation map before coding.

Every major Figma section should have a corresponding implementation in the website.

---

# 4. WEBSITE SHOULD BE FULLY FUNCTIONAL

Although this is currently a frontend-only project, the website should behave like a real website.

Buttons should work.

Navigation should work.

Forms should work.

Links should work.

Menus should work.

Page navigation should work.

Interactive elements should provide appropriate feedback.

There should be no dead buttons unless they are intentionally decorative.

---

# 5. AUTHENTICATION — DEMO ONLY

IMPORTANT:

I am NOT using a database yet.

Do NOT create a database.

Do NOT require:

* MySQL
* PostgreSQL
* MongoDB
* Firebase
* Supabase
* authentication APIs
* backend authentication
* external authentication services

For now, authentication is ONLY for demonstrating the website UI and navigation.

However, the Login and Sign Up functionality must still work.

---

# 6. LOGIN FUNCTIONALITY

Keep the Login button exactly as represented in the Figma design.

When the user clicks Login:

* open the Login page/modal/form according to the Figma design
* display the login form
* preserve the Figma styling
* include the necessary fields shown in the design
* include the Login/Submit button

For this prototype:

THE USER SHOULD BE ABLE TO LOGIN EVEN IF ALL INPUT FIELDS ARE EMPTY.

For example:

User clicks:

"Login"

Then:

* do not require email
* do not require password
* do not show validation errors for empty fields
* simulate a successful login
* redirect the user to the appropriate main/home page
* show the website as if the user successfully logged in

This is intentional because this is currently only a frontend prototype.

---

# 7. SIGN UP / CREATE ACCOUNT FUNCTIONALITY

Keep the Sign Up / Create Account button exactly as represented in the Figma design.

When the user clicks it:

* open the Create Account / Sign Up page or modal
* preserve the Figma design
* display the appropriate form
* include all fields shown in the Figma design

For this prototype:

THE USER SHOULD BE ABLE TO CREATE AN ACCOUNT EVEN IF ALL INPUT FIELDS ARE EMPTY.

Do not require:

* name
* email
* password
* confirm password
* phone number
* or any other field

The Create Account button should simply simulate successful registration.

After clicking Create Account:

1. simulate account creation
2. show a successful state or message if the design allows it
3. redirect to the appropriate page
4. treat the user as logged in for the current browser session

Again, this is a DEMO authentication system only.

---

# 8. DEMO AUTHENTICATION STATE

Implement a simple frontend-only authentication state.

You may use:

* React state
* Context API
* localStorage
* sessionStorage

depending on the existing project structure.

Do NOT create a backend.

Example behavior:

Unauthenticated user:

Landing Page
↓
Login / Sign Up
↓
Successful Demo Authentication
↓
Home/Main Website

If the user refreshes the browser, maintain the demo login state if appropriate using localStorage or sessionStorage.

Include a Logout button if the Figma design contains one or if it is appropriate for the authenticated navigation.

Logout should simply clear the demo authentication state.

---

# 9. LANDING PAGE / AUTHENTICATION FLOW

The landing page should remain visually consistent with the Figma design.

The authentication flow should be:

LANDING PAGE
↓
Login OR Sign Up
↓
Authentication Form
↓
Successful Demo Authentication
↓
MAIN WEBSITE / HOME PAGE

Do not bypass the landing/authentication interface.

The Login and Sign Up buttons must remain visible and functional.

---

# 10. RESPONSIVE DESIGN — VERY IMPORTANT

The website MUST be fully responsive.

It should work properly on:

* large desktop monitors
* desktop
* laptop
* tablet
* iPad
* mobile phones
* small mobile phones
* narrow browser windows

The website should NEVER look broken when the browser is resized.

---

# 11. RESPONSIVE NAVIGATION

The desktop navigation should follow the Figma design.

On smaller screens:

The navigation should transform into a hamburger menu.

Example:

DESKTOP:

Logo | Home | About | Products | Contact | Login | Sign Up

MOBILE:

Logo                         ☰

When the hamburger icon is clicked:

display a mobile navigation menu containing the available navigation links.

The menu should:

* open smoothly
* close when the hamburger button is clicked again
* close after selecting a navigation item
* not cover important content unnecessarily
* remain visually consistent with the Figma design
* work correctly on both portrait and landscape mobile screens

Do NOT simply shrink the desktop navigation until it becomes unreadable.

Create an actual responsive mobile navigation.

---

# 12. RESPONSIVE BREAKPOINTS

Use sensible responsive breakpoints.

For example:

Desktop:
1200px+

Laptop:
992px – 1199px

Tablet:
768px – 991px

Mobile:
480px – 767px

Small mobile:
below 480px

You may adjust these values when necessary based on the actual Figma layout.

Do not force exact breakpoints if the design works better with fluid responsive behavior.

---

# 13. RESPONSIVE LAYOUT RULES

Use modern responsive techniques:

* CSS Flexbox
* CSS Grid
* max-width containers
* percentage-based widths
* min/max widths
* responsive typography
* CSS clamp() where appropriate
* responsive padding
* responsive margins
* responsive images
* media queries

Avoid excessive fixed pixel positioning.

Do NOT use absolute positioning for the entire website.

Absolute positioning should only be used where it is actually necessary to reproduce a design element.

---

# 14. RESPONSIVE IMAGES

Images should:

* maintain their aspect ratio
* not become stretched
* not overflow containers
* scale appropriately
* maintain the visual appearance of the Figma design

Use:

object-fit: cover

or

object-fit: contain

depending on the intended design.

---

# 15. TYPOGRAPHY

Typography should closely match the Figma design.

Identify:

* font family
* font weight
* font size
* line height
* letter spacing
* text alignment

Do not randomly replace the typography.

If the exact font is available, use it.

If the exact font is unavailable, choose the closest appropriate alternative.

Responsive typography should scale appropriately on smaller screens.

---

# 16. COLORS

Use the colors from the Figma design.

Create reusable CSS variables/design tokens when appropriate.

For example:

:root {
--primary-color: ...;
--secondary-color: ...;
--background-color: ...;
--text-color: ...;
}

Do not randomly change the color palette.

---

# 17. COMPONENTIZATION

If the project uses React or another component-based framework, create reusable components.

Examples:

* Navbar
* MobileMenu
* Button
* HeroSection
* SectionTitle
* ProductCard
* FeatureCard
* Footer
* LoginForm
* SignUpForm
* Modal
* etc.

Do not create unnecessary duplicated code.

Reusable components should maintain the exact visual appearance of the Figma design.

---

# 18. NAVIGATION

All navigation should work.

For example:

Home
About
Products/Services
Contact
Login
Sign Up

Use the appropriate routing solution based on the existing project.

If React Router is already installed, use it.

If another routing system already exists, use that instead.

Do not introduce unnecessary dependencies.

---

# 19. BUTTONS

Every important button should have an appropriate interaction.

Examples:

Login
→ Opens Login page/form

Sign Up
→ Opens Create Account page/form

Create Account
→ Simulates successful registration

Login
→ Simulates successful authentication

Navigation buttons
→ Navigate to the appropriate section/page

CTA buttons
→ Perform the intended action or navigate appropriately

Buttons should have:

* hover states
* active states where appropriate
* focus states
* disabled states only when necessary

Keep the styling consistent with Figma.

---

# 20. FORMS

The Login and Sign Up forms should visually match the Figma design.

Even though validation is disabled for this prototype, the form should still look realistic.

Include:

* labels
* inputs
* buttons
* icons if present
* password visibility toggle if present in Figma
* appropriate spacing
* responsive layout

The form should work on mobile.

Inputs should not overflow the screen.

---

# 21. DEMO SUCCESS BEHAVIOR

When Login is clicked:

Show the appropriate successful login behavior.

Example:

Login
↓
Demo authentication successful
↓
Navigate to Home

When Create Account is clicked:

Create Account
↓
Demo account created successfully
↓
Navigate to Home

Do NOT block these actions because fields are empty.

This is intentional.

---

# 22. ACCESSIBILITY

While maintaining the Figma design, implement basic accessibility.

Use:

* semantic HTML
* button elements for buttons
* proper labels for inputs
* alt text for meaningful images
* keyboard-accessible navigation
* visible focus states
* appropriate aria-labels for icon-only buttons such as the hamburger menu

The hamburger menu must be keyboard accessible.

---

# 23. MOBILE USABILITY

On mobile:

* no horizontal scrolling
* no content cut off
* buttons should remain tappable
* text should remain readable
* forms should fit within the viewport
* images should scale correctly
* cards should stack when necessary
* navigation should become a hamburger menu
* sections should maintain appropriate spacing

Test very narrow widths as well.

Especially test:

320px
360px
375px
390px
414px
480px

---

# 24. DESKTOP RESPONSIVENESS

Also test large screens.

The website should not become excessively stretched on very wide displays.

Use:

max-width containers

where appropriate.

The content should remain visually similar to the Figma design.

Test:

1366px
1440px
1920px
2560px

---

# 25. VISUAL FIDELITY

After implementation, compare the website against the Figma design.

Check:

* layout
* spacing
* typography
* colors
* buttons
* cards
* images
* navigation
* alignment
* border radius
* shadows
* section heights
* footer
* responsive behavior

If something looks different from the Figma design, fix the implementation instead of changing the Figma-inspired design.

The goal is HIGH VISUAL FIDELITY.

---

# 26. DO NOT OVERENGINEER

This is currently a frontend prototype.

Do NOT add:

* database
* backend server
* API
* payment system
* real authentication
* unnecessary libraries
* unnecessary dependencies
* complicated state management
* unnecessary architecture

Keep the implementation clean and easy to modify later.

The application should be structured so that a real backend/database can be added in the future.

---

# 27. FUTURE DATABASE COMPATIBILITY

Although there is no database now, structure the authentication code so it can later be replaced with real authentication.

For example:

authService.login()
authService.register()
authService.logout()

For now these functions can simply simulate successful authentication.

Later they can be connected to a real backend without completely rebuilding the UI.

---

# 28. ERROR HANDLING

The application should not crash if:

* a user resizes the browser
* a user opens a page directly
* an image is unavailable
* a navigation item is clicked
* the mobile menu is opened repeatedly
* the authentication form is submitted empty

Handle these situations gracefully.

---

# 29. CODE QUALITY

Write clean and maintainable code.

Follow the conventions of the existing project.

Use:

* meaningful component names
* meaningful variable names
* reusable components
* reusable styles
* clear file organization
* minimal duplication

Do not place the entire website into one giant component.

---

# 30. FINAL TESTING

Before considering the implementation complete, test the website at multiple screen sizes.

Desktop:
1920 × 1080

Laptop:
1366 × 768

Tablet:
768 × 1024

Mobile:
390 × 844

Small mobile:
320 × 568

Verify:

* no horizontal overflow
* navigation works
* hamburger menu works
* Login works
* Sign Up works
* empty forms can be submitted
* successful authentication navigation works
* buttons work
* links work
* images display correctly
* sections maintain their intended layout
* typography remains readable
* website does not break when browser width is reduced

---

# 31. IMPORTANT DEVELOPMENT RULE

Do NOT stop after creating a basic static version.

The final result should be a REAL WORKING FRONTEND WEBSITE.

It should be:

✓ Functional
✓ Responsive
✓ Interactive
✓ Visually faithful to Figma
✓ Mobile friendly
✓ Desktop friendly
✓ Authentication-demo ready
✓ Easy to connect to a database later
✓ Cleanly coded

---

# 32. FINAL INSTRUCTION

Start by inspecting the existing project and the Figma design.

Then implement the website systematically.

Do not immediately rewrite everything.

First understand the existing structure.

Then:

1. Identify the pages.
2. Identify the components.
3. Identify the assets.
4. Implement the desktop design.
5. Implement responsive behavior.
6. Implement mobile hamburger navigation.
7. Implement Login.
8. Implement Sign Up/Create Account.
9. Implement demo authentication.
10. Connect navigation.
11. Test all screen sizes.
12. Fix visual differences.
13. Fix responsiveness issues.
14. Run the application and verify that it works.

IMPORTANT:

The final website should feel like the Figma design has been directly converted into a real website.

Do not redesign it.

Do not simplify the design unnecessarily.

Do not remove sections.

Do not remove Login or Sign Up.

Do not require database credentials.

Do not require user input for demo authentication.

Prioritize Figma visual accuracy + responsive behavior + working interactions.
