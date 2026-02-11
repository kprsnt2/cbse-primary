// Gemini Prompt Templates for Worksheet Generation
// Calibrated to Bhashyam Blooms school exam patterns (Grade 1, CBSE, 15 marks)

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
        fun: `WORKSHEET TYPE: Fun Activity Sheet
PURPOSE: Learning through PLAY and CREATIVITY. This is NOT a test, NOT a worksheet, NOT an exam.

⛔ FORBIDDEN: Do NOT include fill-in-the-blanks, true/false, MCQs, one-line answers, match-the-following, or word meanings. These are BANNED in fun activities.

✅ ONLY include these types of activities:
- 🎨 DRAW activities: "Draw a [topic] and label its parts", "Draw your favorite [related item]", "Draw and color [scene from chapter]"
- 🧩 PUZZLES: Word scramble (unscramble jumbled letters), crossword clues, word search grids (list 6-8 words arranged in a described grid), spot-the-difference descriptions
- 🎯 QUIZ GAME format: Present it as a quiz show — "Round 1: Speed Round!" with quick fun questions, "Round 2: Picture Round!" etc.
- 🎲 ODD ONE OUT: Give 4 items, child circles the one that doesn't belong (4-5 sets)
- ✏️ CREATIVE WRITING: "Write 2 sentences about YOUR favorite [topic]", "If you were a [character], what would you do?"
- 🎭 ROLE PLAY prompts: "Act out being a [topic character] and tell your friend about..."
- 🧠 RIDDLES: 2-3 fun riddles where the answer relates to the chapter content
- 🏆 CHALLENGE: "Can you name 5 [related things] in 1 minute?" speed challenges

STRUCTURE:
- Make it feel like a FUN GAME PAGE from a children's activity book
- Use emojis in section titles and questions
- Keep it colorful and exciting in tone ("Amazing! Can you solve this puzzle? 🧩")
- Total: 15 marks but the child should WANT to do this — it should feel like play, not work
- No answer lines — activities should involve drawing, circling, or creative responses`,
    };

    const difficultyDescriptions = {
        easy: `DIFFICULTY: Easy (Warming Up)
- Use the SIMPLEST vocabulary possible
- Questions should have obvious answers that build confidence
- For MCQs, make the correct answer clearly stand out
- For fill-blanks, provide word banks with options to choose from
- Numbers should be small (under 20 for maths)
- One-line answers should need only 2-4 words
- TRUE/FALSE should be straightforward facts
- This is for a child who is JUST LEARNING the topic`,
        medium: `DIFFICULTY: Medium (Class Level)
- Standard classroom difficulty — what a teacher would give as classwork
- MCQs should have reasonable distractors but correct answer is clear if student studied
- Fill-blanks WITHOUT word bank
- Numbers up to 50 for maths
- One-line answers need a complete short sentence
- Some questions require thinking, not just recall
- This is for a child who has studied the chapter once`,
        challenge: `DIFFICULTY: Challenge (Exam Ready)
- Harder questions that truly test understanding
- MCQs with close/tricky distractors — student must really know the content
- Application-based questions: apply concepts to new situations
- Word problems with multi-step thinking
- Questions that combine concepts from different parts of the chapter
- Numbers up to 99 for maths, with carrying/borrowing
- Include at least 1 "why" question requiring explanation
- This prepares for the toughest questions in the exam`,
    };

    const baseContext = `You are an expert CBSE Grade 1 teacher at Bhashyam Blooms school in Hyderabad, India. 
The student uses the "Cambridge Shades" textbook series.
Chapter: "${chapter.name}" in ${subject.name}.

${worksheetTypeDescriptions[worksheetType] || worksheetTypeDescriptions.practice}

${difficultyDescriptions[difficulty] || difficultyDescriptions.medium}

CRITICAL RULES:
1. Content MUST be age-appropriate for a 6-7 year old child in Grade 1.
2. Use simple, clear language that a 1st grader can read and understand.
3. ${includeAnswers ? 'Include an ANSWER KEY at the end in each question\'s "answer" field.' : 'Do NOT include answer fields.'}

NUMBERING RULES (VERY IMPORTANT):
- Do NOT include Roman numerals (I, II, III) in section titles — the app adds those automatically
- Do NOT include question numbers (1, 2, 3) in question text — the app adds those automatically
- Section titles should be just the name like "Meanings" not "I. Meanings"
- Question text should start directly with the question content, not "1. What is..."
- Example CORRECT section title: "Rhyming Words"
- Example WRONG section title: "II. Rhyming Words"
- Example CORRECT question: "The cat sat on the _________."
- Example WRONG question: "1. The cat sat on the _________."`;

    const subjectPrompts = {
        english: getEnglishPrompt(chapter, worksheetType, difficulty),
        maths: getMathsPrompt(chapter, worksheetType, difficulty),
        evs: getEVSPrompt(chapter, worksheetType, difficulty),
        computer: getComputerPrompt(chapter, worksheetType, difficulty),
        hindi: getHindiPrompt(chapter, worksheetType, difficulty),
        telugu: getTeluguPrompt(chapter, worksheetType, difficulty),
        values: getValuesPrompt(chapter, worksheetType, difficulty),
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
      "type": "meanings|fill_blanks|true_false|mcq|match|one_line|picture_describe|sentence_rewrite|rhyming|singular_plural|counting|word_problem|short_answer|scenario|key_concepts",
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
    const typeInstructions = {
        practice: {
            story: `Create a PRACTICE worksheet with these varied section types:
- Vocabulary: Write meanings of words from the story (2-3 words, 2M each)
- Rhyming Words: Find rhyming words (2 pairs, 2M)
- Singular and Plural: Convert words (2 words, 1M each)  
- Sentence Rewriting: Rewrite with capital letter and full stop (1-2 sentences, 1M each)
- Fill in the Blanks: From the story (2-3 blanks, 1M each)
- True or False: Based on the story (2-3 questions, 1M each)`,
            poem: `Create a PRACTICE worksheet with these section types:
- Vocabulary: Write meanings of words from the poem (2-3 words, 2M each)
- Rhyming Words: Find rhyming pairs from the poem (2-3 pairs, 2M)
- Fill in the Blanks: Complete lines from the poem (2-3 blanks, 1M each)
- Singular and Plural: Convert words from the poem (2 words, 1M each)
- True or False: Based on the poem (2 questions, 1M each)`,
            revision: `Create a PRACTICE worksheet covering mixed grammar:
- Word Meanings (2M)
- Rhyming Words (2M)
- Singular-Plural (2M)
- Opposites (2M)
- Fill in the Blanks (3M)
- Sentence Rewriting (2M)
- Naming Words / Action Words (2M)`,
        },
        revision: {
            story: `Create a QUICK REVISION sheet:
- Key Points: List 4-5 important things to remember from this story (as a concepts box)
- Quick Fill Blanks: 3 easy fill-in-the-blank from key sentences (1M each)
- Flash Recall: 3 one-word answer questions (1M each)  
- True/False Quick Check: 3 fact-check questions (1M each)
- Word Bank: List 5 important words with their meanings`,
            poem: `Create a QUICK REVISION sheet:
- Key Lines: List 3-4 important lines from the poem to remember
- Quick Fill Blanks: Complete 3 key lines from the poem (1M each)
- Rhyming Pairs: 2 important rhyming pairs to remember (1M each)  
- Flash Recall: 3 quick one-word answer questions (1M each)
- Word Bank: List important words with meanings`,
            revision: `Create a QUICK REVISION covering all grammar:
- Grammar Rules: List 4-5 important grammar rules as bullet points
- Quick Practice: 2 fill blanks per grammar topic (singular-plural, opposites, etc.)
- Word Bank: Important words to remember with meanings`,
        },
        test: {
            story: `Create an EXAM-STYLE test paper matching Bhashyam Blooms pattern EXACTLY:
- Vocabulary: Write meanings (2 words, 2M)
- Rhyming Words: Find rhyming words (2 pairs, 2M)
- Singular-Plural: Convert (2 words, 1M each = 2M)
- Sentence Rewriting: Capital letter + full stop (1 sentence, 1M)
- Fill in the Blanks: Key sentences (3 blanks, 1M each = 3M)  
- One-Line Answer: Comprehension (2 questions, 1M each = 2M)
- True or False: Story facts (3 questions, 1M each = 3M)
Total MUST equal exactly 15 marks.`,
            poem: `Create an EXAM-STYLE test paper matching Bhashyam Blooms pattern:
- Word Meanings (2M)
- Rhyming Words (2M)
- Singular-Plural (2M)
- Fill in blanks from poem (3M)
- True or False (3M)
- Sentence Rewriting (1M)
- One-line answer (2M)
Total MUST equal exactly 15 marks.`,
            revision: `Create an EXAM-STYLE grammar test:
- Word Meanings (2M)
- Rhyming Words (2M)
- Singular-Plural (2M)
- Opposites (2M)  
- Fill in Blanks (3M)
- Sentence Formation (2M)
- Naming/Action Words (2M)
Total MUST equal exactly 15 marks.`,
        },
        fun: {
            story: `Create a FUN ACTIVITY sheet:
- Word Scramble: Unscramble 3-4 jumbled words from the story
- Odd One Out: Pick the word that doesn't belong (3 sets)
- Complete the Story: Fill missing words to complete a short retelling
- Draw & Write: "Draw your favorite scene from the story and write one sentence about it"
- Riddle: A fun riddle related to the story's theme`,
            poem: `Create a FUN ACTIVITY sheet:
- Missing Words Game: Fill missing words in poem lines (make it playful)
- Rhyme Time: Given a word, write 2 rhyming words (3 words given)
- Word Search: List of 5-6 hidden words from the poem
- Draw & Color: "Draw what the poem describes"
- Make Your Own: "Write 2 lines of your own poem about..."`,
            revision: `Create a FUN ACTIVITY covering grammar:
- Word Hunt: Find naming/action words from a given sentence
- Opposite Pairs: Connect opposites in a fun way
- Jumbled Sentences: Rearrange words to make sentences
- Picture + Word: Match words to what they mean
- Create: Write 2 funny sentences using given words`,
        },
    };

    const chapterType = chapter.type || 'story';
    const typeKey = typeInstructions[worksheetType] ? worksheetType : 'practice';
    const instructions = typeInstructions[typeKey][chapterType] || typeInstructions[typeKey].story;

    return `SUBJECT: English
CHAPTER: ${chapter.name} (${chapter.type})
TOPICS TO COVER: ${chapter.topics.join(', ')}

${instructions}

Use vocabulary and content specifically from this chapter of the Cambridge Shades Grade 1 textbook.`;
}

