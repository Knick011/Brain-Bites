

const questions = [
  {
    id: 1,
    question: "What is the definition of psychology?",
    options: {
      A: "The study of human culture",
      B: "The scientific study of behavior and mental processes",
      C: "The study of historical events",
      D: "The study of chemical reactions in the brain"
    },
    correctAnswer: "B",
    explanation: "Psychology is defined as the scientific study of behavior and mental processes."
  },
  {
    id: 2,
    question: "Who is considered the father of modern psychology?",
    options: {
      A: "Sigmund Freud",
      B: "Wilhelm Wundt",
      C: "B.F. Skinner",
      D: "Carl Jung"
    },
    correctAnswer: "B",
    explanation: "Wilhelm Wundt is often regarded as the father of modern psychology because he established the first psychology laboratory."
  },
  {
    id: 3,
    question: "Which research method is best for establishing cause and effect?",
    options: {
      A: "Case study",
      B: "Observational study",
      C: "Experiment",
      D: "Survey"
    },
    correctAnswer: "C",
    explanation: "Experiments allow researchers to manipulate variables and establish cause and effect relationships."
  },
  {
    id: 4,
    question: "What is the primary focus of cognitive psychology?",
    options: {
      A: "Studying emotions",
      B: "Understanding mental processes like thinking and memory",
      C: "Examining behavior in natural settings",
      D: "Analyzing social interactions"
    },
    correctAnswer: "B",
    explanation: "Cognitive psychology focuses on internal mental processes such as thinking, memory, and problem solving."
  },
  {
    id: 5,
    question: "Which example best illustrates classical conditioning?",
    options: {
      A: "Learning to ride a bicycle",
      B: "Pavlov’s dogs salivating at the sound of a bell",
      C: "Memorizing a list of words",
      D: "Solving a math problem"
    },
    correctAnswer: "B",
    explanation: "Pavlov’s experiment with dogs demonstrated classical conditioning, where a neutral stimulus becomes associated with a significant stimulus."
  },
  {
    id: 6,
    question: "What does operant conditioning primarily involve?",
    options: {
      A: "Learning by observation",
      B: "Learning through rewards and punishments",
      C: "Learning by association",
      D: "Learning through introspection"
    },
    correctAnswer: "B",
    explanation: "Operant conditioning involves modifying behavior through rewards (reinforcements) and punishments."
  },
  {
    id: 7,
    question: "Which brain structure is most closely linked to memory formation?",
    options: {
      A: "Amygdala",
      B: "Hippocampus",
      C: "Prefrontal cortex",
      D: "Thalamus"
    },
    correctAnswer: "B",
    explanation: "The hippocampus is critical for the formation of new memories."
  },
  {
    id: 8,
    question: "What is the main purpose of the scientific method in psychological research?",
    options: {
      A: "To validate personal opinions",
      B: "To systematically study behavior and mental processes",
      C: "To quickly gather data",
      D: "To confirm pre-existing theories"
    },
    correctAnswer: "B",
    explanation: "The scientific method provides a systematic, objective way to study psychological phenomena."
  },
  {
    id: 9,
    question: "Which psychological approach emphasizes unconscious processes and early childhood experiences?",
    options: {
      A: "Behavioral",
      B: "Cognitive",
      C: "Psychoanalytic",
      D: "Humanistic"
    },
    correctAnswer: "C",
    explanation: "The psychoanalytic approach, pioneered by Freud, focuses on unconscious processes and early life experiences."
  },
  {
    id: 10,
    question: "In research ethics, what is most critical when working with human participants?",
    options: {
      A: "Maximizing data collection",
      B: "Obtaining informed consent and ensuring participant safety",
      C: "Using the latest technology",
      D: "Achieving statistically significant results"
    },
    correctAnswer: "B",
    explanation: "Ethical research in psychology requires informed consent and measures to protect participants’ welfare."
  },
  {
    id: 11,
    question: "Which term describes a mental shortcut used to solve problems quickly?",
    options: {
      A: "Heuristic",
      B: "Algorithm",
      C: "Schema",
      D: "Bias"
    },
    correctAnswer: "A",
    explanation: "A heuristic is a simple, efficient rule used to make decisions or solve problems quickly."
  },
  {
    id: 12,
    question: "What is cognitive dissonance?",
    options: {
      A: "A state of mental relaxation",
      B: "A type of memory loss",
      C: "The discomfort experienced when holding conflicting beliefs",
      D: "A neurological disorder"
    },
    correctAnswer: "C",
    explanation: "Cognitive dissonance refers to the mental discomfort that results from holding conflicting beliefs or attitudes."
  },
  {
    id: 13,
    question: "What role does the amygdala play in emotion?",
    options: {
      A: "It regulates appetite",
      B: "It processes emotional responses, especially fear",
      C: "It controls motor functions",
      D: "It handles language processing"
    },
    correctAnswer: "B",
    explanation: "The amygdala is involved in processing emotions such as fear and pleasure."
  },
  {
    id: 14,
    question: "Which therapy focuses on changing dysfunctional thoughts?",
    options: {
      A: "Cognitive therapy",
      B: "Psychoanalysis",
      C: "Behavioral therapy",
      D: "Humanistic therapy"
    },
    correctAnswer: "A",
    explanation: "Cognitive therapy aims to change negative thought patterns to improve mood and behavior."
  },
  {
    id: 15,
    question: "What does the 'nature vs. nurture' debate refer to?",
    options: {
      A: "The influence of diet on behavior",
      B: "The role of brain chemistry in psychological disorders",
      C: "The relative contributions of genetics and environment to behavior",
      D: "The impact of education on intelligence"
    },
    correctAnswer: "C",
    explanation: "The 'nature vs. nurture' debate explores the relative impact of genetic inheritance (nature) versus environmental factors (nurture) on behavior."
  },
  {
    id: 16,
    question: "What is the primary function of the prefrontal cortex?",
    options: {
      A: "Processing visual information",
      B: "Decision making and planning",
      C: "Controlling heart rate",
      D: "Regulating body temperature"
    },
    correctAnswer: "B",
    explanation: "The prefrontal cortex is essential for complex cognitive behavior, including decision making and planning."
  },
  {
    id: 17,
    question: "Which of the following best describes a schema?",
    options: {
      A: "A mental framework that helps organize and interpret information",
      B: "A type of memory storage",
      C: "A physiological response to stress",
      D: "A statistical method for data analysis"
    },
    correctAnswer: "A",
    explanation: "A schema is a cognitive structure that helps individuals organize and interpret information."
  },
  {
    id: 18,
    question: "What is meant by 'attachment' in developmental psychology?",
    options: {
      A: "The process of learning language",
      B: "A type of cognitive bias",
      C: "A measurement of intelligence",
      D: "The emotional bond between a child and caregiver"
    },
    correctAnswer: "D",
    explanation: "Attachment refers to the strong emotional bond that develops between a child and their caregiver, which influences later social and emotional development."
  },
  {
    id: 19,
    question: "Which process involves encoding, storing, and retrieving information?",
    options: {
      A: "Perception",
      B: "Memory",
      C: "Attention",
      D: "Motivation"
    },
    correctAnswer: "B",
    explanation: "Memory is the process of encoding, storing, and later retrieving information."
  },
  {
    id: 20,
    question: "What is the significance of the placebo effect in research?",
    options: {
      A: "It demonstrates the importance of randomization",
      B: "It has no real significance",
      C: "It shows that belief in treatment can produce real changes",
      D: "It is used to measure intelligence"
    },
    correctAnswer: "C",
    explanation: "The placebo effect shows that when participants believe they are receiving treatment, they may experience real changes—even if the treatment has no active ingredients."
  },
  {
    id: 21,
    question: "Which neurotransmitter is most often associated with mood regulation?",
    options: {
      A: "Acetylcholine",
      B: "Glutamate",
      C: "GABA",
      D: "Serotonin"
    },
    correctAnswer: "D",
    explanation: "Serotonin is a neurotransmitter that plays a significant role in regulating mood, appetite, and sleep."
  },
  {
    id: 22,
    question: "What is the focus of humanistic psychology?",
    options: {
      A: "Personal growth and self-actualization",
      B: "Behavior modification through rewards",
      C: "Unconscious drives",
      D: "Cognitive biases"
    },
    correctAnswer: "A",
    explanation: "Humanistic psychology emphasizes individual potential, personal growth, and self-actualization."
  },
  {
    id: 23,
    question: "Which term describes a fixed, false belief that persists despite evidence to the contrary?",
    options: {
      A: "Heuristic",
      B: "Bias",
      C: "Delusion",
      D: "Schema"
    },
    correctAnswer: "C",
    explanation: "A delusion is a fixed, false belief that is not amenable to change even in the light of contradictory evidence."
  },
  {
    id: 24,
    question: "What is a common symptom of anxiety disorders?",
    options: {
      A: "Enhanced concentration",
      B: "Excessive worry",
      C: "Increased appetite",
      D: "Improved memory"
    },
    correctAnswer: "B",
    explanation: "Excessive worry is a hallmark symptom of many anxiety disorders."
  },
  {
    id: 25,
    question: "What is the main idea behind social learning theory?",
    options: {
      A: "Learning through direct reinforcement only",
      B: "Learning by trial and error exclusively",
      C: "Learning solely through genetic inheritance",
      D: "Learning by observing and imitating others"
    },
    correctAnswer: "D",
    explanation: "Social learning theory posits that people can learn new behaviors by observing and imitating others."
  },
  {
    id: 26,
    question: "Which research method is best for exploring individuals’ subjective experiences?",
    options: {
      A: "Qualitative interviews",
      B: "Experimental studies",
      C: "Double-blind trials",
      D: "Surveys with fixed responses"
    },
    correctAnswer: "A",
    explanation: "Qualitative interviews allow researchers to gather rich, subjective accounts of personal experiences."
  },
  {
    id: 27,
    question: "What is the primary goal of behavior therapy?",
    options: {
      A: "Exploring unconscious motives",
      B: "Improving insight through talk therapy",
      C: "Changing maladaptive behaviors",
      D: "Analyzing dream content"
    },
    correctAnswer: "C",
    explanation: "Behavior therapy focuses on identifying and modifying maladaptive behaviors using principles of learning theory."
  },
  {
    id: 28,
    question: "Which phenomenon describes the tendency to attribute our own actions to external factors while attributing others’ actions to their personality?",
    options: {
      A: "Confirmation bias",
      B: "Fundamental attribution error",
      C: "Self-serving bias",
      D: "Availability heuristic"
    },
    correctAnswer: "B",
    explanation: "The fundamental attribution error is the tendency to explain others’ behaviors by internal characteristics while explaining our own behaviors in terms of external situational factors."
  },
  {
    id: 29,
    question: "What does the 'bystander effect' refer to in social psychology?",
    options: {
      A: "Individuals becoming more active when in groups",
      B: "The diffusion of responsibility in the presence of others",
      C: "Increased self-awareness in large crowds",
      D: "The tendency to conform to group norms"
    },
    correctAnswer: "B",
    explanation: "The bystander effect describes how individuals are less likely to help someone in need when there are other people present, due to a diffusion of responsibility."
  },
  {
    id: 30,
    question: "Which area of psychology studies the relationship between brain processes and behavior?",
    options: {
      A: "Biopsychology",
      B: "Developmental psychology",
      C: "Social psychology",
      D: "Cognitive psychology"
    },
    correctAnswer: "A",
    explanation: "Biopsychology, or biological psychology, examines how the brain and other biological systems influence behavior."
  },
  {
    id: 31,
    question: "What is the only mammal capable of true flight?",
    options: {
      A: "Bat",
      B: "Squirrel",
      C: "Flying squirrel",
      D: "Ostrich"
    },
    correctAnswer: "A",
    explanation: "Bats are the only mammals that can truly fly."
  },
  {
    id: 32,
    question: "Which animal is known to have the longest migration route?",
    options: {
      A: "Monarch butterfly",
      B: "Arctic tern",
      C: "Humpback whale",
      D: "Caribou"
    },
    correctAnswer: "B",
    explanation: "The Arctic tern migrates from the Arctic to the Antarctic and back each year, making it the longest migration of any known animal."
  },
  {
    id: 33,
    question: "What gets wetter as it dries?",
    options: {
      A: "Towel",
      B: "Sponge",
      C: "River",
      D: "Raincoat"
    },
    correctAnswer: "A",
    explanation: "A towel gets wet as it dries you off."
  },
  {
    id: 34,
    question: "Which planet is known as the Red Planet?",
    options: {
      A: "Venus",
      B: "Mars",
      C: "Jupiter",
      D: "Saturn"
    },
    correctAnswer: "B",
    explanation: "Mars is often called the Red Planet due to its reddish appearance."
  },
  {
    id: 35,
    question: "What is the largest living species of lizard?",
    options: {
      A: "Komodo dragon",
      B: "Monitor lizard",
      C: "Iguana",
      D: "Gila monster"
    },
    correctAnswer: "A",
    explanation: "The Komodo dragon is the largest living species of lizard."
  },
  {
    id: 36,
    question: "I speak without a mouth and hear without ears. I have no body, but I come alive with the wind. What am I?",
    options: {
      A: "Echo",
      B: "Shadow",
      C: "Reflection",
      D: "Whisper"
    },
    correctAnswer: "A",
    explanation: "An echo is sound reflected back to the listener, fitting the description."
  },
  {
    id: 37,
    question: "Which bird is known for its ability to solve complex puzzles and use tools?",
    options: {
      A: "Parrot",
      B: "Crow",
      C: "Sparrow",
      D: "Eagle"
    },
    correctAnswer: "B",
    explanation: "Crows are highly intelligent birds known for their problem-solving skills and tool use."
  },
  {
    id: 38,
    question: "What has keys but can't open locks?",
    options: {
      A: "Computer",
      B: "Piano",
      C: "House",
      D: "Car"
    },
    correctAnswer: "B",
    explanation: "A piano has keys but cannot open locks."
  },
  {
    id: 39,
    question: "Which animal is the fastest land animal in the world?",
    options: {
      A: "Cheetah",
      B: "Lion",
      C: "Gazelle",
      D: "Pronghorn antelope"
    },
    correctAnswer: "A",
    explanation: "The cheetah can reach speeds up to 60-70 mph, making it the fastest land animal."
  },
  {
    id: 40,
    question: "What comes once in a minute, twice in a moment, but never in a thousand years?",
    options: {
      A: "The letter 'M'",
      B: "The letter 'N'",
      C: "The number 1",
      D: "The letter 'O'"
    },
    correctAnswer: "A",
    explanation: "The letter 'M' appears once in the word 'minute', twice in 'moment', and not at all in 'thousand years'."
  },
  {
    id: 41,
    question: "Which marine creature is known for its ability to regenerate lost limbs?",
    options: {
      A: "Octopus",
      B: "Starfish",
      C: "Shark",
      D: "Dolphin"
    },
    correctAnswer: "B",
    explanation: "Starfish (or sea stars) can regenerate lost arms."
  },
  {
    id: 42,
    question: "What is the largest species of shark currently living?",
    options: {
      A: "Great white shark",
      B: "Hammerhead shark",
      C: "Whale shark",
      D: "Tiger shark"
    },
    correctAnswer: "C",
    explanation: "The whale shark is the largest living species of shark."
  },
  {
    id: 43,
    question: "The more you take, the more you leave behind. What am I?",
    options: {
      A: "Footsteps",
      B: "Memories",
      C: "Time",
      D: "Shadows"
    },
    correctAnswer: "A",
    explanation: "The riddle refers to footsteps."
  },
  {
    id: 44,
    question: "Which insect is known for its impressive architectural skills, creating intricate hives?",
    options: {
      A: "Ant",
      B: "Bee",
      C: "Wasp",
      D: "Termite"
    },
    correctAnswer: "B",
    explanation: "Bees construct complex hives with hexagonal cells."
  },
  {
    id: 45,
    question: "What has a head, a tail, is brown, and has no legs?",
    options: {
      A: "A penny",
      B: "A snake",
      C: "A comet",
      D: "A lizard"
    },
    correctAnswer: "A",
    explanation: "The riddle describes a penny (a coin)."
  },
  {
    id: 46,
    question: "Which animal is capable of changing its color for camouflage and communication?",
    options: {
      A: "Chameleon",
      B: "Frog",
      C: "Parrot",
      D: "Snake"
    },
    correctAnswer: "A",
    explanation: "Chameleons are famous for their ability to change color to blend into their surroundings."
  },
  {
    id: 47,
    question: "What is the only bird known to fly backwards?",
    options: {
      A: "Hummingbird",
      B: "Sparrow",
      C: "Eagle",
      D: "Penguin"
    },
    correctAnswer: "A",
    explanation: "Hummingbirds have a unique wing structure that allows them to fly backwards."
  },
  {
    id: 48,
    question: "If you have me, you want to share me. If you share me, you don't have me. What am I?",
    options: {
      A: "Secret",
      B: "Money",
      C: "Love",
      D: "Happiness"
    },
    correctAnswer: "A",
    explanation: "The answer to the riddle is a secret."
  },
  {
    id: 49,
    question: "Which mammal is known to have one of the most powerful bites?",
    options: {
      A: "Hippopotamus",
      B: "Lion",
      C: "Tiger",
      D: "Grizzly bear"
    },
    correctAnswer: "A",
    explanation: "Hippopotamuses have extremely powerful jaws and one of the strongest bites among mammals."
  },
  {
    id: 50,
    question: "What can travel around the world while staying in a corner?",
    options: {
      A: "Stamp",
      B: "Satellite",
      C: "Shadow",
      D: "Sunlight"
    },
    correctAnswer: "A",
    explanation: "A postage stamp stays in the corner of an envelope while traveling globally."
  },
  {
    id: 51,
    question: "Which creature is known as the 'master of disguise' in the ocean due to its ability to mimic its surroundings?",
    options: {
      A: "Cuttlefish",
      B: "Shark",
      C: "Dolphin",
      D: "Jellyfish"
    },
    correctAnswer: "A",
    explanation: "Cuttlefish can rapidly change their skin color and texture to blend into their environment."
  },
  {
    id: 52,
    question: "Which animal has the longest pregnancy, lasting up to 22 months?",
    options: {
      A: "Elephant",
      B: "Giraffe",
      C: "Whale",
      D: "Rhinoceros"
    },
    correctAnswer: "A",
    explanation: "Elephants have the longest gestation period of any land animal, lasting up to 22 months."
  },
  {
    id: 53,
    question: "What begins with an 'e' and contains only one letter?",
    options: {
      A: "Envelope",
      B: "Eel",
      C: "Eye",
      D: "Earth"
    },
    correctAnswer: "A",
    explanation: "An envelope begins with 'e' and typically contains one letter."
  },
  {
    id: 54,
    question: "Which animal is known for its unique black and white striped pattern that helps confuse predators?",
    options: {
      A: "Zebra",
      B: "Panda",
      C: "Skunk",
      D: "Orca"
    },
    correctAnswer: "A",
    explanation: "Zebras have distinctive stripes that can confuse predators and help with social interactions."
  },
  {
    id: 55,
    question: "Which amphibian can survive freezing temperatures by partially freezing its body?",
    options: {
      A: "Tree frog",
      B: "Poison dart frog",
      C: "Wood frog",
      D: "Bullfrog"
    },
    correctAnswer: "C",
    explanation: "The wood frog can tolerate freezing temperatures by allowing parts of its body to freeze and then thaw."
  },
  {
    id: 56,
    question: "What has cities, but no houses; forests, but no trees; and water, but no fish?",
    options: {
      A: "Map",
      B: "Painting",
      C: "Riddle",
      D: "Dream"
    },
    correctAnswer: "A",
    explanation: "A map features representations of cities, forests, and bodies of water, but not the actual objects."
  },
  {
    id: 57,
    question: "Which animal can sleep for up to 20 hours a day?",
    options: {
      A: "Koala",
      B: "Sloth",
      C: "Lion",
      D: "Cat"
    },
    correctAnswer: "A",
    explanation: "Koalas are known for their long hours of sleep, often up to 20 hours per day."
  },
  {
    id: 58,
    question: "Which class of animals typically has a three-chambered heart?",
    options: {
      A: "Birds",
      B: "Mammals",
      C: "Amphibians",
      D: "Fish"
    },
    correctAnswer: "C",
    explanation: "Most amphibians have a three-chambered heart, unlike mammals and birds which have four."
  },
  {
    id: 59,
    question: "I am taken from a mine and shut in a wooden case, from which I am never released, and yet I am used by almost every person. What am I?",
    options: {
      A: "Pencil lead",
      B: "Diamond",
      C: "Coal",
      D: "Gold"
    },
    correctAnswer: "A",
    explanation: "Pencil lead (graphite) is mined, encased in wood, and used by many people for writing."
  },
  {
    id: 60,
    question: "Which sea creature has three hearts?",
    options: {
      A: "Octopus",
      B: "Jellyfish",
      C: "Shark",
      D: "Squid"
    },
    correctAnswer: "A",
    explanation: "Octopuses have three hearts: two pump blood to the gills, while the third circulates it to the rest of the body."
  }  
];

// Export the array of 30 questions so that your API routes can use it.
module.exports = questions;
