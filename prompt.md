Prompt 1: Build the CountryLens Front-End Prototype

ROLE
You are a front-end developer building a new React application.

GOAL
Create CountryLens: a one-screen tool for a business student who wants
to compare GDP per capita between two countries for the same year.

This is a NEW, separate project. Do not modify HawkerHunt.

Build the FRONT END ONLY for now. We will connect a World Bank API
through our own back end in a later step.

FUNCTIONAL REQUIREMENTS

1. Header
- App name: CountryLens
- Subtitle: “Compare GDP per capita across five Southeast Asian countries.”
- Visible badge: “Prototype · Demo data”

2. Comparison controls
- Country A dropdown.
- Country B dropdown.
- Available countries ONLY:
  Cambodia (KH)
  Singapore (SG)
  Malaysia (MY)
  Vietnam (VN)
  Indonesia (ID)
- Do not include Thailand.
- Year dropdown: 2020, 2021, 2022, 2023, 2024.
- Default selections: Cambodia, Singapore, 2023.
- Button: “Compare countries”.
- If both countries are the same, disable comparison and show:
  “Choose two different countries.”

3. Initial state
- Before the first comparison, show:
  “Choose two countries and a year, then select Compare countries.”
- Do not display results until the user clicks Compare.

4. Results
- Show two comparison cards side by side on desktop and stacked on mobile.
- Each card must display:
  Country name
  “GDP per capita”
  Selected year
  Value formatted in US dollars with commas and two decimal places
  “Illustrative demo value — not verified World Bank data”
- Both cards must use the same selected year.
- If selections change, clear the previous results and ask the user
  to compare again so old results cannot appear under new selections.
- Do not add rankings, recommendations, or “best country” labels.

5. Demo data
- Store all sample records in one separate file: src/data/demoData.js.
- Include records for all five countries across all five years.
- Use clearly fictional placeholder values.
- Set one record to null to demonstrate missing data, and identify
  that record in your completion summary.
- A null or missing value must display “Data unavailable”, never $0.
- Never describe these values as real, current, verified, or live.
- Do not make any external API calls.

6. Demonstration states
Add a small, clearly labelled “Prototype testing” dropdown:
- Normal
- Empty
- Provider refused
- Unreachable

When Compare is clicked, first show:
“Loading comparison data…”

Then show the selected demonstration state:
- Normal: display the demo results.
- Empty:
  “No data is available for this comparison. Try another year.”
- Provider refused:
  “The data provider rejected this request. Please try again later.”
- Unreachable:
  “We couldn’t reach the data provider. Please retry shortly.”

These are simulated states, not actual network requests.
Explain this beside the testing dropdown.
Ensure the button becomes usable again after every state.
Do not leave stale results visible during loading or errors.

7. Explanation and transparency
Include a short explanation:
“GDP per capita is GDP divided by population. It is not average salary,
living cost, or a measure of education quality.”

Include:
“CountryLens currently uses illustrative demo data.
World Bank integration will be added in the next development stage.”

Add a link labelled “About the intended World Bank indicator”:
https://data.worldbank.org/indicator/NY.GDP.PCAP.CD

Do not show a fake source-update date or pretend a fetch occurred.

DESIGN
- Clean, professional academic dashboard.
- Warm off-white background, dark navy headings, teal accent.
- Clear typography, generous spacing, subtle borders.
- Accessible contrast and visible keyboard focus.
- Proper labels for every dropdown.
- Announce loading and result messages accessibly.
- No horizontal scrolling at 375px screen width.
- One screen only. No sidebar, extra pages, or decorative statistics.

GUARDRAILS
- React front end only.
- No back end, database, login, API keys, chatbot, or model calls.
- No API requests and no additional countries or indicators.
- Use the existing scaffold’s dependencies where possible.
- Keep the code simple and easy to connect to /api/countries later.
- Do not create fake prompt histories, test evidence, or self-assessment marks.

OUTPUT
Build the working front-end prototype.
After finishing, briefly list:
1. The files created.
2. How to test a normal comparison.
3. Which record demonstrates missing data.
4. How to test each simulated failure.
5. Anything not yet implemented.

Prompt 2: Review and Fix Front-End Functionality

Review and refine the existing CountryLens front end. Do not rebuild
the project or add a back end yet.

Keep the current design and one-screen scope. Inspect the code first,
then fix only requirements that are missing or incorrect.