function getMathsPrompt(chapter, worksheetType, difficulty) {
    const typeInstructions = {
        practice: `Create a PRACTICE worksheet:
- Fill in the Blanks: Number-based (3-4 questions, 1M each)
- Solve / Calculate: Direct computation (4-5 questions, 1-2M each)
- Word Problems: Simple real-life scenarios (2 problems, 2M each)
- True or False: Number facts (2-3 questions, 1M each)
- Match the Following: Match operations with answers (4 pairs, 1M each)`,
        revision: `Create a QUICK REVISION sheet:
- Key Formulas/Rules: List important rules for this chapter (e.g., "carrying means...", "place value means...")
- Quick Solve: 5 rapid-fire calculation problems (1M each)
- Number Facts: 3 true/false about number properties (1M each)
- Remember These: Present key facts in a memorable way
- Quick Word Problem: 1 simple word problem (2M)`,
        test: `Create an EXAM-STYLE test paper:
- Fill in the Blanks (3M)
- Solve (4M with mixed difficulty)
- Word Problems (2×2M = 4M)
- True or False (2M)
- Match the Following (2M)
Total MUST equal exactly 15 marks. Make it feel like a real exam.`,
        fun: `Create a FUN ACTIVITY sheet:
- Number Puzzle: A simple number crossword or pattern game
- Math Riddle: "I am a number between 20 and 30. If you add 5..."
- Skip Counting Game: Fill the pattern
- Real-Life Math: "If you have 5 apples and your friend gives 3 more..."
- Draw & Count: Visual counting activities
- Math Maze: Solve problems to find the right path`,
    };

    return `SUBJECT: Mathematics
CHAPTER: ${chapter.name}
TOPICS TO COVER: ${chapter.topics.join(', ')}

${typeInstructions[worksheetType] || typeInstructions.practice}

IMPORTANT FOR MATHS:
- Keep numbers within range for Grade 1 (up to 100)
- Focus on: ${chapter.topics.join(', ')}
- Use objects kids relate to (fruits, toys, animals, crayons)`;
}

