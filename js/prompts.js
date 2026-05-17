// Gemini Prompt Templates for Worksheet Generation
// Calibrated to Bhashyam Blooms school exam patterns (Grade 2, CBSE, 15 marks)

export function buildPrompt(subject, chapter, worksheetType, difficulty, includeAnswers) {
    const worksheetTypeDescriptions = {
        practice: `WORKSHEET TYPE: Practice Worksheet
PURPOSE: Regular practice to reinforce learning. Mixed question types covering the chapter content.
STRUCTURE: Include 5-6 different section types with varied questions. Focus on building understanding through practice. Total: 15 marks.`,
        revision: `WORKSHEET TYPE: Quick Revision Sheet
PURPOSE: Fast recall and concept review BEFORE exams. NOT a full test — this is a study aid.
STRUCTURE: 
- Start with a "Key Concepts" box listing 4-5 important points from this chapter as bullet points
- Then 3-4 SHORT sections with quick-fire questions (one-word answers, fill blanks, true/false only)
- Focus on the MOST IMPORTANT facts a student must remember
- Total: 15 marks but questions should be quick to answer (no long answers)
- Make it feel like a revision flashcard, not an exam`,
        test: `WORKSHEET TYPE: Mock Test Paper
PURPOSE: Simulate the EXACT exam format of Bhashyam Blooms school class test.
STRUCTURE:
- Must look EXACTLY like a school test paper
- Include a mix of question types: fill blanks, true/false, MCQ, match the following, one-line answers, and competency-based questions
- Sections should be numbered with Roman numerals (I, II, III...)
- Each section must show marks clearly
- Total: 15 marks
- Must be completable in 30 minutes
- Questions should test exam-readiness with slightly tricky options`,
        fun: `WORKSHEET TYPE: 🚂 Train-Themed Fun Activity Sheet
PURPOSE: Learning through PLAY and CREATIVITY with a TRAIN THEME! This is NOT a test.
The child LOVES trains, so weave train references into EVERY activity.

⛔ FORBIDDEN: Do NOT include fill-in-the-blanks, true/false, MCQs, one-line answers, match-the-following, or word meanings.

✅ ONLY include these types of activities (ALL must have train connections):
- 🚂 TRAIN DRAWING: "Draw a train carrying [topic items]" or "Draw a train station where [topic scene happens]"
- 🧩 TRAIN PUZZLES: Word scramble with train + chapter words, "The train is carrying jumbled words — unscramble them!"
- 🎯 TRAIN QUIZ GAME: "All aboard the Quiz Express! 🚂" — present as a train journey quiz with stations as rounds
- 🎲 ODD ONE OUT: "Which passenger doesn't belong on this train?" Give 4 items, child circles the odd one
- ✏️ TRAIN STORY: "You are on a magic train that travels to [topic land]. Write 2 sentences about what you see!"
- 🧠 TRAIN RIDDLES: "I am something you see from the train window..." — 2-3 fun riddles
- 🏆 SPEED CHALLENGE: "The train is leaving in 1 minute! Can you name 5 [topic items] before it departs?"
- 🎨 COLOR & CREATE: "Design a train ticket/poster about [chapter topic]"

STRUCTURE:
- Make it feel like a TRAIN ADVENTURE GAME — the child is on a learning journey by train!
- Use train emojis (🚂🚃🚉🛤️) in section titles
- Frame everything as stations on a train journey: "Station 1: Word Junction 🚉", "Station 2: Puzzle Platform 🧩"
- Total: 15 marks but should feel like an exciting train ride, not work`,
        painting: `WORKSHEET TYPE: 🎨 Painting & Art Activity Sheet with SAMPLE PAINTING REFERENCE
PURPOSE: Creative art activity with a SAMPLE PAINTING DESCRIPTION that the child can visualize and copy!

STRUCTURE:

🖼️ SECTION 1 - "Sample Painting to Copy" (type: "sample_painting"):
- Provide a VIVID, DETAILED description of a finished painting that the child should try to recreate
- Describe it like you are describing a beautiful painting to someone who cannot see it
- Include EXACT colors, positions, sizes, and details
- Example: "Imagine a beautiful painting: A bright RED steam engine with YELLOW wheels is chugging along green tracks. Behind it are THREE carriages — one BLUE, one ORANGE, and one PURPLE. Big fluffy WHITE clouds fill the sky. Green hills with tiny flowers are in the background. A smiling sun with yellow rays peeks from the top-right corner. Two little birds fly near the smoke."
- This gives the child a clear mental picture of WHAT to paint
- Make it colorful, fun, and detailed enough to guide a 7-8 year old
- Use 3-5 sentences describing the complete scene

🎨 SECTION 2 - "Step-by-Step Drawing Guide" (type: "drawing"):
- Break down the sample painting into 5-6 simple drawing steps
- Each step builds on the previous one
- Example: "Step 1: Draw a big rectangle in the middle for the train body"

✏️ SECTION 3 - "Color Your Painting" (type: "coloring"):
- Give specific color instructions matching the sample painting description
- Tell exactly which colors to use for each part
- "Use bright red for the engine body", "Color the wheels sunny yellow"

📝 SECTION 4 - "Label & Learn" (type: "label_parts"):
- Ask child to label parts in their painting
- Connect to academic learning

🌟 SECTION 5 - "Write About Your Masterpiece" (type: "creative_art"):
- Ask the child to write about their painting
- "Give your painting a title", "Write 2 sentences about your train painting"

IMPORTANT:
- The SAMPLE PAINTING description is the MOST important part — make it vivid and colorful!
- Every section should connect to the chapter topic
- Instructions must be crystal clear for a 7-8 year old
- Total: 15 marks`,
    };

    const difficultyDescriptions = {
        easy: `DIFFICULTY: Easy (Warming Up)
- Use the SIMPLEST vocabulary possible
- Questions should have obvious answers that build confidence
- For MCQs, make the correct answer clearly stand out
- For fill-blanks, provide word banks
- Numbers should be small (under 50 for maths)
- This is for a child who is JUST LEARNING the topic`,
        medium: `DIFFICULTY: Medium (Class Level)
- Standard classroom difficulty
- MCQs should have reasonable distractors
- Fill-blanks WITHOUT word bank
- Numbers up to 500 for maths
- Some questions require thinking, not just recall`,
        challenge: `DIFFICULTY: Challenge (Exam Ready)
- Harder questions that truly test understanding
- MCQs with close/tricky distractors
- Application-based questions
- Word problems with multi-step thinking
- Numbers up to 999 for maths
- Include at least 1 "why" question requiring explanation`,
    };

    const baseContext = `You are an expert CBSE Grade 2 teacher at Bhashyam Blooms school in Hyderabad, India. 
The student uses the "Cambridge Shades" textbook series.
Chapter: "${chapter.name}" in ${subject.name}.

${worksheetTypeDescriptions[worksheetType] || worksheetTypeDescriptions.practice}

${difficultyDescriptions[difficulty] || difficultyDescriptions.medium}

CRITICAL RULES:
1. Content MUST be age-appropriate for a 7-8 year old child in Grade 2.
2. Use simple, clear language that a 2nd grader can read and understand.
3. ${includeAnswers ? 'Include an ANSWER KEY at the end in each question\'s "answer" field.' : 'Do NOT include answer fields.'}

NUMBERING RULES (VERY IMPORTANT):
- Do NOT include Roman numerals (I, II, III) in section titles — the app adds those automatically
- Do NOT include question numbers (1, 2, 3) in question text — the app adds those automatically
- Section titles should be just the name like "Meanings" not "I. Meanings"
- Question text should start directly with the question content`;

    const subjectPrompts = {
        english: getEnglishPrompt(chapter, worksheetType, difficulty),
        maths: getMathsPrompt(chapter, worksheetType, difficulty),
        evs: getEVSPrompt(chapter, worksheetType, difficulty),
        computer: getComputerPrompt(chapter, worksheetType, difficulty),
        hindi: getHindiPrompt(chapter, worksheetType, difficulty),
        telugu: getTeluguPrompt(chapter, worksheetType, difficulty),
        values: getValuesPrompt(chapter, worksheetType, difficulty),
        painting: getPaintingPrompt(chapter, worksheetType, difficulty),
    };

    const subjectSpecific = subjectPrompts[subject.id] || '';

    const outputFormat = `
RESPOND WITH VALID JSON ONLY. No markdown, no code fences, no extra text.
Use this exact JSON structure:
{
  "title": "Chapter name - Worksheet type",
  "subject": "Subject name",
  "totalMarks": 15,
  "sections": [
    {
      "title": "Section Title WITHOUT numbering",
      "instruction": "What the student should do",
      "marks": "2M" or "1×5=5M",
      "totalMarks": 5,
      "type": "meanings|fill_blanks|true_false|mcq|match|one_line|picture_describe|sentence_rewrite|rhyming|singular_plural|counting|word_problem|short_answer|scenario|key_concepts|drawing|coloring|creative_art|label_parts",
      "questions": [
        {
          "question": "Question text WITHOUT numbering",
          "options": ["A", "B", "C", "D"],
          "matchLeft": ["item1", "item2"],
          "matchRight": ["item1", "item2"],
          "answer": "Answer text"
        }
      ]
    }
  ],
  "bonusActivity": "Optional fun activity related to the chapter"
}

REMEMBER: Do NOT include any numbering in titles or questions. The app handles all numbering.`;

    return `${baseContext}\n\n${subjectSpecific}\n\n${outputFormat}`;
}