CHECK AND FIX

1. Country and year selections
- Include only Cambodia, Singapore, Malaysia, Vietnam, and Indonesia.
- Do not include Thailand.
- Keep 2020–2024.
- Prevent comparing a country with itself and explain why.
- If either country or the year changes, clear previous results.
- Both result cards must always match the submitted countries and year.

2. Honest data display
- Keep the “Prototype · Demo data” badge visible.
- Label every displayed number as an illustrative demo value.
- Missing or null values must display “Data unavailable”, never $0.
- Do not label GDP per capita as salary or living cost.
- Do not show fake source-update dates or imply World Bank is connected.

3. User states
- Confirm the initial, loading, normal, empty, provider-refused,
  and unreachable states all work.
- Clearly label failure demonstrations as simulated.
- Hide previous results during loading and errors.
- Re-enable the Compare button after loading completes.
- Prevent rapid repeated clicks from producing outdated results.

4. Mobile and accessibility
- At 375px width, stack comparison cards vertically.
- No horizontal scrolling or clipped text.
- Give every dropdown a visible label.
- Make all controls usable with a keyboard and show focus indicators.
- Announce loading, results, and errors to screen readers.

GUARDRAILS
- Front end only: no API calls, back end, database, login, or chatbot.
- Keep all demo records in src/data/demoData.js.
- Do not add features, countries, indicators, or unnecessary packages.
- Preserve working features and the current visual style.
- Do not write assessment marks or invent testing evidence.

AFTER THE CHANGES
Provide a short summary:
- What you found.
- What you changed, or what already met the requirements.
- What you actually tested and the observed results.
- What you could not test.

Give me a short manual checklist to verify the app myself.
Do not claim browser testing unless you actually performed it.

Prompt 3: Improve UI Design and User Experience

Improve the UI and UX of the existing CountryLens front end.
Refine the current application; do not rebuild it or change its scope.

DESIGN DIRECTION
Create a polished, approachable academic dashboard:
- Warm off-white background: #F7F8FA.
- White cards with subtle borders and restrained shadows.
- Dark navy headings: #142D4E.
- Teal primary buttons: #0F766E, with white text.
- Clear typography, consistent spacing, and gently rounded corners.
- Avoid gradients, oversized hero sections, decorative statistics,
  and unnecessary animation.

LAYOUT
1. Compact header
- CountryLens title and a short explanation.
- Keep “Prototype · Demo data” clearly visible.

2. Comparison panel
- Clearly label Country A, Country B, and Year.
- Arrange controls in one row on desktop and stack them on mobile.
- Make “Compare countries” the clear primary action.
- Keep the controls easy to reach without a large introductory section.

3. Results
- Display two equally prominent cards side by side on desktop.
- Stack cards on mobile.
- Emphasise country names and formatted values.
- Clearly show the selected year and “GDP per capita · current US$”.
- Keep the illustrative-demo-value disclaimer readable.
- Missing data must remain “Data unavailable”, never zero.

4. Supporting information
- Place the GDP-per-capita explanation below the results.
- Keep the intended World Bank source link and integration disclaimer.
- Put the existing prototype-testing controls in a compact expandable
  section labelled “Demo testing — simulated states”.
- Keep these controls accessible; do not remove them.

USER EXPERIENCE
- Preserve the initial guidance before a comparison.
- Prevent same-country comparisons with a nearby explanation.
- Clear old results when selections change.
- During loading, show a written status and disable repeated submission.
- Preserve distinct empty, refused, and unreachable messages.
- Keep selections after errors so the user can retry easily.
- Avoid layout jumps when loading or showing messages.

ACCESSIBILITY AND MOBILE
- No horizontal scrolling at 375px width.
- Use readable body text, ideally 16px.
- Provide comfortably sized touch targets.
- Maintain accessible text contrast and visible keyboard focus.
- Use semantic labels and accessible status announcements.
- Do not communicate errors using colour alone.
- Respect reduced-motion preferences.

GUARDRAILS
- Keep one screen and the existing five countries:
  Cambodia, Singapore, Malaysia, Vietnam, and Indonesia.
- Keep years 2020–2024 and GDP per capita as the only indicator.
- No back end, API calls, login, chatbot, or new features.
- Preserve demo data and all working validation and state behaviour.
- Do not imply the data is live or verified.
- Do not add unnecessary dependencies.

