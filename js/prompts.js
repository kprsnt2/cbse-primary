// Gemini Prompt Templates for Worksheet Generation
// Calibrated to Bhashyam Blooms school exam patterns (Grade 1, CBSE, 15 marks)

export function buildPrompt(subject, chapter, worksheetType, difficulty, includeAnswers) {
    const baseContext = `You are an expert CBSE Grade 1 teacher at Bhashyam Blooms school in Hyderabad, India. 
The student uses the "Cambridge Shades" textbook series.
You are creating a ${worksheetType} worksheet for the chapter "${chapter.name}" in ${subject.name}.
Difficulty level: ${difficulty}.

CRITICAL RULES:
1. Content MUST be age-appropriate for a 6-7 year old child in Grade 1.
2. Use simple, clear language that a 1st grader can read and understand.
3. Questions should test understanding, not just memorization.
4. For stories/poems, include vocabulary, comprehension, and grammar questions.
5. Each worksheet should be 15 marks total (matching school exam pattern).
6. Include clear section headers with marks for each section.
7. Include line spaces for writing answers (indicate with "___________").
8. ${includeAnswers ? 'Include an ANSWER KEY at the end.' : 'Do NOT include answers.'}

FORMATTING RULES:
- Use clear numbering (I, II, III for sections; 1, 2, 3 for questions)
- Show marks for each section like "(2M)" or "(1×5=5M)"
- Keep questions on separate lines
- Use simple formatting that works well when printed`;

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
      "title": "Section Title",
      "instruction": "What the student should do",
      "marks": "2M" or "1×5=5M",
      "totalMarks": 5,
      "type": "meanings|fill_blanks|true_false|mcq|match|one_line|picture_describe|sentence_rewrite|rhyming|singular_plural|counting|word_problem|short_answer|scenario",
      "questions": [
        {
          "question": "Question text",
          "options": ["A", "B", "C", "D"],  // only for MCQ type
          "matchLeft": ["item1", "item2"],   // only for match type
          "matchRight": ["item1", "item2"],  // only for match type
          "answer": "Answer text"            // only if includeAnswers is true
        }
      ]
    }
  ],
  "bonusActivity": "Optional fun activity related to the chapter"
}`;

    return `${baseContext}\n\n${subjectSpecific}\n\n${outputFormat}`;
}

function getEnglishPrompt(chapter, worksheetType, difficulty) {
    const questionTypes = {
        story: `Include these question types (matching Bhashyam Blooms exam pattern):
- I. Vocabulary: Write the meanings of words from the story (2-3 words, 2M each)
- II. Rhyming Words: Find rhyming words (2 pairs, 2M)
- III. Singular and Plural: Convert words (2 words, 1M each)
- IV. Sentence Rewriting: Rewrite with capital letter and full stop (1-2 sentences, 1M each)
- V. Fill in the Blanks: From the story (2-3 blanks, 1M each)
- VI. True or False: Based on the story (2-3 questions, 1M each)
- VII. One-Line Answer: Short answer questions about the story (1-2 questions, 1M each)`,
        poem: `Include these question types:
- I. Vocabulary: Write the meanings of words from the poem (2-3 words, 2M each)
- II. Rhyming Words: Find rhyming pairs from the poem (2-3 pairs, 2M)
- III. Singular and Plural: Convert words from the poem (2 words, 1M each)
- IV. Fill in the Blanks: Complete lines from the poem (2-3 blanks, 1M each)
- V. True or False: Based on the poem (2 questions, 1M each)
- VI. Sentence Rewriting: Rewrite with capital letter and full stop (1 sentence, 1M)`,
        revision: `Include a mix of all grammar topics:
- I. Word Meanings (2M)
- II. Rhyming Words (2M)
- III. Singular-Plural (2M)
- IV. Opposites (2M)
- V. Fill in the Blanks (3M)
- VI. Sentence Formation / Rewriting (2M)
- VII. Naming Words / Action Words (2M)`,
    };

    return `SUBJECT: English
CHAPTER: ${chapter.name} (${chapter.type})
TOPICS TO COVER: ${chapter.topics.join(', ')}

${questionTypes[chapter.type] || questionTypes.story}

Remember: Use vocabulary and content specifically from this chapter/poem of the Cambridge Shades Grade 1 textbook.
The difficulty is "${difficulty}" - adjust word complexity accordingly.`;
}

function getMathsPrompt(chapter, worksheetType, difficulty) {
    return `SUBJECT: Mathematics
CHAPTER: ${chapter.name}
TOPICS TO COVER: ${chapter.topics.join(', ')}

Include these question types (matching Bhashyam Blooms exam pattern):
- I. Fill in the Blanks: Number-based (3-4 questions, 1M each)
- II. Solve / Calculate: Direct computation problems (4-5 questions, 1-2M each)
- III. Word Problems: Simple real-life scenarios (2 problems, 2M each)
- IV. True or False: Number facts (2-3 questions, 1M each)
- V. Match the Following: Match numbers/operations with answers (4 pairs, 1M each)
- VI. Picture-Based / Counting: Count objects or read pictures (1-2 questions, 1M each)

IMPORTANT FOR MATHS:
- Keep numbers within the range appropriate for Grade 1 (up to 100)
- For ${chapter.name}, focus specifically on: ${chapter.topics.join(', ')}
- Use objects kids relate to (fruits, toys, animals, crayons)
- Word problems should be simple 1-2 sentence scenarios
- The difficulty is "${difficulty}" - for easy use smaller numbers, for challenge use edge cases`;
}

function getEVSPrompt(chapter, worksheetType, difficulty) {
    return `SUBJECT: Environmental Studies (EVS)