function getEVSPrompt(chapter, worksheetType, difficulty) {
    const typeInstructions = {
        practice: `Create a PRACTICE worksheet:
- Fill in the Blanks: Key facts (3-4 blanks, 1M each)
- True or False: Facts about the topic (3 questions, 1M each)
- MCQ: Choose the correct answer (3 questions, 1M each)
- One-Line Answers: Short questions (2-3, 1-2M each)
- Match the Following: Connect related items (4 pairs)`,
        revision: `Create a QUICK REVISION sheet:
- Key Facts to Remember: 5-6 important bullet points about this chapter
- Quick True/False: 4 rapid fact-checks (1M each)
- Fill the Gaps: 3 key sentences with blanks (1M each)
- One-Word Answers: 4 very quick recall questions (1M each)`,
        test: `Create an EXAM-STYLE test matching Bhashyam Blooms pattern:
- Fill in the Blanks (3M)
- True or False (3M)
- MCQ (3M)
- One-Line Answers (2×2M = 4M)  
- Match the Following (2M)
Total MUST equal exactly 15 marks. Include competency-based questions.`,
        fun: `Create a FUN ACTIVITY sheet:
- Odd One Out: 3 sets of 4 items where one doesn't belong
- True Facts Challenge: "Amazing fact: Did you know..." + related question
- Draw & Label: Draw something related to the chapter and label parts
- Sort the Items: Categorize items into groups
- My Life Connection: "Write about YOUR..." (connect chapter to child's life)`,
    };

    return `SUBJECT: Environmental Studies (EVS)
CHAPTER: ${chapter.name}
TOPICS TO COVER: ${chapter.topics.join(', ')}

${typeInstructions[worksheetType] || typeInstructions.practice}

- Questions should relate to daily life in Hyderabad/India
- For picture-based questions, describe the scenario in text
- Competency questions should test application of knowledge`;
}