After editing, summarise the UI/UX changes and any checks actually
performed. Clearly distinguish tested behaviour from untested behaviour.

Prompt4: 

ROLE: You are a senior full-stack developer working in my existing
CountryLens project. Do not rewrite what is already there; add to it.

GOAL: My screen initially showed GDP per capita for two selected
countries and a selected year as hard-coded demo values. Replace any
remaining demo values with real data from World Bank World Development
Indicators, fetched through a serverless function of my own. Preserve
any real-data integration that already works.

1) api/countries.js—calls this endpoint for each selected country:
   https://api.worldbank.org/v2/country/SG/indicator/NY.GDP.PCAP.CD?date=2023&format=json

   Replace SG and 2023 with validated country and year selections.
   Accept countryA, countryB, and year. Preserve the existing supported
   country list and years 2020–2024. Reject invalid inputs and identical
   countries with HTTP 400. Return only the fields my screen needs.

2) api/health.js—reports whether the upstream answered, including its
   actual HTTP status and checkedAt. World Bank requires no credential,
   so return keyRequired:false and keyConfigured:null with an explanation
   that a key is not required. Never invent or print a credential.

3) On the screen, replace remaining hard-coded values with fetched data.
   Use four different sentences:
   Loading: “Fetching World Bank data for your comparison…”
   Empty: “Data unavailable for this year. Try another year.”
   Refused: “The data provider rejected this request. Try again later.”
   Unreachable: “We couldn’t reach World Bank. Please retry.”

OUTPUT: Both functions at api/ in the PROJECT ROOT, siblings of
package.json, never inside src/. If this project has a server entry
file, register the same two routes there too, because that is the shape
the preview can answer. If it has no server file, skip that and tell me
rather than inventing one.

Make sure package.json contains "type": "module".
Make sure .gitignore contains .env*.

BEFORE the fetch, validate the inputs and set a request timeout.
The template’s missing-credential check is not applicable because
World Bank requires no credential. Do not add a fake environment
variable or block requests because no key is configured.

AFTER the fetch, check response.ok before reading the body.
A refusal may have an empty body, so do not assume it contains JSON.
On a non-2xx reply, return the upstream HTTP status and a one-line
reason in your own JSON, including upstreamStatus.
Handle timeouts, unreachable services, and malformed responses clearly.

Verify the returned country, indicator, and year.
Preserve missing or null values as “Data unavailable”, never zero.
If only one country has data, display that value and mark the other
unavailable. Never substitute another year or fall back to demo numbers.

Cache successful responses for 24 hours with:
Cache-Control: s-maxage=86400, stale-while-revalidate=172800

This is a refresh policy chosen for annual observations, not a claim
that the source updates daily. Do not cache error responses.

In the footer, credit World Bank World Development Indicators in the
form required by the provider’s applicable licence, and link to:
https://data.worldbank.org/indicator/NY.GDP.PCAP.CD

Verify the attribution requirements; report if you cannot check them.
Show the observation year and USD units. Distinguish the observation
year from retrieval time. Do not call annual data “real-time”.

GUARDRAILS: Never write a credential into any file, comment or README.
Never create a variable whose name starts with VITE_. Never call the
upstream from browser code; every provider call happens inside api/.
Never print a credential, or any part of it, in a response or log.
No new npm packages. No database, no login, and no model calls.
Leave every existing screen working, apart from the requested data
replacement and state handling. Preserve the current country coverage.
Do not claim tests, deployment, or human verification not performed.

CONTEXT: CountryLens is deployed on Vercel from GitHub:
https://countrylens-ecru.vercel.app/

No credential environment variable is required for World Bank.
A real response from the Singapore 2023 endpoint, previously opened
by hand in my browser, looked like this:

[
  {
    "page": 1,
    "pages": 1,
    "per_page": 50,
    "total": 1,
    "sourceid": "2",
    "lastupdated": "2026-07-13"
  },
  [
    {
      "indicator": {
        "id": "NY.GDP.PCAP.CD",
        "value": "GDP per capita (current US$)"
      },
      "country": {"id": "SG", "value": "Singapore"},
      "countryiso3code": "SGP",
      "date": "2023",
      "value": 86382.5900499252,
      "unit": "",
      "obs_status": "",
      "decimal": 1
    }
  ]
]