function getEnglishPrompt(chapter, worksheetType, difficulty) {
    const chapterType = chapter.type || 'story';
    const instructions = {
        story: `Sections for a STORY chapter: Vocabulary/Word Meanings (2M), Rhyming Words (2M), Singular-Plural (2M), Sentence Formation/Rewriting (2M), Fill in the Blanks (3M), True or False (2M), One-Line Answers (2M). Include paragraph writing for Grade 2.`,
        poem: `Sections for a POEM chapter: Word Meanings (2M), Rhyming Words (2M), Fill in the Blanks from poem (3M), Singular-Plural (2M), True or False (2M), Sentence Rewriting (2M), Creative Writing (2M).`,
        revision: `Sections for GRAMMAR revision: Nouns/Pronouns (2M), Verbs/Adjectives (2M), Articles/Prepositions (2M), Tenses (2M), Singular-Plural (2M), Sentence Formation (2M), Paragraph Writing (3M).`,
    };

    return `SUBJECT: English
CHAPTER: ${chapter.name} (${chapter.type})
TOPICS TO COVER: ${chapter.topics.join(', ')}

${instructions[chapterType] || instructions.story}

Use vocabulary and content appropriate for Grade 2 Cambridge Shades textbook. Include more complex sentence structures than Grade 1.`;
}