CHAPTER: ${chapter.name}
TOPICS TO COVER: ${chapter.topics.join(', ')}

Include these question types (matching Bhashyam Blooms exam pattern):
- I. Fill in the Blanks: Key facts about ${chapter.name} (3-4 blanks, 1M each)
- II. True or False: Facts about the topic (3 questions, 1M each)
- III. MCQ: Choose the correct answer (3 questions, 1M each)
- IV. One-Line Answers: Short answer questions (2-3 questions, 1-2M each)
- V. Match the Following: Connect related items (4 pairs, 1M each)
- VI. Picture/Competency Based: Describe or identify from a described scenario (1-2 questions, 2M each)

IMPORTANT FOR EVS:
- Questions should relate to daily life in Hyderabad/India
- Include local examples where possible
- For picture-based questions, describe what the picture shows since we can't include actual images
- Competency-based questions should test application of knowledge, not just recall
- The difficulty is "${difficulty}"`;
}

function getComputerPrompt(chapter, worksheetType, difficulty) {
    return `SUBJECT: Computer Science
CHAPTER: ${chapter.name}
TOPICS TO COVER: ${chapter.topics.join(', ')}

Include these question types:
- I. Fill in the Blanks: Computer basics (3-4 blanks, 1M each)
- II. True or False: Computer facts (3 questions, 1M each)
- III. MCQ: Choose the correct answer (2-3 questions, 1M each)
- IV. Match the Following: Parts and functions (4 pairs, 1M each)
- V. One-Line Answers: Short answers about ${chapter.name} (2 questions, 1M each)
- VI. Name the parts: Describe a computer part and ask to name it (1-2 questions, 1M each)

IMPORTANT FOR COMPUTER SCIENCE:
- Use simple language for technical terms
- Relate to what kids use (games, drawing, typing)
- The difficulty is "${difficulty}"`;
}

function getHindiPrompt(chapter, worksheetType, difficulty) {
    return `SUBJECT: हिंदी (Hindi)
CHAPTER: ${chapter.name}
TOPICS TO COVER: ${chapter.topics.join(', ')}

IMPORTANT: Generate ALL questions and content in Hindi (Devanagari script). 
Only section headings can have English translations in parentheses.

Include these question types:
- I. रिक्त स्थान भरो (Fill in the Blanks): 3-4 blanks, 1M each
- II. सही या गलत (True or False): 3 questions in Hindi, 1M each
- III. शब्दों के अर्थ लिखो (Word Meanings): 2-3 words, 1M each
- IV. मिलान करो (Match the Following): 4 pairs, 1M each
- V. वाक्य बनाओ (Make Sentences): Using given words, 2 sentences, 1M each
- VI. उल्टे शब्द / एक-अनेक (Opposites/Singular-Plural): 2-3 words, 1M each

IMPORTANT FOR HINDI:
- Use proper Devanagari script throughout
- Words and sentences should be simple enough for a 6-7 year old
- Include matra-based exercises if the chapter covers matras
- The difficulty is "${difficulty}"`;
}

function getTeluguPrompt(chapter, worksheetType, difficulty) {
    return `SUBJECT: తెలుగు (Telugu)
CHAPTER: ${chapter.name}
TOPICS TO COVER: ${chapter.topics.join(', ')}

IMPORTANT: Generate ALL questions and content in Telugu script.
Only section headings can have English translations in parentheses.

Include these question types:
- I. ఖాళీలు పూరించండి (Fill in the Blanks): 3-4 blanks, 1M each
- II. సరైనది / తప్పు (True or False): 3 questions in Telugu, 1M each
- III. పదాల అర్థాలు (Word Meanings): 2-3 words, 1M each
- IV. జతపరచండి (Match the Following): 4 pairs, 1M each
- V. వాక్యాలు రాయండి (Make Sentences): 2 sentences, 1M each
- VI. వ్యతిరేక పదాలు / ఒకటి-అనేకం (Opposites/Singular-Plural): 2-3 words, 1M each

IMPORTANT FOR TELUGU:
- Use proper Telugu script throughout
- Words and sentences should be simple enough for a 6-7 year old
- Include gunintalu exercises if the chapter covers gunintalu
- The difficulty is "${difficulty}"`;
}

function getValuesPrompt(chapter, worksheetType, difficulty) {
    return `SUBJECT: Value Education
CHAPTER: ${chapter.name}
TOPICS TO COVER: ${chapter.topics.join(', ')}

Include these question types:
- I. Fill in the Blanks: Key values and lessons (3 blanks, 1M each)
- II. True or False: Value-based statements (3 questions, 1M each)
- III. One-Line Answers: Questions about values and morals (2-3 questions, 1M each)
- IV. What Would You Do? (Scenario-based): Present a situation and ask how the child would respond (1-2 scenarios, 2M each)
- V. Match the Following: Match values with actions (3-4 pairs, 1M each)
- VI. MCQ: Choose the right value/action (2 questions, 1M each)

IMPORTANT FOR VALUE EDUCATION:
- Questions should encourage thinking about real-life situations
- Use examples from school and home life
- Scenarios should be relatable for a 6-7 year old in Hyderabad
- Focus on understanding WHY values are important, not just what they are
- The difficulty is "${difficulty}"`;
}