Prompt 5: Prepare My Human Verification Checklist

Inspect the current CountryLens implementation and help me verify it
myself. Do not modify the app yet.

Prepare six numbered manual tests covering:
1. Comparing two different countries for the same year.
2. Preventing same-country comparisons.
3. Clearing old results when selections change.
4. Showing missing data without converting it to zero.
5. Mobile layout and keyboard navigation.
6. Clear year, currency, source, and data limitations.

For each test, provide:
- Exact actions I should perform.
- Expected behaviour based on our agreed requirements.
- Evidence I should record.
- A blank space for my actual observation and verdict.

Identify which tests I can run in the preview and which require the
deployed Vercel app. Explain any missing-data test that needs a
controlled simulation, and clearly distinguish simulation from a
real provider response.

Do not fill in my observations, claim that I passed the tests,
or write assessment marks. Wait for my results before making changes.

Prompt 6: Verify the Real Data and Back End

Help me independently verify CountryLens's deployed World Bank
integration. Do not change code yet.

My deployed URL is:
https://countrylens-ecru.vercel.app/

Provide step-by-step checks for:
1. Opening /api/health and interpreting each field, including the
   fact that this provider does not require an API key.
2. Opening our /api/countries endpoint for Cambodia and Singapore
   in 2023.
3. Opening the direct World Bank requests for the same countries,
   indicator, and year.
4. Comparing each raw provider value with our endpoint and the
   displayed value, allowing only the intended display rounding.
5. Using the browser Network panel to confirm the front end calls
   our own API route rather than the World Bank directly.
6. Checking the caching header on our data endpoint.

Give the exact URLs based on the actual implementation, not guessed
parameter names.

Provide a blank comparison table for me to record country, year,
provider value, our endpoint value, displayed value, and verdict.

Explain how to test empty, refused, and unreachable states safely.
If controlled simulations are needed, propose them for my approval
first. Do not alter the live app, overload the provider, or add public
failure switches.

Do not claim that I verified anything. Wait for my observations.

Make targeted improvements to my existing CountryLens application.

Live URL: https://countrylens-ecru.vercel.app/

1. MY HUMAN OBSERVATIONS

- The normal comparison appeared to work during my review.
  I have not yet independently verified the displayed values against
  World Bank.
- Selecting the same country twice was correctly prevented.
- The country selection feels too limited.
- Previous results disappear when I change selections.
- I want a more colourful interface with country flags.
- I have not yet tested missing-data or service-failure behaviour.
- I have not yet checked /api/health.

Do not describe untested features as verified.

2. MY DECISIONS

- Expand selection to individual countries and economies available
  through the World Bank catalogue, excluding Thailand.
- Improve the visual design with accessible colour and country flags.
- Preserve the one-screen, two-country comparison.
- Preserve same-country validation.
- Keep clearing results when selections change for now.
- Keep GDP per capita, current US$, as the only indicator.
- Change the years 1950–2025, if the data is available.

Inspect the existing code before editing. If a cause or requirement
is uncertain, propose one diagnostic check or ask me before proceeding.

3. EXPAND COUNTRY COVERAGE

Replace the fixed country list with a searchable selection populated
from the World Bank country catalogue.

- Create api/country-list.js at the project root beside package.json.
- Fetch the catalogue server-side.
- Inspect the actual provider response before implementing its parser.
  If you cannot retrieve it, ask me for the response rather than guessing.
- Handle pagination so the list is complete.
- Include individual countries and economies, except Thailand.
- Exclude regional aggregates, income groups, and other aggregate
  entries using provider metadata rather than a hand-maintained list.
- Label the controls “Country/economy A” and “Country/economy B”.
- Sort options alphabetically and support searching by name.
- Default to Cambodia and Singapore.
- Prevent selecting the same country/economy twice.
- Make search and selection usable with a keyboard and on mobile.

Update the comparison back end to validate selections against the
supported catalogue instead of the previous fixed-country whitelist.
Keep provider URLs fixed in code and accept only validated country codes.
Use consistent country-code mapping across the catalogue and comparisons.

Cache successful catalogue responses for 24 hours.
Provide clear loading and failure messages with a retry option.
Do not silently fall back to the old limited list.

Catalogue membership does not guarantee GDP-per-capita data exists
for every year. Display “Data unavailable” when appropriate.
Never invent values, convert missing data to zero, or substitute a year.

