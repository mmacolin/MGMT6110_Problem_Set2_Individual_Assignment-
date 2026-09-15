CountryLens — Product and Human–AI Collaboration Assessment

Student: Moeung Macolin
Course: MGMT6110 — Human–AI Collaboration
Assignment: Problem Set 2
Product: CountryLens

1. My product and the claim it makes

CountryLens is for a business student who wants to compare GDP per capita between two countries or economies for the same year. The first scope covered Cambodia, Singapore, Malaysia, Vietnam, and Indonesia, with years from 2020 to 2024. After reviewing the interface, I requested broader country coverage and clearer visual identification through flags. That expansion is a requested change; I have not yet recorded its final deployed coverage.

The main claim is that the displayed GDP-per-capita values belong to the selected countries and year. A convincing screen alone cannot support that claim. The values must come from the World Bank through my own back end, and I need to check that the application has read and displayed them correctly.

My three claim checks are:

My screen presents a GDP-per-capita value that began as illustrative demo data. To support it, the application must retrieve the relevant World Bank observation rather than retain a sample number.

My screen labels a value with a country and year. Those labels must match the country and date returned by the provider. A value from a different year is not an acceptable substitute for missing data.

A country comparison could be mistaken for a judgement about salaries, living costs, or where someone should study. GDP per capita alone does not support those conclusions. I chose to keep CountryLens as a comparison tool and require an explanation of the indicator's limits.

I manually opened the World Bank request for Singapore in 2023. The response in my screenshot identified NY.GDP.PCAP.CD and returned 86382.5900499252. This established that I could access a real provider response. It did not establish that CountryLens was correctly connected. The next check is whether the application displays the corresponding value as US$86,382.59 for that response, with the right country and year. Later provider revisions may change the value, so comparisons should use responses checked together.

2. Front-end self-assessment

For the front end, I assessed five areas: completing a comparison, preventing duplicate countries, clearing old results, country coverage, and mobile accessibility. The comparison criterion was partly met because the normal comparison worked, but I still need to check the country names, year, units, and values. Duplicate-country prevention was met: when I selected the same country twice, the app prevented comparison. Clearing old results was also met because the previous results disappeared when I changed selections, helping avoid confusion. Country coverage was partly met. I found the original list too limited and requested more countries, but I still need to search for countries outside the original five and verify the update. Mobile accessibility is not met yet because testing is incomplete. I need to check the app at 375px width and navigate with a keyboard. I also requested more colour and flags, although those visual changes alone do not prove accessibility.

3. Back-end self-assessment

For the back end, I assessed six areas: data accuracy, server-side requests, health information, failure handling, caching, and input validation. Data accuracy was partly met because I opened Singapore's 2023 World Bank response, but I still need to compare both countries' provider values with my API response and displayed results for the same year. Server-side requests are not met yet because verification is incomplete: I need to inspect browser requests, API files, repository history, and the .env* exclusion. World Bank does not require an API key. The health criterion is also not met yet because I have not recorded the /api/health response and checked its provider status and time. Failure handling is not met yet: I still need to test loading, empty, refused, and unreachable states, clearly identifying simulations. Caching is not met yet because I have not checked the requested 24-hour cache header or confirmed that errors are not cached. Input validation was partly met: the interface checks worked, but I still need to test invalid requests and changes during loading to ensure older responses cannot overwrite newer selections.

4. Assessment of the human–AI collaboration

Q1. Where did the agent make me faster, and by how much?

The most useful acceleration was turning my idea into a structured development plan and detailed implementation prompts. I did not initially know whether I should start with the front end, when to deploy, or where to place the assessment file. The assistant helped break the work into interface creation, review, visual improvements, back-end integration, and verification. At my current level, writing serverless functions and handling provider responses would require learning skills I could not yet confidently apply on my own. This was more than faster typing. I did not record start and finish times, so I cannot honestly claim an exact number of hours saved. The visible benefit was that I could spend attention on country coverage, presentation, and the meaning of the data. I also cannot claim that every part was faster: repeated explanations of the sequence took time.

Q2. Where did it cost me time, and whose fault was that?

A clear source of confusion was that the guidance moved ahead before I had a CountryLens project. I was told to prepare assessment material and discuss integration while I still needed to start the front end. I had to say explicitly that I had no project and ask the assistant to stay on the same page. The assistant had not checked my starting position carefully enough, while I had also not made my need for one action at a time explicit at the beginning. Once I clarified this, the guidance became easier to follow. I also first reported that the API link showed nothing, but the later screenshot showed a valid JSON response. That taught me to provide the exact screen instead of treating an unfamiliar response as proof that the service had failed.

Q3. Did the agent give me something that looked right but was not?

The numbered prompt sequence looked complete, but I later realised that it was not ready-made evidence for my submission. Prompt 7 contained spaces for my observations and decisions. When I asked for those sections to be filled in, the assistant needed my actual results first. I had been treating a well-written verification plan as closer to a completed verification record than it really was. This is the clearest supported example from my work so far; I have not yet identified a specific generated-code error through independent checking. I noticed the evidence gap when preparing the submission, but I did not record the elapsed time. My reported results then made the distinction clear: normal comparison and same-country prevention had been checked, while missing-data behaviour and /api/health had not.

Q4. What did I need to know to supervise it?

I needed to understand what the data actually meant. In the provider response, the country identifies Singapore, the date identifies 2023, and the numeric value is the GDP-per-capita observation. The fact that I fetched it today does not make it today's economic value. I asked whether this was a live API because that distinction was not initially clear to me. I also needed to understand that opening World Bank directly only tests the provider; it does not prove that my own back end calls it or displays its answer correctly. To catch errors I have not checked yet, I need to compare raw and displayed values, inspect my own endpoint, and recognise that null means missing rather than zero. Those are concrete supervision skills I still need to practise.

Q5. Which decisions did I keep, and should I have kept more or fewer?

I kept the choice of an individual project, selected CountryLens, removed Thailand from the original scope, and later requested broader country coverage. I also decided that the visual experience needed colour and flags. The agent supplied the implementation instructions for those choices. One decision I should have considered more explicitly was what happens when selections change. Clearing results was suggested in the prompts; when I observed the results disappear, I said I wanted to compare, showing that I had not fully worked through that interaction beforehand. Likewise, the four failure messages and the 24-hour cache were initially proposed by the assistant. Accepting those suggestions was not the same as independently designing them. I should retain the meaning of the messages, the treatment of missing data, and the scope of the comparison, while delegating routine component structure, formatting, and code generation. The expanded country catalogue also shows that my later requests changed the product scope, not just its appearance.

Q6. What would change with a team of thirty?

I would require a short decision record before development stating the user, source, indicator meaning, missing-data policy, cache duration, and failure messages. Each item would have a human owner. Before a change is merged and deployed, another person would compare a sample of provider data with the product, review the server boundary and credential handling, and inspect failure-state evidence. Agent-generated tests and human-run checks would be labelled separately. I would not let an agent silently decide that missing data should become zero, that another year is an acceptable substitute, or that GDP per capita supports a recommendation. Changes to those rules would need an explicit decision in the review. My own experience shows why: a detailed prompt can look like control even when no one has checked the result. In a team, that gap would multiply unless the review checks both the code and the decisions behind it.
