Truth Compass is a proof-of-concept app that uses AI to analyze text and voice to detect possible inconsistencies or signs of deception in social interactions. The app is intended for research and testing purposes only.

Features

Analyze text input to detect possible lies or evasions.

Analyze voice recordings to detect stress, hesitation, or vocal cues.

Provide a combined “truth score” based on text and audio.

Highlight words or phrases that contribute most to the score.

Installation

Clone the repository:

git clone <your-repo-url>
cd truth-compass-main


Install dependencies:

npm install


Run in development mode:

npm run dev


Make sure a package.json exists and contains "dev" script, e.g., "dev": "next dev" if using Next.js.

Usage

Input a text phrase or upload a voice recording.

The AI model returns a score from 0–1, where:

0–0.3: Likely truthful

0.3–0.7: Inconclusive / possible evasions

0.7–1.0: Possible inconsistency / lie

Review the highlighted words or vocal features for insights.

Important Notes

This project is experimental. It does not guarantee detection of lies.

Use responsibly, with consent from participants.

Scores are probabilistic, based on patterns in text and audio, not certainty.

Future Improvements

Add video/micro-expression analysis.

Improve AI models for multilingual support.

Integrate user dashboards for analysis over time.

Deploy as a web app on Vercel or other cloud platforms.