4. IMPROVE THE VISUAL DESIGN

Preserve the current layout while making the interface more engaging.

- Add flags beside country names in results and selection options
  where reliably supported.
- Use bundled flag assets or flag emoji; do not add an external flag API.
- Use a neutral fallback where no suitable flag is available.
- Always retain readable country names.
- Give Country A and Country B distinct, accessible accent colours,
  used consistently in their controls and result cards.
- Improve button hover, keyboard-focus, selected, and loading states.
- Maintain readable contrast, clear labels, and comfortable touch targets.
- Stack result cards on mobile without horizontal scrolling.
- Avoid unnecessary animation and respect reduced-motion preferences.
- Keep year, USD units, World Bank attribution, and indicator limitations
  clearly visible.
- Do not describe GDP per capita as average salary or living cost.

5. PRESERVE COMPARISON BEHAVIOUR

- Compare exactly two countries/economies for the same selected year.
- Clear old results when selections change.
- Prevent outdated requests from overwriting newer selections.
- Keep selections after errors so users can retry.
- Preserve distinct loading, empty, refused, and unreachable messages.
- If only one value is missing, display the available result and show
  “Data unavailable” for the other.
- Never fall back to demo numbers when a real request fails.

6. PREPARE FAILURE-STATE VERIFICATION

Inspect existing test facilities first and explain how I can test:

- Missing data for one country.
- Missing data for both countries.
- Provider refusal.
- Provider being unreachable.
- Country-catalogue retrieval failure.

If simulation is necessary, use a development-only approach with
real API behaviour as the default.

Do not expose simulation controls or failure switches in production.
Do not deliberately break the live provider endpoint.
Label simulated tests honestly and provide exact steps to restore
normal behaviour.

Do not claim that I ran or passed these tests.

7. INSPECT THE HEALTH ENDPOINT

Inspect api/health.js and explain its response fields.

The World Bank API requires no key; report that honestly.

The deployed health address is:
https://countrylens-ecru.vercel.app/api/health

Distinguish code inspection from live verification.
Do not claim the deployed endpoint works unless you actually access
and inspect it. Explain any checks I still need to perform myself.

8. TECHNICAL GUARDRAILS

- Keep serverless functions in root-level api/, not inside src/.
- Keep World Bank calls server-side.
- Preserve request validation, timeouts, response checks, and caching.
- Do not cache error responses.
- No database, login, chatbot, predictions, or country recommendations.
- No additional indicators, years, or comparison cards.
- Avoid unnecessary dependencies and unrelated refactoring.
- Preserve working features.
- Do not invent observations, human approval, or assessment marks.

9. REPORT CHANGES AND HAND BACK FOR HUMAN REVIEW

After editing:

- List each change and the observation or decision that justified it.
- Explain how catalogue entries were included or excluded.
- List checks actually performed and their observed results.
- Separate those checks from tests I still need to run.
- Identify unresolved issues or limitations.
- Provide a short numbered manual retest checklist.
- Confirm temporary test overrides are not active in production.
- Explain which changes need pushing to GitHub and redeploying on Vercel.

Prompt 7: Expand Country Coverage and Improve UI Based on Human Review


Do not claim completion of deployment or human verification unless
those actions have actually occurred.

Make targeted improvements to my existing CountryLens application.
Live URL: https://countrylens-ecru.vercel.app/

1. MY HUMAN OBSERVATIONS

- The normal comparison appeared to work during my review.
  I have not yet independently verified the displayed values against
  World Bank.
- Selecting the same country twice was correctly prevented.
- The country selection feels too limited.
- Previous results disappear when I change selections.
- I want a more colourful interface with country flags.
- I have not yet tested missing-data or service-failure behaviour.
- I have not yet checked /api/health.

Do not describe untested features as verified.

2. MY DECISIONS

- Expand selection to individual countries and economies available
  through the World Bank catalogue, excluding Thailand.
- Improve the visual design with accessible colour and country flags.
- Preserve the one-screen, two-country comparison.
- Preserve same-country validation.
- Keep clearing results when selections change for now.
- Keep GDP per capita, current US$, as the only indicator.
- Keep years 2020–2024.

Inspect the existing code before editing. If a cause or requirement
is uncertain, propose one diagnostic check or ask me before proceeding.

3. EXPAND COUNTRY COVERAGE