function getMathsPrompt(chapter, worksheetType, difficulty) {
    return `SUBJECT: Mathematics
CHAPTER: ${chapter.name}
TOPICS TO COVER: ${chapter.topics.join(', ')}

Create appropriate sections:
- Fill in the Blanks: Number-based (3-4 questions, 1M each)
- Solve / Calculate: Direct computation (4-5 questions, 1-2M each)
- Word Problems: Real-life scenarios (2-3 problems, 2M each)
- True or False: Number facts (2-3 questions, 1M each)
- Match the Following: Match operations with answers (4 pairs)

IMPORTANT FOR GRADE 2 MATHS:
- Numbers can go up to 1000
- Include 3-digit addition/subtraction where relevant
- Multiplication tables up to 10
- Focus on: ${chapter.topics.join(', ')}
- Use objects kids relate to (trains, toys, animals, fruits, crayons)`;
}

function getEVSPrompt(chapter, worksheetType, difficulty) {
    return `SUBJECT: Environmental Studies (EVS)
CHAPTER: ${chapter.name}
TOPICS TO COVER: ${chapter.topics.join(', ')}

Create appropriate sections:
- Fill in the Blanks: Key facts (3-4 blanks, 1M each)
- True or False: Facts about the topic (3 questions, 1M each)
- MCQ: Choose the correct answer (3 questions, 1M each)
- One-Line Answers: Short questions (2-3, 1-2M each)
- Match the Following: Connect related items (4 pairs)

Questions should relate to daily life in Hyderabad/India. Include competency-based questions for Grade 2 level.`;
}

function getComputerPrompt(chapter, worksheetType, difficulty) {
    return `SUBJECT: Computer Science
CHAPTER: ${chapter.name}
TOPICS: ${chapter.topics.join(', ')}

Create appropriate sections:
- Fill Blanks: Computer basics (3-4 blanks, 1M each)
- True/False: Computer facts (3 questions, 1M each)
- MCQ: Correct answer (2-3 questions, 1M each)
- Match: Parts and functions (4 pairs, 1M each)
- One-Line Answers: About ${chapter.name} (2 questions, 1M each)

Use simple language for technical terms. Relate to MS Paint, Notepad, typing, games. Grade 2 level.`;
}

function getHindiPrompt(chapter, worksheetType, difficulty) {
    return `SUBJECT: हिंदी (Hindi)
CHAPTER: ${chapter.name}
TOPICS: ${chapter.topics.join(', ')}

IMPORTANT: Generate ALL questions in Hindi (Devanagari script). Section headings can have English in parentheses.

Create appropriate sections:
- रिक्त स्थान भरो (Fill Blanks): 3-4, 1M each
- सही या गलत (True/False): 3 questions, 1M each
- शब्दों के अर्थ (Word Meanings): 2-3 words, 1M each
- मिलान करो (Match): 4 pairs, 1M each
- वाक्य बनाओ (Make Sentences): 2 sentences, 1M each

Use proper Devanagari. Keep it appropriate for a 7-8 year old Grade 2 student. Include संयुक्त अक्षर and advanced matras where relevant.`;
}