function getComputerPrompt(chapter, worksheetType, difficulty) {
    const typeInstructions = {
        practice: `Create a PRACTICE worksheet:
- Fill Blanks: Computer basics (3-4 blanks, 1M each)
- True/False: Computer facts (3 questions, 1M each)
- MCQ: Correct answer (2-3 questions, 1M each)
- Match: Parts and functions (4 pairs, 1M each)
- One-Line Answers: About ${chapter.name} (2 questions, 1M each)`,
        revision: `Create a QUICK REVISION sheet:
- Key Points: 4-5 important facts about ${chapter.name}
- Quick Recall: 4 one-word answer questions (1M each)
- True/False: 3 facts to remember (1M each)
- Fill Blanks: 3 key sentences (1M each)`,
        test: `Create an EXAM-STYLE test:
- Fill Blanks (3M)
- True/False (3M)
- MCQ (3M)
- Match (3M)
- One-Line Answers (3M)
Total MUST equal exactly 15 marks.`,
        fun: `Create a FUN ACTIVITY sheet:
- Name That Part: Describe a part and guess what it is
- Computer vs. Not: Which things need a computer?
- Draw & Label: Draw a computer/mouse/keyboard
- What Happens When: "When you press Enter..."
- My Computer Story: Write 2 sentences about using a computer`,
    };

    return `SUBJECT: Computer Science
CHAPTER: ${chapter.name}
TOPICS: ${chapter.topics.join(', ')}

${typeInstructions[worksheetType] || typeInstructions.practice}

Use simple language for technical terms. Relate to games, drawing, typing.`;
}

function getHindiPrompt(chapter, worksheetType, difficulty) {
    const typeInstructions = {
        practice: `PRACTICE worksheet - include:
- रिक्त स्थान भरो (Fill Blanks): 3-4, 1M each
- सही या गलत (True/False): 3 questions, 1M each
- शब्दों के अर्थ (Word Meanings): 2-3 words, 1M each
- मिलान करो (Match): 4 pairs, 1M each
- वाक्य बनाओ (Make Sentences): 2 sentences, 1M each`,
        revision: `QUICK REVISION - include:
- याद रखो (Key Points): 4-5 important facts as bullets
- जल्दी भरो (Quick Fill): 3 easy blanks, 1M each
- एक शब्द में उत्तर (One Word): 4 quick-recall, 1M each
- सही/गलत (True/False): 3 facts, 1M each`,
        test: `EXAM-STYLE test matching school pattern:
- रिक्त स्थान (3M)
- सही/गलत (3M)
- शब्दार्थ (3M)
- मिलान (3M)
- वाक्य/उत्तर (3M)
Total = exactly 15 marks`,
        fun: `FUN ACTIVITY - include:
- शब्द खोजो (Word Hunt): Find words in a grid
- उलटे-पलटे शब्द (Jumbled Words): Unscramble
- चित्र और शब्द (Picture + Word): Match
- मजेदार कविता: Complete a fun rhyme
- रंग भरो और लिखो: Color & label activity`,
    };

    return `SUBJECT: हिंदी (Hindi)
CHAPTER: ${chapter.name}
TOPICS: ${chapter.topics.join(', ')}

IMPORTANT: Generate ALL questions in Hindi (Devanagari script). Section headings can have English in parentheses.

${typeInstructions[worksheetType] || typeInstructions.practice}

Use proper Devanagari. Keep it simple for a 6-7 year old.`;
}