Replace the fixed country list with a searchable selection populated
from the World Bank country catalogue.

- Create api/country-list.js at the project root beside package.json.
- Fetch the catalogue server-side.
- Inspect the actual provider response before implementing its parser.
  If you cannot retrieve it, ask me for the response rather than guessing.
- Handle pagination so the list is complete.
- Include individual countries and economies, except Thailand.
- Exclude regional aggregates, income groups, and other aggregate
  entries using provider metadata rather than a hand-maintained list.
- Label the controls “Country/economy A” and “Country/economy B”.
- Sort options alphabetically and support searching by name.
- Default to Cambodia and Singapore.
- Prevent selecting the same country/economy twice.
- Make search and selection usable with a keyboard and on mobile.

Update the comparison back end to validate selections against the
supported catalogue instead of the previous fixed-country whitelist.
Keep provider URLs fixed in code and accept only validated country codes.
Use consistent country-code mapping across the catalogue and comparisons.

Cache successful catalogue responses for 24 hours.
Provide clear loading and failure messages with a retry option.
Do not silently fall back to the old limited list.

Catalogue membership does not guarantee GDP-per-capita data exists
for every year. Display “Data unavailable” when appropriate.
Never invent values, convert missing data to zero, or substitute a year.

4. IMPROVE THE VISUAL DESIGN

Preserve the current layout while making the interface more engaging.

- Add flags beside country names in results and selection options
  where reliably supported.
- Use bundled flag assets or flag emoji; do not add an external flag API.
- Use a neutral fallback where no suitable flag is available.
- Always retain readable country names.
- Give Country A and Country B distinct, accessible accent colours,
  used consistently in their controls and result cards.
- Improve button hover, keyboard-focus, selected, and loading states.
- Maintain readable contrast, clear labels, and comfortable touch targets.
- Stack result cards on mobile without horizontal scrolling.
- Avoid unnecessary animation and respect reduced-motion preferences.
- Keep year, USD units, World Bank attribution, and indicator limitations
  clearly visible.
- Do not describe GDP per capita as average salary or living cost.

5. PRESERVE COMPARISON BEHAVIOUR

- Compare exactly two countries/economies for the same selected year.
- Clear old results when selections change.
- Prevent outdated requests from overwriting newer selections.
- Keep selections after errors so users can retry.
- Preserve distinct loading, empty, refused, and unreachable messages.
- If only one value is missing, display the available result and show
  “Data unavailable” for the other.
- Never fall back to demo numbers when a real request fails.

6. PREPARE FAILURE-STATE VERIFICATION

Inspect existing test facilities first and explain how I can test:

- Missing data for one country.
- Missing data for both countries.
- Provider refusal.
- Provider being unreachable.
- Country-catalogue retrieval failure.

If simulation is necessary, use a development-only approach with
real API behaviour as the default.

Do not expose simulation controls or failure switches in production.
Do not deliberately break the live provider endpoint.
Label simulated tests honestly and provide exact steps to restore
normal behaviour.

Do not claim that I ran or passed these tests.

7. INSPECT THE HEALTH ENDPOINT

Inspect api/health.js and explain its response fields.

The World Bank API requires no key; report that honestly.

The deployed health address is:
https://countrylens-ecru.vercel.app/api/health

Distinguish code inspection from live verification.
Do not claim the deployed endpoint works unless you actually access
and inspect it. Explain any checks I still need to perform myself.

8. TECHNICAL GUARDRAILS

- Keep serverless functions in root-level api/, not inside src/.
- Keep World Bank calls server-side.
- Preserve request validation, timeouts, response checks, and caching.
- Do not cache error responses.
- No database, login, chatbot, predictions, or country recommendations.
- No additional indicators, years, or comparison cards.
- Avoid unnecessary dependencies and unrelated refactoring.
- Preserve working features.
- Do not invent observations, human approval, or assessment marks.

9. REPORT CHANGES AND HAND BACK FOR HUMAN REVIEW

After editing:

- List each change and the observation or decision that justified it.
- Explain how catalogue entries were included or excluded.
- List checks actually performed and their observed results.
- Separate those checks from tests I still need to run.
- Identify unresolved issues or limitations.
- Provide a short numbered manual retest checklist.
- Confirm temporary test overrides are not active in production.
- Explain which changes need pushing to GitHub and redeploying on Vercel.