function getTeluguPrompt(chapter, worksheetType, difficulty) {
    return `SUBJECT: తెలుగు (Telugu)
CHAPTER: ${chapter.name}
TOPICS: ${chapter.topics.join(', ')}

IMPORTANT: Generate ALL questions in Telugu script. Section headings can have English in parentheses.

Create appropriate sections:
- ఖాళీలు పూరించండి (Fill Blanks): 3-4, 1M each
- సరైనది/తప్పు (True/False): 3 questions, 1M each
- పదాల అర్థాలు (Word Meanings): 2-3 words, 1M each
- జతపరచండి (Match): 4 pairs, 1M each
- వాక్యాలు రాయండి (Sentences): 2, 1M each

Use proper Telugu script. Keep it appropriate for a 7-8 year old Grade 2 student. Include ఒత్తులు where relevant.`;
}

function getValuesPrompt(chapter, worksheetType, difficulty) {
    return `SUBJECT: Value Education
CHAPTER: ${chapter.name}
TOPICS: ${chapter.topics.join(', ')}

Create appropriate sections:
- Fill Blanks: Key values (3 blanks, 1M each)
- True/False: Value statements (3 questions, 1M each)
- One-Line Answers: About values/morals (2-3, 1M each)
- What Would You Do?: Scenario-based (1-2 scenarios, 2M each)
- Match: Values with actions (3-4 pairs, 1M each)

Use real-life examples from school/home. Make scenarios relatable for a 7-8 year old in Hyderabad. Grade 2 level.`;
}

function getPaintingPrompt(chapter, worksheetType, difficulty) {
    return `SUBJECT: 🎨 Painting & Art (Train-Themed)
CHAPTER: ${chapter.name}
TOPICS: ${chapter.topics.join(', ')}

This is a CREATIVE ART worksheet. The child loves TRAINS! 🚂

Create a painting/art activity sheet with these sections IN THIS EXACT ORDER:

1. 🖼️ SAMPLE PAINTING TO COPY (5M):
   - Use type "sample_painting" for this section
   - In the "question" field, write a VIVID, DETAILED, COLORFUL description of a finished painting related to "${chapter.name}"
   - Describe it like you're painting a picture with words — include EXACT colors, positions, sizes, shapes, and tiny details
   - Make it a complete scene the child can visualize and try to recreate
   - Use UPPERCASE for color names (e.g., "BRIGHT RED engine", "SUNNY YELLOW wheels")
   - Include at least 4-5 sentences with rich visual details
   - Example: "Picture this beautiful painting: A shiny BRIGHT RED steam engine with BIG GOLDEN YELLOW wheels sits at a busy train station. The station has a LIGHT BLUE roof and a BROWN wooden platform. THREE carriages follow — one SKY BLUE, one ORANGE, and one LEAF GREEN. Happy passengers in COLORFUL clothes wave from the windows. The sky is PALE BLUE with fluffy WHITE clouds shaped like cotton candy. A DARK GREEN tree stands near the platform with a little BROWN squirrel sitting on its branch. On the platform, a man in a NAVY BLUE uniform blows a SILVER whistle. There are RED and YELLOW flowers growing along the tracks."
   - Create a unique, vivid description specifically for "${chapter.name}"

2. 🎨 STEP-BY-STEP DRAWING GUIDE (3M):
   - Use type "drawing" for this section
   - Break down the sample painting into 5-6 simple drawing steps
   - Each step should be one clear sentence building on the previous
   - Start with the main subject (the train) then add background details

3. ✏️ COLOR YOUR PAINTING (2M):
   - Use type "coloring" for this section
   - Give specific color instructions matching the sample painting description
   - Tell exactly which colors/crayons to pick up for each part

4. 📝 LABEL & LEARN (2M):
   - Use type "label_parts" for this section
   - Ask child to label 3-4 parts in their painting
   - Connect to what they're learning in school

5. 🌟 WRITE ABOUT YOUR MASTERPIECE (3M):
   - Use type "creative_art" for this section
   - "Give your painting a title"
   - "Write 2-3 sentences describing your painting"
   - "What is your favorite part? Why?"

CRITICAL:
- The SAMPLE PAINTING description is the STAR of this worksheet — make it SO vivid the child can SEE it in their mind!
- ALL activities must connect to "${chapter.name}" and TRAINS
- Instructions must be crystal clear for a 7-8 year old
- Make it exciting and encouraging!`;
}