function getTeluguPrompt(chapter, worksheetType, difficulty) {
    const typeInstructions = {
        practice: `PRACTICE worksheet - include:
- ఖాళీలు పూరించండి (Fill Blanks): 3-4, 1M each
- సరైనది/తప్పు (True/False): 3 questions, 1M each
- పదాల అర్థాలు (Word Meanings): 2-3 words, 1M each
- జతపరచండి (Match): 4 pairs, 1M each
- వాక్యాలు రాయండి (Sentences): 2, 1M each`,
        revision: `QUICK REVISION - include:
- గుర్తుంచుకోండి (Key Points): 4-5 important facts
- త్వరగా పూరించండి (Quick Fill): 3 easy blanks, 1M each
- ఒక మాటలో (One Word Answer): 4 quick-recall, 1M each
- సరైనది/తప్పు (True/False): 3 facts, 1M each`,
        test: `EXAM-STYLE test:
- ఖాళీలు (3M)
- సరైనది/తప్పు (3M)
- పదార్థాలు (3M)
- జతపరచండి (3M)
- వాక్యాలు/సమాధానాలు (3M)
Total = exactly 15 marks`,
        fun: `FUN ACTIVITY:
- పదాలు కనుగొనండి (Word Hunt)
- అక్షరాలు కలపండి (Jumbled Letters)
- బొమ్మ + పదం (Picture + Word Match)
- సరదా పద్యం (Complete a fun rhyme)
- గీయండి మరియు రాయండి (Draw & Write)`,
    };

    return `SUBJECT: తెలుగు (Telugu)
CHAPTER: ${chapter.name}
TOPICS: ${chapter.topics.join(', ')}

IMPORTANT: Generate ALL questions in Telugu script. Section headings can have English in parentheses.

${typeInstructions[worksheetType] || typeInstructions.practice}

Use proper Telugu script. Keep it simple for a 6-7 year old.`;
}

function getValuesPrompt(chapter, worksheetType, difficulty) {
    const typeInstructions = {
        practice: `PRACTICE worksheet:
- Fill Blanks: Key values (3 blanks, 1M each)
- True/False: Value statements (3 questions, 1M each)
- One-Line Answers: About values/morals (2-3, 1M each)
- What Would You Do?: Scenario-based (1-2 scenarios, 2M each)
- Match: Values with actions (3-4 pairs, 1M each)`,
        revision: `QUICK REVISION:
- Key Values: 4-5 important moral lessons as bullet points
- Quick True/False: 4 value statements (1M each)
- Fill Blanks: 3 key sentences (1M each)
- Remember: Important moral lessons in simple words`,
        test: `EXAM-STYLE test:
- Fill Blanks (3M)
- True/False (3M)
- One-Line Answers (3M)
- Scenario Questions (3M)
- Match/MCQ (3M)
Total = exactly 15 marks`,
        fun: `FUN ACTIVITY:
- Story Ending: "What would happen if..." scenarios
- Good Deed Diary: Write about 1 kind thing you did
- Role Play: Act out a value (describe the scene)
- Draw: Draw a picture showing the value in action
- Pledge: Write a promise related to the chapter's value`,
    };

    return `SUBJECT: Value Education
CHAPTER: ${chapter.name}
TOPICS: ${chapter.topics.join(', ')}

${typeInstructions[worksheetType] || typeInstructions.practice}

Use real-life examples from school/home. Make scenarios relatable for a 6-7 year old in Hyderabad.`;
}
