# ANCHOR project website

A static research website based on the original ANCHOR_project_website page structure, rebuilt for the ANCHOR benchmark. No package installation or build is required. Open index.html directly, or serve this folder with any static web server (for example, `python3 -m http.server 8765`). It can be hosted on GitHub Pages.

## Files
- index.html: content, authors, affiliation mapping, document links, citation.
- styles.css: responsive design and reduced-motion support.
- app.js: taxonomy, frame walkthrough, result tables, citation copying, and viewport-aware motion.
- assets/: original paper and supplement, five frame crops from Figure 1, favicon.
- static/: retained original template assets; the new page does not load them.

## Content sources and editorial decisions
- User supplied the venue (NeurIPS 2026, Evaluations & Datasets Track), author names/order, and George Z Wei's CMU Robotics Institute affiliation.
- The venue appears as a compact hero label, a small header mark, and page metadata.
- Other affiliations follow https://beamv2-eccv-workshop.github.io/#organizers (accessed October 1, 2026). Liuyue Xie is listed there as Louise Xie. Joel Julin and Souraja Kundu are marked as equal-contribution, co-first authors, as confirmed by the user. No corresponding-author designation has been inferred.
- Main paper Section 3: 2,319 videos, 8,272 QA pairs, approximately 207 hours; human-refined subset of 224 videos and 975 QA pairs; nine source datasets; 26 annotation-study participants.
- Taxonomy values and all 19 category-domain pairs come from Supplementary Table 3 (page 11). The main paper Figure 2 legend contains conflicting counts, so it is not used as the numeric source. Top-level shares sum to 100%; rounded joint shares may differ from their parent totals.
- Sunburst arc sizes are schematic, not proportional. This is explicitly labeled on the page so rare categories stay usable without misrepresenting their prevalence. Detail descriptions paraphrase the taxonomy definitions and explain content domains; they are not additional dataset labels or measured findings.
- Figure 1 supplies all five frames and the qualitative lime-juice example. This is a still-frame walkthrough, not a video player. The hero audio waveform and timeline are schematic visual cues, not a measured audio waveform or frame annotation.
- The expanded result tables in `ICLR27_ANCHOR-6.pdf` (created September 28, 2026) supersede the older manuscript tables for website results. Table 2 supplies scores for 12 models, including GLM-4.6-V-Flash, Kimi-VL-A3B-Instruct, and Nemotron-3-Nano-Omni-30B. Table 3 supplies the six-model human-refined comparison. Hallucination and divergence follow the paper's higher-is-better convention; neither is represented as a percentage.
- The updated manuscript's Table 4 supplies cue-ablation results for Gemini-3-Flash, GPT-5.6-Luna, and Claude-Sonnet-5 on 975 QA pairs, judged by GPT-5-nano. Drops are percentage points from each model's full-modality accuracy. The website exposes all three models in an accessible tab selector and summarizes the cross-model range separately.
- The public paper download remains the supplied NeurIPS manuscript. The ICLR 2027 draft is used only as the source for updated result values because its venue label and anonymous-review status conflict with this project website.
- PDFs are the supplied anonymous submission versions. Replace them with camera-ready versions when available.
- Bibliographic metadata uses the user-provided author order and conference; it intentionally omits unverified volume, pages, DOI, and public repository links.

## Editing / publication
Add verified public code and dataset URLs to the resource area when available. The current page links to the supplied paper and supplement only. It has not been publicly deployed.

Typography loads Manrope and DM Sans from Google Fonts with system fallbacks. All benchmark images and documents are local. The template's old ReCan-GS content is backed up outside this folder before replacement; its static assets are preserved.

Animations are progressive enhancements and respect the operating system's reduced-motion preference. Core content remains visible when JavaScript is unavailable.

## Organization logo sources
The affiliation row uses logo-only tiles with accessible names and hover labels. Google DeepMind and Google have separate marks.
- CMU: https://beamv2-eccv-workshop.github.io/images/cmu-logo.png
- Amazon: https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg
- Adobe: https://upload.wikimedia.org/wikipedia/commons/7/7b/Adobe_Systems_logo_and_wordmark.svg
- Google DeepMind: https://storage.googleapis.com/gdm-deepmind-com-prod-public/media/images/0xBk-c8kzB5UTrWs/nav__gdm-lockup__dark.height-25.svg (the current light-on-dark lockup served by https://deepmind.google/)
- Google: https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg
