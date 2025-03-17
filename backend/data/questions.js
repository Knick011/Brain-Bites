// Desktop/brain-bites/backend/data/questions.js

// This file contains 100 unique fun fact and brain teaser questions.
// Each question includes a unique ID, the question text, four options,
// the correct answer, and an explanation.

const questions = [
  {
    id: 1,
    question: "What is the only mammal capable of true flight?",
    options: {
      A: "Flying squirrel",
      B: "Bat",
      C: "Squirrel",
      D: "Ostrich"
    },
    correctAnswer: "B",
    explanation: "Bats are the only mammals that can truly fly."
  },
  {
    id: 2,
    question: "Which animal is known to have the longest migration route?",
    options: {
      A: "Humpback whale",
      B: "Arctic tern",
      C: "Caribou",
      D: "Monarch butterfly"
    },
    correctAnswer: "B",
    explanation: "The Arctic tern migrates from the Arctic to the Antarctic and back each year."
  },
  {
    id: 3,
    question: "What gets wetter as it dries?",
    options: {
      A: "Sponge",
      B: "Towel",
      C: "Raincoat",
      D: "River"
    },
    correctAnswer: "B",
    explanation: "A towel gets wet as it dries you off."
  },
  {
    id: 4,
    question: "Which planet is known as the Red Planet?",
    options: {
      A: "Saturn",
      B: "Jupiter",
      C: "Mars",
      D: "Venus"
    },
    correctAnswer: "C",
    explanation: "Mars is often called the Red Planet due to its reddish appearance."
  },
  {
    id: 5,
    question: "What is the largest living species of lizard?",
    options: {
      A: "Monitor lizard",
      B: "Iguana",
      C: "Gila monster",
      D: "Komodo dragon"
    },
    correctAnswer: "D",
    explanation: "The Komodo dragon is the largest living species of lizard."
  },
  {
    id: 6,
    question: "I speak without a mouth and hear without ears. I have no body, but I come alive with the wind. What am I?",
    options: {
      A: "Shadow",
      B: "Echo",
      C: "Reflection",
      D: "Whisper"
    },
    correctAnswer: "B",
    explanation: "An echo is sound reflected back to the listener."
  },
  {
    id: 7,
    question: "Which bird is known for its ability to solve complex puzzles and use tools?",
    options: {
      A: "Eagle",
      B: "Sparrow",
      C: "Crow",
      D: "Parrot"
    },
    correctAnswer: "C",
    explanation: "Crows are highly intelligent birds known for their problem-solving skills and tool use."
  },
  {
    id: 8,
    question: "What has keys but can't open locks?",
    options: {
      A: "Map",
      B: "Piano",
      C: "Keyboard",
      D: "Computer"
    },
    correctAnswer: "B",
    explanation: "A piano has keys but cannot open locks."
  },
  {
    id: 9,
    question: "Which animal is the fastest land animal in the world?",
    options: {
      A: "Lion",
      B: "Cheetah",
      C: "Pronghorn antelope",
      D: "Gazelle"
    },
    correctAnswer: "B",
    explanation: "The cheetah can reach speeds up to 60-70 mph."
  },
  {
    id: 10,
    question: "What comes once in a minute, twice in a moment, but never in a thousand years?",
    options: {
      A: "The letter 'N'",
      B: "The letter 'O'",
      C: "The letter 'M'",
      D: "The number 1"
    },
    correctAnswer: "C",
    explanation: "The letter 'M' appears once in 'minute', twice in 'moment', and not at all in 'thousand years'."
  },
  {
    id: 11,
    question: "Which marine creature is known for its ability to regenerate lost limbs?",
    options: {
      A: "Shark",
      B: "Octopus",
      C: "Dolphin",
      D: "Starfish"
    },
    correctAnswer: "D",
    explanation: "Starfish can regenerate lost arms."
  },
  {
    id: 12,
    question: "What is the largest species of shark currently living?",
    options: {
      A: "Tiger shark",
      B: "Whale shark",
      C: "Great white shark",
      D: "Hammerhead shark"
    },
    correctAnswer: "B",
    explanation: "The whale shark is the largest living species of shark."
  },
  {
    id: 13,
    question: "The more you take, the more you leave behind. What am I?",
    options: {
      A: "Memories",
      B: "Footsteps",
      C: "Shadows",
      D: "Time"
    },
    correctAnswer: "B",
    explanation: "The riddle refers to footsteps."
  },
  {
    id: 14,
    question: "Which insect is known for its impressive architectural skills, creating intricate hives?",
    options: {
      A: "Termite",
      B: "Ant",
      C: "Bee",
      D: "Wasp"
    },
    correctAnswer: "C",
    explanation: "Bees construct complex hives with hexagonal cells."
  },
  {
    id: 15,
    question: "What has a head, a tail, is brown, and has no legs?",
    options: {
      A: "A snake",
      B: "A comet",
      C: "A penny",
      D: "A lizard"
    },
    correctAnswer: "C",
    explanation: "The riddle describes a penny."
  },
  {
    id: 16,
    question: "Which animal is capable of changing its color for camouflage and communication?",
    options: {
      A: "Frog",
      B: "Snake",
      C: "Chameleon",
      D: "Parrot"
    },
    correctAnswer: "C",
    explanation: "Chameleons can change color to blend into their surroundings."
  },
  {
    id: 17,
    question: "What is the only bird known to fly backwards?",
    options: {
      A: "Penguin",
      B: "Hummingbird",
      C: "Sparrow",
      D: "Eagle"
    },
    correctAnswer: "B",
    explanation: "Hummingbirds have a unique wing structure that allows them to fly backwards."
  },
  {
    id: 18,
    question: "If you have me, you want to share me. If you share me, you don't have me. What am I?",
    options: {
      A: "Happiness",
      B: "Secret",
      C: "Love",
      D: "Money"
    },
    correctAnswer: "B",
    explanation: "A secret loses its secrecy once shared."
  },
  {
    id: 19,
    question: "Which mammal is known to have one of the most powerful bites?",
    options: {
      A: "Lion",
      B: "Hippopotamus",
      C: "Grizzly bear",
      D: "Tiger"
    },
    correctAnswer: "B",
    explanation: "Hippopotamuses have extremely powerful jaws."
  },
  {
    id: 20,
    question: "What can travel around the world while staying in a corner?",
    options: {
      A: "Shadow",
      B: "Stamp",
      C: "Sunlight",
      D: "Satellite"
    },
    correctAnswer: "B",
    explanation: "A postage stamp stays in the corner of an envelope while traveling globally."
  },
  {
    id: 21,
    question: "Which creature is known as the 'master of disguise' in the ocean due to its ability to mimic its surroundings?",
    options: {
      A: "Jellyfish",
      B: "Cuttlefish",
      C: "Dolphin",
      D: "Shark"
    },
    correctAnswer: "B",
    explanation: "Cuttlefish can rapidly change their skin appearance."
  },
  {
    id: 22,
    question: "Which animal has the longest pregnancy, lasting up to 22 months?",
    options: {
      A: "Rhinoceros",
      B: "Whale",
      C: "Giraffe",
      D: "Elephant"
    },
    correctAnswer: "D",
    explanation: "Elephants have one of the longest gestation periods."
  },
  {
    id: 23,
    question: "What begins with an 'e' and contains only one letter?",
    options: {
      A: "Eye",
      B: "Envelope",
      C: "Earth",
      D: "Eel"
    },
    correctAnswer: "B",
    explanation: "An envelope begins with 'e' and typically contains a letter."
  },
  {
    id: 24,
    question: "Which animal is known for its unique black and white striped pattern that helps confuse predators?",
    options: {
      A: "Skunk",
      B: "Zebra",
      C: "Panda",
      D: "Orca"
    },
    correctAnswer: "B",
    explanation: "Zebras have distinctive stripes that can confuse predators."
  },
  {
    id: 25,
    question: "Which amphibian can survive freezing temperatures by partially freezing its body?",
    options: {
      A: "Bullfrog",
      B: "Wood frog",
      C: "Poison dart frog",
      D: "Tree frog"
    },
    correctAnswer: "B",
    explanation: "The wood frog can tolerate freezing temperatures."
  },
  {
    id: 26,
    question: "What has cities, but no houses; forests, but no trees; and water, but no fish?",
    options: {
      A: "Riddle",
      B: "Map",
      C: "Dream",
      D: "Painting"
    },
    correctAnswer: "B",
    explanation: "A map represents these elements symbolically."
  },
  {
    id: 27,
    question: "Which animal can sleep for up to 20 hours a day?",
    options: {
      A: "Lion",
      B: "Koala",
      C: "Cat",
      D: "Sloth"
    },
    correctAnswer: "B",
    explanation: "Koalas are known for their long hours of sleep."
  },
  {
    id: 28,
    question: "Which class of animals typically has a three-chambered heart?",
    options: {
      A: "Mammals",
      B: "Birds",
      C: "Amphibians",
      D: "Fish"
    },
    correctAnswer: "C",
    explanation: "Most amphibians have a three-chambered heart."
  },
  {
    id: 29,
    question: "I am taken from a mine and shut in a wooden case, from which I am never released, and yet I am used by almost every person. What am I?",
    options: {
      A: "Diamond",
      B: "Pencil lead",
      C: "Gold",
      D: "Coal"
    },
    correctAnswer: "B",
    explanation: "Pencil lead (graphite) is mined and encased in wood."
  },
  {
    id: 30,
    question: "Which sea creature has three hearts?",
    options: {
      A: "Jellyfish",
      B: "Octopus",
      C: "Squid",
      D: "Shark"
    },
    correctAnswer: "B",
    explanation: "Octopuses have three hearts: two pump blood to the gills and one circulates it to the body."
  },
  {
    id: 31,
    question: "What has a heart but no other organs?",
    options: {
      A: "Deck of cards",
      B: "Clock",
      C: "Human",
      D: "Robot"
    },
    correctAnswer: "A",
    explanation: "A deck of cards contains a suit called hearts."
  },
  {
    id: 32,
    question: "What can fill a room but takes up no space?",
    options: {
      A: "Water",
      B: "Sound",
      C: "Air",
      D: "Light"
    },
    correctAnswer: "D",
    explanation: "Light fills a room without occupying physical space."
  },
  {
    id: 33,
    question: "I have keys but no locks. I have space but no rooms. You can enter, but you can't go outside. What am I?",
    options: {
      A: "House",
      B: "Keyboard",
      C: "Map",
      D: "Computer"
    },
    correctAnswer: "B",
    explanation: "A keyboard has keys and a space bar."
  },
  {
    id: 34,
    question: "What gets broken without being held?",
    options: {
      A: "Glass",
      B: "Seal",
      C: "Promise",
      D: "Heart"
    },
    correctAnswer: "C",
    explanation: "A promise can be broken without any physical interaction."
  },
  {
    id: 35,
    question: "What invention lets you look right through a wall?",
    options: {
      A: "Door",
      B: "Mirror",
      C: "Window",
      D: "Magnifying glass"
    },
    correctAnswer: "C",
    explanation: "A window allows you to see through a wall."
  },
  {
    id: 36,
    question: "What has one eye but cannot see?",
    options: {
      A: "Cyclone",
      B: "Needle",
      C: "Hurricane",
      D: "Storm"
    },
    correctAnswer: "B",
    explanation: "A needle has an eye for threading but cannot see."
  },
  {
    id: 37,
    question: "I am not alive, but I grow; I don't have lungs, but I need air; I don't have a mouth, but water kills me. What am I?",
    options: {
      A: "Wind",
      B: "Plant",
      C: "Fire",
      D: "Rust"
    },
    correctAnswer: "C",
    explanation: "Fire grows, needs air, and is extinguished by water."
  },
  {
    id: 38,
    question: "What belongs to you but is used more by others?",
    options: {
      A: "Your phone",
      B: "Your name",
      C: "Your clothes",
      D: "Your car"
    },
    correctAnswer: "B",
    explanation: "Your name is used more frequently by others than by you."
  },
  {
    id: 39,
    question: "What can run but never walks?",
    options: {
      A: "Car",
      B: "River",
      C: "Clock",
      D: "Time"
    },
    correctAnswer: "B",
    explanation: "A river runs continuously without walking."
  },
  {
    id: 40,
    question: "What gets sharper the more you use it?",
    options: {
      A: "Pencil",
      B: "Shoe",
      C: "Mind",
      D: "Knife"
    },
    correctAnswer: "C",
    explanation: "Your mind improves and becomes sharper with use."
  },
  {
    id: 41,
    question: "What has many teeth but cannot bite?",
    options: {
      A: "Fork",
      B: "Saw",
      C: "Comb",
      D: "Zipper"
    },
    correctAnswer: "C",
    explanation: "A comb has teeth but cannot bite."
  },
  {
    id: 42,
    question: "What goes up but never comes down?",
    options: {
      A: "Helium",
      B: "Age",
      C: "Balloon",
      D: "Smoke"
    },
    correctAnswer: "B",
    explanation: "Your age only increases over time."
  },
  {
    id: 43,
    question: "What has a face and two hands but no arms or legs?",
    options: {
      A: "Book",
      B: "Clock",
      C: "Coin",
      D: "Mirror"
    },
    correctAnswer: "B",
    explanation: "A clock has a face and hands but no limbs."
  },
  {
    id: 44,
    question: "What has a bottom at the top?",
    options: {
      A: "Tree",
      B: "Leg",
      C: "Hat",
      D: "River"
    },
    correctAnswer: "B",
    explanation: "This riddle plays on words: a leg’s 'bottom' (buttocks) is humorously referenced."
  },
  {
    id: 45,
    question: "What comes down but never goes up?",
    options: {
      A: "Sun",
      B: "Rain",
      C: "Temperature",
      D: "Ball"
    },
    correctAnswer: "B",
    explanation: "Rain falls and does not come back up."
  },
  {
    id: 46,
    question: "I’m tall when I’m young, and I’m short when I’m old. What am I?",
    options: {
      A: "Person",
      B: "Candle",
      C: "Tree",
      D: "Mountain"
    },
    correctAnswer: "B",
    explanation: "A candle burns down over time, becoming shorter."
  },
  {
    id: 47,
    question: "What can you catch but not throw?",
    options: {
      A: "Idea",
      B: "Cold",
      C: "Fish",
      D: "Ball"
    },
    correctAnswer: "B",
    explanation: "You can catch a cold, but you can't physically throw it."
  },
  {
    id: 48,
    question: "What has to be broken before you can use it?",
    options: {
      A: "Nut",
      B: "Lock",
      C: "Egg",
      D: "Seal"
    },
    correctAnswer: "C",
    explanation: "An egg must be cracked open before it can be used."
  },
  {
    id: 49,
    question: "What has one head, one foot, and four legs?",
    options: {
      A: "Chair",
      B: "Bed",
      C: "Table",
      D: "Sofa"
    },
    correctAnswer: "B",
    explanation: "A bed has a headboard, a footboard, and four legs."
  },
  {
    id: 50,
    question: "What has words but never speaks?",
    options: {
      A: "Radio",
      B: "Picture",
      C: "Television",
      D: "Book"
    },
    correctAnswer: "D",
    explanation: "A book contains words but does not speak."
  },
  {
    id: 51,
    question: "What is always in front of you but can’t be seen?",
    options: {
      A: "Mirror",
      B: "Future",
      C: "Air",
      D: "Shadow"
    },
    correctAnswer: "B",
    explanation: "The future is unseen yet always ahead."
  },
  {
    id: 52,
    question: "What begins with T, ends with T, and has T in it?",
    options: {
      A: "Truck",
      B: "Tent",
      C: "Teapot",
      D: "T-shirt"
    },
    correctAnswer: "C",
    explanation: "A teapot starts and ends with the letter 'T' and holds tea."
  },
  {
    id: 53,
    question: "What is so fragile that saying its name breaks it?",
    options: {
      A: "Glass",
      B: "Silence",
      C: "Ice",
      D: "Promise"
    },
    correctAnswer: "B",
    explanation: "Silence is broken when you speak."
  },
  {
    id: 54,
    question: "What can you hold in your left hand but not in your right hand?",
    options: {
      A: "A book",
      B: "A pen",
      C: "Your right hand",
      D: "A phone"
    },
    correctAnswer: "C",
    explanation: "You cannot hold your right hand with your right hand."
  },
  {
    id: 55,
    question: "What gets bigger the more you take away from it?",
    options: {
      A: "A tree",
      B: "A mountain",
      C: "A hole",
      D: "A balloon"
    },
    correctAnswer: "C",
    explanation: "Removing material from a hole makes it larger."
  },
  {
    id: 56,
    question: "What has a ring but no finger?",
    options: {
      A: "Doorbell",
      B: "Boxing ring",
      C: "Telephone",
      D: "Planet Saturn"
    },
    correctAnswer: "C",
    explanation: "A telephone rings but doesn't have fingers."
  },
  {
    id: 57,
    question: "What has a neck but no head?",
    options: {
      A: "Shirt",
      B: "Bottle",
      C: "Guitar",
      D: "Scarf"
    },
    correctAnswer: "B",
    explanation: "A bottle has a neck but no head."
  },
  {
    id: 58,
    question: "What kind of room has no doors or windows?",
    options: {
      A: "Classroom",
      B: "Mushroom",
      C: "Bathroom",
      D: "Ballroom"
    },
    correctAnswer: "B",
    explanation: "Mushroom is a play on words that sounds like a room."
  },
  {
    id: 59,
    question: "What can run but never walks, has a mouth but never talks?",
    options: {
      A: "Car",
      B: "Shadow",
      C: "River",
      D: "Clock"
    },
    correctAnswer: "C",
    explanation: "A river runs and has a mouth but does not speak."
  },
  {
    id: 60,
    question: "What begins with an E, ends with an E, but only contains one letter?",
    options: {
      A: "Edge",
      B: "Envelope",
      C: "Eagle",
      D: "Example"
    },
    correctAnswer: "B",
    explanation: "An envelope fits the description."
  },
  {
    id: 61,
    question: "What has hands but cannot clap?",
    options: {
      A: "Book",
      B: "Robot",
      C: "Clock",
      D: "Mannequin"
    },
    correctAnswer: "C",
    explanation: "A clock's hands cannot clap."
  },
  {
    id: 62,
    question: "What has a thumb and four fingers but is not alive?",
    options: {
      A: "Fist",
      B: "Mitten",
      C: "Sock",
      D: "Glove"
    },
    correctAnswer: "D",
    explanation: "A glove has a thumb and four finger slots but is not living."
  },
  {
    id: 63,
    question: "What flies without wings?",
    options: {
      A: "Kite",
      B: "Bird",
      C: "Time",
      D: "Airplane"
    },
    correctAnswer: "C",
    explanation: "Time flies, at least metaphorically."
  },
  {
    id: 64,
    question: "What starts with a 'P', ends with an 'E', and has thousands of letters?",
    options: {
      A: "Pen",
      B: "Post office",
      C: "Pineapple",
      D: "Phone"
    },
    correctAnswer: "B",
    explanation: "A post office handles thousands of letters."
  },
  {
    id: 65,
    question: "What kind of tree can you carry in your hand?",
    options: {
      A: "Maple",
      B: "Birch",
      C: "Palm",
      D: "Oak"
    },
    correctAnswer: "C",
    explanation: "The word 'palm' refers to both a type of tree and the inside of your hand."
  },
  {
    id: 66,
    question: "What goes through cities and fields but never moves?",
    options: {
      A: "Train",
      B: "Wind",
      C: "Road",
      D: "River"
    },
    correctAnswer: "C",
    explanation: "A road stretches across areas without moving."
  },
  {
    id: 67,
    question: "I have branches, but no fruit, trunk, or leaves. What am I?",
    options: {
      A: "Company",
      B: "Bank",
      C: "Government",
      D: "River"
    },
    correctAnswer: "B",
    explanation: "A bank has branches, though not in the botanical sense."
  },
  {
    id: 68,
    question: "What has a bed but never sleeps?",
    options: {
      A: "Car",
      B: "Mountain",
      C: "Book",
      D: "River"
    },
    correctAnswer: "D",
    explanation: "A river has a bed but never sleeps."
  },
  {
    id: 69,
    question: "What can you keep after giving it to someone?",
    options: {
      A: "Time",
      B: "Your word",
      C: "Love",
      D: "Money"
    },
    correctAnswer: "B",
    explanation: "Your word remains with you even after you give it."
  },
  {
    id: 70,
    question: "What has legs but doesn't walk?",
    options: {
      A: "Chair",
      B: "Cloud",
      C: "Table",
      D: "Snake"
    },
    correctAnswer: "C",
    explanation: "A table has legs but cannot move on its own."
  },
  {
    id: 71,
    question: "What has a face but no eyes?",
    options: {
      A: "Dice",
      B: "Book",
      C: "Clock",
      D: "Coin"
    },
    correctAnswer: "D",
    explanation: "A coin has a face (heads) but no eyes."
  },
  {
    id: 72,
    question: "What word is spelled incorrectly in every single dictionary?",
    options: {
      A: "Typo",
      B: "Misspelled",
      C: "Incorrectly",
      D: "Wrong"
    },
    correctAnswer: "C",
    explanation: "The word 'incorrectly' is always spelled as 'incorrectly' in dictionaries."
  },
  {
    id: 73,
    question: "I’m light as a feather, yet the strongest man can’t hold me for more than 5 minutes. What am I?",
    options: {
      A: "Air",
      B: "Fire",
      C: "Breath",
      D: "Water"
    },
    correctAnswer: "C",
    explanation: "Breath is light, yet no one can hold it for very long."
  },
  {
    id: 74,
    question: "What runs around the whole yard without moving?",
    options: {
      A: "Dog",
      B: "Fence",
      C: "Grass",
      D: "Shadow"
    },
    correctAnswer: "B",
    explanation: "A fence encloses a yard but doesn't move."
  },
  {
    id: 75,
    question: "What has holes but still holds water?",
    options: {
      A: "Bucket",
      B: "Sponge",
      C: "Strainer",
      D: "Net"
    },
    correctAnswer: "B",
    explanation: "A sponge is porous yet absorbs water."
  },
  {
    id: 76,
    question: "What has a head and a tail but no body?",
    options: {
      A: "Snake",
      B: "Wind",
      C: "Coin",
      D: "Shadow"
    },
    correctAnswer: "C",
    explanation: "A coin has a head and a tail but no body."
  },
  {
    id: 77,
    question: "What comes once in a year, twice in a week, but never in a day?",
    options: {
      A: "The letter Y",
      B: "The letter E",
      C: "The letter R",
      D: "The letter A"
    },
    correctAnswer: "B",
    explanation: "The letter E appears once in 'year', twice in 'week', and not in 'day'."
  },
  {
    id: 78,
    question: "What can you break, even if you never pick it up or touch it?",
    options: {
      A: "Heart",
      B: "Promise",
      C: "Glass",
      D: "Wind"
    },
    correctAnswer: "B",
    explanation: "A promise can be broken without any physical interaction."
  },
  {
    id: 79,
    question: "What has rivers with no water, forests with no trees, and cities with no buildings?",
    options: {
      A: "Drawing",
      B: "Puzzle",
      C: "Map",
      D: "Desert"
    },
    correctAnswer: "C",
    explanation: "A map represents these features symbolically."
  },
  {
    id: 80,
    question: "What kind of band never plays music?",
    options: {
      A: "Marching band",
      B: "Rubber band",
      C: "Rock band",
      D: "Jazz band"
    },
    correctAnswer: "B",
    explanation: "A rubber band is not a musical band."
  },
  {
    id: 81,
    question: "What has an eye but cannot see, and is also a type of storm?",
    options: {
      A: "Needle",
      B: "Tornado",
      C: "Hurricane",
      D: "Cyclone"
    },
    correctAnswer: "C",
    explanation: "A hurricane has an eye, but it cannot see."
  },
  {
    id: 82,
    question: "What goes through cities and fields but never moves?",
    options: {
      A: "Train",
      B: "Road",
      C: "Wind",
      D: "River"
    },
    correctAnswer: "B",
    explanation: "A road stretches across areas without moving."
  },
  {
    id: 83,
    question: "I have branches, but no fruit, trunk, or leaves. What am I?",
    options: {
      A: "Government",
      B: "Company",
      C: "Bank",
      D: "River"
    },
    correctAnswer: "C",
    explanation: "A bank has branches, though not in the botanical sense."
  },
  {
    id: 84,
    question: "What has a bed but never sleeps?",
    options: {
      A: "Book",
      B: "Car",
      C: "River",
      D: "Mountain"
    },
    correctAnswer: "C",
    explanation: "A river has a bed but never sleeps."
  },
  {
    id: 85,
    question: "What can you keep after giving it to someone?",
    options: {
      A: "Time",
      B: "Your word",
      C: "Love",
      D: "Money"
    },
    correctAnswer: "B",
    explanation: "Your word remains with you even after you give it."
  },
  {
    id: 86,
    question: "What has legs but doesn't walk?",
    options: {
      A: "Snake",
      B: "Chair",
      C: "Table",
      D: "Cloud"
    },
    correctAnswer: "C",
    explanation: "A table has legs but cannot move on its own."
  },
  {
    id: 87,
    question: "What flies without wings?",
    options: {
      A: "Kite",
      B: "Time",
      C: "Bird",
      D: "Airplane"
    },
    correctAnswer: "B",
    explanation: "Time flies, at least metaphorically."
  },
  {
    id: 88,
    question: "Which animal is known for having the longest lifespan in captivity?",
    options: {
      A: "Elephant",
      B: "Tortoise",
      C: "Parrot",
      D: "Dog"
    },
    correctAnswer: "B",
    explanation: "Some tortoises can live over 100 years in captivity."
  },
  {
    id: 89,
    question: "What is the fastest marine animal?",
    options: {
      A: "Marlin",
      B: "Shark",
      C: "Sailfish",
      D: "Dolphin"
    },
    correctAnswer: "C",
    explanation: "The sailfish is considered the fastest marine animal."
  },
  {
    id: 90,
    question: "Which bird is known for its elaborate courtship dance?",
    options: {
      A: "Peacock",
      B: "Flamingo",
      C: "Sage grouse",
      D: "Penguin"
    },
    correctAnswer: "C",
    explanation: "The sage grouse is famous for its intricate mating dance."
  },
  {
    id: 91,
    question: "Which mammal is known to have the most powerful sense of smell?",
    options: {
      A: "Bear",
      B: "Bloodhound",
      C: "Dog",
      D: "Elephant"
    },
    correctAnswer: "B",
    explanation: "Bloodhounds have an extraordinarily keen sense of smell."
  },
  {
    id: 92,
    question: "Which insect can lift objects many times its own weight?",
    options: {
      A: "Beetle",
      B: "Ant",
      C: "Fly",
      D: "Bee"
    },
    correctAnswer: "B",
    explanation: "Ants can carry several times their body weight."
  },
  {
    id: 93,
    question: "Which animal has the highest brain-to-body mass ratio?",
    options: {
      A: "Owl",
      B: "Shrew",
      C: "Bat",
      D: "Squirrel"
    },
    correctAnswer: "B",
    explanation: "Shrews have one of the highest brain-to-body mass ratios among mammals."
  },
  {
    id: 94,
    question: "What is the tallest animal on Earth?",
    options: {
      A: "Elephant",
      B: "Camel",
      C: "Giraffe",
      D: "Ostrich"
    },
    correctAnswer: "C",
    explanation: "Giraffes are the tallest land animals."
  },
  {
    id: 95,
    question: "What is the largest animal in the world?",
    options: {
      A: "African elephant",
      B: "Great white shark",
      C: "Blue whale",
      D: "Giraffe"
    },
    correctAnswer: "C",
    explanation: "The blue whale is the largest animal known to have ever existed."
  },
  {
    id: 96,
    question: "Which animal is known for its ability to mimic human speech?",
    options: {
      A: "Peacock",
      B: "Crow",
      C: "Parrot",
      D: "Sparrow"
    },
    correctAnswer: "C",
    explanation: "Parrots are famous for their ability to mimic human speech."
  },
  {
    id: 97,
    question: "Which animal is known to be the largest rodent in the world?",
    options: {
      A: "Beaver",
      B: "Hamster",
      C: "Capybara",
      D: "Squirrel"
    },
    correctAnswer: "C",
    explanation: "The capybara is the largest rodent in the world."
  },
  {
    id: 98,
    question: "What is the smallest country in the world by land area?",
    options: {
      A: "Nauru",
      B: "Vatican City",
      C: "Monaco",
      D: "San Marino"
    },
    correctAnswer: "B",
    explanation: "Vatican City is the smallest country in the world by area."
  },
  {
    id: 99,
    question: "What is the hottest planet in our solar system?",
    options: {
      A: "Mercury",
      B: "Mars",
      C: "Jupiter",
      D: "Venus"
    },
    correctAnswer: "D",
    explanation: "Venus is the hottest planet due to its thick, heat-trapping atmosphere."
  },
  {
    id: 100,
    question: "What word becomes shorter when you add two letters to it?",
    options: {
      A: "Small",
      B: "Short",
      C: "Tiny",
      D: "Brief"
    },
    correctAnswer: "B",
    explanation: "Adding 'er' to 'short' literally makes it 'shorter'."
  },
  {
    id: 101,
    question: "What has roots that nobody sees, is taller than trees, and whose head is in the clouds?",
    options: {
      A: "Skyscraper",
      B: "Mountain",
      C: "Forest",
      D: "River"
    },
    correctAnswer: "B",
    explanation: "This classic riddle describes a mountain."
  },
  {
    id: 102,
    question: "What is always coming but never arrives?",
    options: {
      A: "Tomorrow",
      B: "Future",
      C: "Next week",
      D: "Time"
    },
    correctAnswer: "A",
    explanation: "Tomorrow is perpetually in the future."
  },
  {
    id: 103,
    question: "What goes up and down but doesn't move?",
    options: {
      A: "Yo-yo",
      B: "Stairs",
      C: "Temperature",
      D: "Elevator"
    },
    correctAnswer: "B",
    explanation: "Stairs go up and down but remain stationary."
  },
  {
    id: 104,
    question: "I shave every day, but my beard stays the same. Who am I?",
    options: {
      A: "Barber",
      B: "Actor",
      C: "Librarian",
      D: "Teacher"
    },
    correctAnswer: "A",
    explanation: "A barber shaves others every day, yet his own beard remains unchanged."
  },
  {
    id: 105,
    question: "What is black when it's clean and white when it's dirty?",
    options: {
      A: "Paper",
      B: "Chalkboard",
      C: "Wall",
      D: "Mirror"
    },
    correctAnswer: "B",
    explanation: "A chalkboard is black when clean, and becomes white when covered in chalk dust."
  },
  {
    id: 106,
    question: "What is in the middle of March and April?",
    options: {
      A: "A",
      B: "R",
      C: "C",
      D: "I"
    },
    correctAnswer: "B",
    explanation: "The middle letter of both 'March' and 'April' is R."
  },
  {
    id: 107,
    question: "What word, when pronounced wrong, is right?",
    options: {
      A: "Incorrect",
      B: "Right",
      C: "Wrong",
      D: "Proper"
    },
    correctAnswer: "C",
    explanation: "When you say the word 'wrong' incorrectly, it sounds like 'right'."
  },
  {
    id: 108,
    question: "What can you serve but not eat?",
    options: {
      A: "A sandwich",
      B: "A tennis ball",
      C: "A hotdog",
      D: "A cookie"
    },
    correctAnswer: "B",
    explanation: "In sports, you serve a tennis ball, which isn’t edible."
  },
  {
    id: 109,
    question: "What has a spine but no bones?",
    options: {
      A: "Cactus",
      B: "Book",
      C: "Snake",
      D: "Fish"
    },
    correctAnswer: "B",
    explanation: "A book has a spine—the binding edge—but no bones."
  },
  {
    id: 110,
    question: "What has ears but cannot hear?",
    options: {
      A: "Rock",
      B: "Door",
      C: "Corn",
      D: "Bat"
    },
    correctAnswer: "C",
    explanation: "Corn has 'ears' but cannot actually hear."
  },
  {
    id: 111,
    question: "What can you hold without using your hands?",
    options: {
      A: "Water",
      B: "Light",
      C: "Breath",
      D: "Time"
    },
    correctAnswer: "C",
    explanation: "You can hold your breath, but you cannot physically grasp it."
  },
  {
    id: 112,
    question: "Which planet spins on its side, giving it extreme seasonal variations?",
    options: {
      A: "Neptune",
      B: "Uranus",
      C: "Mars",
      D: "Saturn"
    },
    correctAnswer: "B",
    explanation: "Uranus rotates on its side, leading to unusual seasonal changes."
  },
  {
    id: 113,
    question: "Which animal is known for its unique ability to sleep standing up?",
    options: {
      A: "Cow",
      B: "Sheep",
      C: "Horse",
      D: "Goat"
    },
    correctAnswer: "C",
    explanation: "Horses are known to sleep while standing up."
  },
  {
    id: 114,
    question: "What is the largest internal organ in the human body?",
    options: {
      A: "Heart",
      B: "Brain",
      C: "Liver",
      D: "Lung"
    },
    correctAnswer: "C",
    explanation: "The liver is the largest internal organ responsible for many vital functions."
  },
  {
    id: 115,
    question: "Which animal is known as the 'Ship of the Desert'?",
    options: {
      A: "Camel",
      B: "Horse",
      C: "Llama",
      D: "Elephant"
    },
    correctAnswer: "A",
    explanation: "Camels are known as the 'Ship of the Desert' due to their ability to travel long distances in arid regions."
  },
  {
    id: 116,
    question: "What is the only fruit that has its seeds on the outside?",
    options: {
      A: "Apple",
      B: "Orange",
      C: "Strawberry",
      D: "Banana"
    },
    correctAnswer: "C",
    explanation: "Strawberries are unique in that their seeds are on the outside."
  },
  {
    id: 117,
    question: "What is the world's most widely spoken language by native speakers?",
    options: {
      A: "English",
      B: "Hindi",
      C: "Spanish",
      D: "Mandarin Chinese"
    },
    correctAnswer: "D",
    explanation: "Mandarin Chinese has the highest number of native speakers in the world."
  },
  {
    id: 118,
    question: "What is the hardest natural substance on Earth?",
    options: {
      A: "Graphite",
      B: "Quartz",
      C: "Diamond",
      D: "Steel"
    },
    correctAnswer: "C",
    explanation: "Diamond is the hardest naturally occurring material known."
  },
  {
    id: 119,
    question: "What is the smallest bone in the human body?",
    options: {
      A: "Femur",
      B: "Stapes",
      C: "Tibia",
      D: "Ulna"
    },
    correctAnswer: "B",
    explanation: "The stapes, located in the middle ear, is the smallest bone in the human body."
  },
  {
    id: 120,
    question: "Which element has the chemical symbol 'O'?",
    options: {
      A: "Osmium",
      B: "Oxygen",
      C: "Gold",
      D: "Oganesson"
    },
    correctAnswer: "B",
    explanation: "Oxygen is represented by the symbol 'O' and is essential for life."
  },
  {
    id: 121,
    question: "Which planet is famous for its prominent ring system?",
    options: {
      A: "Uranus",
      B: "Saturn",
      C: "Neptune",
      D: "Mars"
    },
    correctAnswer: "B",
    explanation: "Saturn is renowned for its stunning rings."
  },
  {
    id: 122,
    question: "Which ocean is the largest on Earth?",
    options: {
      A: "Atlantic Ocean",
      B: "Indian Ocean",
      C: "Arctic Ocean",
      D: "Pacific Ocean"
    },
    correctAnswer: "D",
    explanation: "The Pacific Ocean is the largest ocean on the planet."
  },
  {
    id: 123,
    question: "What is the main gas found in Earth's atmosphere?",
    options: {
      A: "Oxygen",
      B: "Carbon Dioxide",
      C: "Hydrogen",
      D: "Nitrogen"
    },
    correctAnswer: "D",
    explanation: "Nitrogen makes up about 78% of the Earth's atmosphere."
  },
  {
    id: 124,
    question: "Which animal is known for having one of the longest lifespans, sometimes exceeding 150 years?",
    options: {
      A: "Blue whale",
      B: "Elephant",
      C: "Tortoise",
      D: "Parrot"
    },
    correctAnswer: "C",
    explanation: "Certain species of tortoise are known to live for over 150 years."
  },
  {
    id: 125,
    question: "Which country is home to the Great Pyramid of Giza?",
    options: {
      A: "Mexico",
      B: "Egypt",
      C: "Peru",
      D: "India"
    },
    correctAnswer: "B",
    explanation: "The Great Pyramid of Giza is located in Egypt."
  },
  {
    id: 126,
    question: "What is the largest mammal on Earth?",
    options: {
      A: "African elephant",
      B: "Blue whale",
      C: "Giraffe",
      D: "Hippopotamus"
    },
    correctAnswer: "B",
    explanation: "The blue whale is the largest animal known to have ever existed."
  },
  {
    id: 127,
    question: "Which metal is liquid at room temperature?",
    options: {
      A: "Lead",
      B: "Mercury",
      C: "Gallium",
      D: "Sodium"
    },
    correctAnswer: "B",
    explanation: "Mercury is the only metal that is liquid at room temperature."
  },
  {
    id: 128,
    question: "What is the primary ingredient in traditional Japanese miso soup?",
    options: {
      A: "Seaweed",
      B: "Tofu",
      C: "Soybean paste",
      D: "Mushrooms"
    },
    correctAnswer: "C",
    explanation: "Soybean paste (miso) is the key ingredient in miso soup."
  },
  {
    id: 129,
    question: "Which country is credited with inventing paper?",
    options: {
      A: "Egypt",
      B: "Greece",
      C: "India",
      D: "China"
    },
    correctAnswer: "D",
    explanation: "Paper was invented in ancient China."
  },
  {
    id: 130,
    question: "What is the largest planet in our solar system?",
    options: {
      A: "Saturn",
      B: "Uranus",
      C: "Jupiter",
      D: "Neptune"
    },
    correctAnswer: "C",
    explanation: "Jupiter is the largest planet in our solar system."
  },
  {
    id: 131,
    question: "Which instrument typically has 88 keys?",
    options: {
      A: "Guitar",
      B: "Piano",
      C: "Organ",
      D: "Violin"
    },
    correctAnswer: "B",
    explanation: "A standard piano has 88 keys."
  },
  {
    id: 132,
    question: "What is the chemical formula for water?",
    options: {
      A: "CO2",
      B: "NaCl",
      C: "O2",
      D: "H2O"
    },
    correctAnswer: "D",
    explanation: "Water is composed of two hydrogen atoms and one oxygen atom (H2O)."
  },
  {
    id: 133,
    question: "Which bird is often associated with delivering babies in folklore?",
    options: {
      A: "Owl",
      B: "Stork",
      C: "Sparrow",
      D: "Crow"
    },
    correctAnswer: "B",
    explanation: "Folklore often depicts storks as deliverers of babies."
  },
  {
    id: 134,
    question: "Which insect is renowned for building intricate hives and producing honey?",
    options: {
      A: "Ant",
      B: "Butterfly",
      C: "Bee",
      D: "Wasp"
    },
    correctAnswer: "C",
    explanation: "Bees build complex hives and produce honey."
  },
  {
    id: 135,
    question: "Which organ in the human body is responsible for pumping blood?",
    options: {
      A: "Kidney",
      B: "Liver",
      C: "Brain",
      D: "Heart"
    },
    correctAnswer: "D",
    explanation: "The heart pumps blood throughout the body."
  },
  {
    id: 136,
    question: "Which element is represented by the symbol 'Fe'?",
    options: {
      A: "Gold",
      B: "Lead",
      C: "Iron",
      D: "Fluorine"
    },
    correctAnswer: "C",
    explanation: "The chemical symbol 'Fe' stands for iron."
  },
  {
    id: 137,
    question: "What process do plants use to convert sunlight into energy?",
    options: {
      A: "Respiration",
      B: "Photosynthesis",
      C: "Transpiration",
      D: "Digestion"
    },
    correctAnswer: "B",
    explanation: "Photosynthesis allows plants to convert sunlight into energy."
  },
  {
    id: 138,
    question: "Which gas do plants primarily absorb from the atmosphere?",
    options: {
      A: "Helium",
      B: "Carbon dioxide",
      C: "Nitrogen",
      D: "Oxygen"
    },
    correctAnswer: "B",
    explanation: "Plants absorb carbon dioxide during photosynthesis."
  },
  {
    id: 139,
    question: "At what temperature does water freeze in degrees Celsius?",
    options: {
      A: "32°C",
      B: "-32°C",
      C: "0°C",
      D: "100°C"
    },
    correctAnswer: "C",
    explanation: "Water freezes at 0°C under standard conditions."
  },
  {
    id: 140,
    question: "Which continent has the most countries?",
    options: {
      A: "Asia",
      B: "Africa",
      C: "Europe",
      D: "South America"
    },
    correctAnswer: "B",
    explanation: "Africa has 54 recognized countries, the most of any continent."
  },
  {
    id: 141,
    question: "Which organ is primarily responsible for filtering blood in the human body?",
    options: {
      A: "Liver",
      B: "Lung",
      C: "Kidney",
      D: "Heart"
    },
    correctAnswer: "C",
    explanation: "The kidneys filter waste from the blood."
  },
  {
    id: 142,
    question: "What is the largest hot desert in the world?",
    options: {
      A: "Arabian Desert",
      B: "Kalahari Desert",
      C: "Gobi Desert",
      D: "Sahara Desert"
    },
    correctAnswer: "D",
    explanation: "The Sahara is the largest hot desert on Earth."
  },
  {
    id: 143,
    question: "Which sea creature is notorious for its venomous sting and long tentacles?",
    options: {
      A: "Starfish",
      B: "Octopus",
      C: "Box jellyfish",
      D: "Squid"
    },
    correctAnswer: "C",
    explanation: "The box jellyfish is known for its dangerous, venomous sting."
  },
  {
    id: 144,
    question: "Which metal is most commonly used in coinage?",
    options: {
      A: "Gold",
      B: "Copper",
      C: "Silver",
      D: "Iron"
    },
    correctAnswer: "B",
    explanation: "Copper is widely used for making coins."
  },
  {
    id: 145,
    question: "What is the primary language spoken in Brazil?",
    options: {
      A: "Spanish",
      B: "Portuguese",
      C: "French",
      D: "English"
    },
    correctAnswer: "B",
    explanation: "Brazil's official language is Portuguese."
  },
  {
    id: 146,
    question: "Which animal, native to China, is famous for its distinctive black and white markings?",
    options: {
      A: "Red panda",
      B: "Giant panda",
      C: "Leopard",
      D: "Koala"
    },
    correctAnswer: "B",
    explanation: "The giant panda is known for its unique black and white fur."
  },
  {
    id: 147,
    question: "Which fruit is often called the 'king of fruits' in Southeast Asia?",
    options: {
      A: "Pineapple",
      B: "Mango",
      C: "Papaya",
      D: "Durian"
    },
    correctAnswer: "D",
    explanation: "Durian is renowned in Southeast Asia for its strong odor and distinctive taste."
  },
  {
    id: 148,
    question: "What is the capital city of Japan?",
    options: {
      A: "Kyoto",
      B: "Osaka",
      C: "Tokyo",
      D: "Hiroshima"
    },
    correctAnswer: "C",
    explanation: "Tokyo is the capital of Japan."
  },
  {
    id: 149,
    question: "Which famous scientist developed the theory of relativity?",
    options: {
      A: "Isaac Newton",
      B: "Galileo Galilei",
      C: "Nikola Tesla",
      D: "Albert Einstein"
    },
    correctAnswer: "D",
    explanation: "Albert Einstein is renowned for formulating the theory of relativity."
  },
  {
    id: 150,
    question: "Which planet is often called the 'Morning Star' or 'Evening Star'?",
    options: {
      A: "Mars",
      B: "Venus",
      C: "Mercury",
      D: "Saturn"
    },
    correctAnswer: "B",
    explanation: "Venus is frequently visible at dawn or dusk, earning its nicknames."
  },
  {
    id: 151,
    question: "What is the scientific study of behavior and mental processes?",
    options: {
      A: "Sociology",
      B: "Anthropology",
      C: "Psychology",
      D: "Philosophy"
    },
    correctAnswer: "C",
    explanation: "Psychology is defined as the scientific study of behavior and mental processes."
  },
  {
    id: 152,
    question: "Who is considered the father of modern psychology for establishing the first experimental laboratory?",
    options: {
      A: "Sigmund Freud",
      B: "Wilhelm Wundt",
      C: "B.F. Skinner",
      D: "William James"
    },
    correctAnswer: "B",
    explanation: "Wilhelm Wundt is credited with founding the first psychological laboratory in 1879."
  },
  {
    id: 153,
    question: "Which psychological perspective focuses on observable behavior rather than internal mental states?",
    options: {
      A: "Behaviorism",
      B: "Cognitive psychology",
      C: "Humanistic psychology",
      D: "Psychoanalysis"
    },
    correctAnswer: "A",
    explanation: "Behaviorism emphasizes observable behavior and dismisses introspection."
  },
  {
    id: 154,
    question: "Which perspective emphasizes the role of unconscious processes and early childhood experiences?",
    options: {
      A: "Cognitive psychology",
      B: "Psychoanalysis",
      C: "Behaviorism",
      D: "Humanistic psychology"
    },
    correctAnswer: "B",
    explanation: "Psychoanalysis, founded by Freud, focuses on unconscious processes and early experiences."
  },
  {
    id: 155,
    question: "Which psychological approach focuses on personal growth and self-actualization?",
    options: {
      A: "Humanistic psychology",
      B: "Cognitive psychology",
      C: "Behaviorism",
      D: "Psychoanalysis"
    },
    correctAnswer: "A",
    explanation: "Humanistic psychology emphasizes personal growth and self-actualization."
  },
  {
    id: 156,
    question: "Which perspective studies mental processes such as perception, memory, and language?",
    options: {
      A: "Behaviorism",
      B: "Cognitive psychology",
      C: "Psychoanalysis",
      D: "Biopsychology"
    },
    correctAnswer: "B",
    explanation: "Cognitive psychology focuses on internal mental processes."
  },
  {
    id: 157,
    question: "What does biopsychology primarily study?",
    options: {
      A: "Social behavior",
      B: "Environmental influences",
      C: "The relationship between biology and behavior",
      D: "Cognitive processes"
    },
    correctAnswer: "C",
    explanation: "Biopsychology examines how biological processes influence behavior."
  },
  {
    id: 158,
    question: "What does the term 'nature vs. nurture' refer to?",
    options: {
      A: "The debate over free will and determinism",
      B: "The conflict between genetics and environment in shaping behavior",
      C: "The study of natural disasters versus human responses",
      D: "The balance between work and leisure"
    },
    correctAnswer: "B",
    explanation: "Nature vs. nurture refers to the relative influence of genetics and environment on behavior."
  },
  {
    id: 159,
    question: "What is the primary purpose of using the scientific method in psychology?",
    options: {
      A: "To validate personal beliefs",
      B: "To systematically test hypotheses and theories",
      C: "To collect anecdotal evidence",
      D: "To increase the popularity of a theory"
    },
    correctAnswer: "B",
    explanation: "The scientific method allows psychologists to systematically test and refine hypotheses."
  },
  {
    id: 160,
    question: "Which research method involves an in-depth study of a single individual or small group?",
    options: {
      A: "Survey",
      B: "Experiment",
      C: "Case study",
      D: "Correlational research"
    },
    correctAnswer: "C",
    explanation: "Case studies involve an intensive examination of a single subject or small group."
  },
  {
    id: 161,
    question: "Which research method involves observing behavior in a natural setting without interference?",
    options: {
      A: "Laboratory experiment",
      B: "Naturalistic observation",
      C: "Survey research",
      D: "Case study"
    },
    correctAnswer: "B",
    explanation: "Naturalistic observation involves watching behavior in its natural context."
  },
  {
    id: 162,
    question: "What type of study examines the relationship between variables without manipulating them?",
    options: {
      A: "Experimental study",
      B: "Correlational study",
      C: "Case study",
      D: "Longitudinal study"
    },
    correctAnswer: "B",
    explanation: "Correlational studies investigate the association between variables without experimental manipulation."
  },
  {
    id: 163,
    question: "What is an educated guess or prediction called in psychological research?",
    options: {
      A: "Theory",
      B: "Hypothesis",
      C: "Law",
      D: "Observation"
    },
    correctAnswer: "B",
    explanation: "A hypothesis is a testable prediction derived from theory."
  },
  {
    id: 164,
    question: "What is the systematic process of gathering data to answer research questions called?",
    options: {
      A: "Analysis",
      B: "Experimentation",
      C: "Research",
      D: "Observation"
    },
    correctAnswer: "C",
    explanation: "Research is the process of gathering, analyzing, and interpreting information."
  },
  {
    id: 165,
    question: "Which ethical principle requires that participants voluntarily agree to take part in research?",
    options: {
      A: "Beneficence",
      B: "Informed consent",
      C: "Confidentiality",
      D: "Justice"
    },
    correctAnswer: "B",
    explanation: "Informed consent ensures that participants are aware of and agree to the research procedures."
  },
  {
    id: 166,
    question: "Which ethical guideline in research emphasizes keeping participants’ data private?",
    options: {
      A: "Debriefing",
      B: "Anonymity",
      C: "Confidentiality",
      D: "Voluntary participation"
    },
    correctAnswer: "C",
    explanation: "Confidentiality involves protecting participants' private information."
  },
  {
    id: 167,
    question: "What is a double-blind study?",
    options: {
      A: "A study where only the participants are unaware of the treatment",
      B: "A study where only the researchers are unaware of the treatment",
      C: "A study where both participants and researchers are unaware of who receives the treatment",
      D: "A study without any control group"
    },
    correctAnswer: "C",
    explanation: "In a double-blind study, neither the participants nor the researchers know who is receiving the treatment."
  },
  {
    id: 168,
    question: "Which area of psychology studies human growth and change across the lifespan?",
    options: {
      A: "Cognitive psychology",
      B: "Social psychology",
      C: "Developmental psychology",
      D: "Biopsychology"
    },
    correctAnswer: "C",
    explanation: "Developmental psychology examines changes that occur throughout a person’s life."
  },
  {
    id: 169,
    question: "Which field of psychology focuses on how people think, learn, and remember?",
    options: {
      A: "Cognitive psychology",
      B: "Social psychology",
      C: "Developmental psychology",
      D: "Behaviorism"
    },
    correctAnswer: "A",
    explanation: "Cognitive psychology studies internal mental processes such as thinking and memory."
  },
  {
    id: 170,
    question: "What are mental shortcuts that help simplify decision making called?",
    options: {
      A: "Biases",
      B: "Heuristics",
      C: "Algorithms",
      D: "Schemas"
    },
    correctAnswer: "B",
    explanation: "Heuristics are simple rules or shortcuts used to make decisions quickly."
  },
  {
    id: 171,
    question: "Which bias involves favoring information that confirms our existing beliefs?",
    options: {
      A: "Confirmation bias",
      B: "Availability heuristic",
      C: "Anchoring bias",
      D: "Self-serving bias"
    },
    correctAnswer: "A",
    explanation: "Confirmation bias is the tendency to seek and remember information that confirms one's beliefs."
  },
  {
    id: 172,
    question: "What are the basic units of memory storage sometimes called?",
    options: {
      A: "Neurons",
      B: "Memory traces",
      C: "Synapses",
      D: "Cues"
    },
    correctAnswer: "B",
    explanation: "Memory traces refer to the theoretical physical or biochemical changes that occur when memories form."
  },
  {
    id: 173,
    question: "Which type of memory has the shortest duration?",
    options: {
      A: "Long-term memory",
      B: "Short-term memory",
      C: "Sensory memory",
      D: "Working memory"
    },
    correctAnswer: "C",
    explanation: "Sensory memory holds sensory information for a very brief period."
  },
  {
    id: 174,
    question: "Which type of memory holds a limited amount of information temporarily?",
    options: {
      A: "Short-term memory",
      B: "Long-term memory",
      C: "Sensory memory",
      D: "Implicit memory"
    },
    correctAnswer: "A",
    explanation: "Short-term memory retains a limited amount of information for a brief period."
  },
  {
    id: 175,
    question: "Which type of memory can store information for an indefinite period?",
    options: {
      A: "Long-term memory",
      B: "Sensory memory",
      C: "Short-term memory",
      D: "Echoic memory"
    },
    correctAnswer: "A",
    explanation: "Long-term memory can store information over extended periods."
  },
  {
    id: 176,
    question: "What is the process of transferring information from short-term to long-term memory called?",
    options: {
      A: "Encoding",
      B: "Consolidation",
      C: "Retrieval",
      D: "Storage"
    },
    correctAnswer: "B",
    explanation: "Consolidation is the process of stabilizing a memory trace after its initial acquisition."
  },
  {
    id: 177,
    question: "What is the term for the loss of memory due to brain injury or trauma?",
    options: {
      A: "Aphasia",
      B: "Amnesia",
      C: "Dyslexia",
      D: "Agnosia"
    },
    correctAnswer: "B",
    explanation: "Amnesia is the inability to recall past events, often due to injury or trauma."
  },
  {
    id: 178,
    question: "Which brain structure is primarily involved in forming new memories?",
    options: {
      A: "Amygdala",
      B: "Cerebellum",
      C: "Hippocampus",
      D: "Thalamus"
    },
    correctAnswer: "C",
    explanation: "The hippocampus plays a crucial role in the formation of new memories."
  },
  {
    id: 179,
    question: "What does behavioral psychology primarily study?",
    options: {
      A: "Internal thoughts",
      B: "Observable behaviors",
      C: "Dreams",
      D: "Unconscious motives"
    },
    correctAnswer: "B",
    explanation: "Behavioral psychology focuses on observable behavior rather than internal mental states."
  },
  {
    id: 180,
    question: "What is classical conditioning?",
    options: {
      A: "Learning through rewards and punishments",
      B: "Learning by observing others",
      C: "Learning by associating a neutral stimulus with a significant stimulus",
      D: "Learning through trial and error"
    },
    correctAnswer: "C",
    explanation: "Classical conditioning involves pairing a neutral stimulus with an unconditioned stimulus to elicit a conditioned response."
  },
  {
    id: 181,
    question: "What is operant conditioning?",
    options: {
      A: "Learning based on the consequences of behavior",
      B: "Learning through association",
      C: "Learning by observation",
      D: "Learning by repetition"
    },
    correctAnswer: "A",
    explanation: "Operant conditioning involves learning through rewards and punishments."
  },
  {
    id: 182,
    question: "Which psychologist is best known for his work on classical conditioning?",
    options: {
      A: "B.F. Skinner",
      B: "Ivan Pavlov",
      C: "John Watson",
      D: "Carl Rogers"
    },
    correctAnswer: "B",
    explanation: "Ivan Pavlov is famous for his experiments on classical conditioning with dogs."
  },
  {
    id: 183,
    question: "Which psychologist is closely associated with operant conditioning?",
    options: {
      A: "Sigmund Freud",
      B: "Wilhelm Wundt",
      C: "B.F. Skinner",
      D: "Jean Piaget"
    },
    correctAnswer: "C",
    explanation: "B.F. Skinner is known for his research on operant conditioning."
  },
  {
    id: 184,
    question: "What is reinforcement in operant conditioning?",
    options: {
      A: "A consequence that decreases behavior",
      B: "A process of repeating behavior",
      C: "A consequence that increases behavior",
      D: "A method of observation"
    },
    correctAnswer: "C",
    explanation: "Reinforcement increases the likelihood that a behavior will occur again."
  },
  {
    id: 185,
    question: "What is punishment in the context of operant conditioning?",
    options: {
      A: "A consequence that increases behavior",
      B: "A consequence that decreases behavior",
      C: "A type of reinforcement",
      D: "A method of conditioning"
    },
    correctAnswer: "B",
    explanation: "Punishment is used to decrease the likelihood of a behavior."
  },
  {
    id: 186,
    question: "What is observational learning?",
    options: {
      A: "Learning by trial and error",
      B: "Learning by watching and imitating others",
      C: "Learning through reinforcement",
      D: "Learning by reading"
    },
    correctAnswer: "B",
    explanation: "Observational learning involves acquiring new behaviors by watching others."
  },
  {
    id: 187,
    question: "Which psychologist is associated with social learning theory?",
    options: {
      A: "Albert Bandura",
      B: "Carl Rogers",
      C: "B.F. Skinner",
      D: "Sigmund Freud"
    },
    correctAnswer: "A",
    explanation: "Albert Bandura is known for his contributions to social learning theory."
  },
  {
    id: 188,
    question: "What is self-efficacy?",
    options: {
      A: "The ability to control emotions",
      B: "Belief in one’s ability to succeed in specific situations",
      C: "A measure of intelligence",
      D: "A type of memory"
    },
    correctAnswer: "B",
    explanation: "Self-efficacy is the belief in one’s capacity to execute behaviors necessary to produce specific performance attainments."
  },
  {
    id: 189,
    question: "What does the term 'cognition' refer to?",
    options: {
      A: "Emotional experiences",
      B: "The process of thinking",
      C: "Physical reactions",
      D: "Social interactions"
    },
    correctAnswer: "B",
    explanation: "Cognition refers to mental processes involved in acquiring knowledge and understanding."
  },
  {
    id: 190,
    question: "What is perception in psychology?",
    options: {
      A: "The process of storing information",
      B: "The process of interpreting sensory input",
      C: "The process of forgetting",
      D: "The process of learning"
    },
    correctAnswer: "B",
    explanation: "Perception involves organizing and interpreting sensory information."
  },
  {
    id: 191,
    question: "What is the difference between sensation and perception?",
    options: {
      A: "Sensation is interpretation; perception is reception",
      B: "Sensation is reception of stimuli; perception is interpretation of those stimuli",
      C: "They are identical processes",
      D: "Sensation is only auditory; perception is only visual"
    },
    correctAnswer: "B",
    explanation: "Sensation is the initial process of receiving stimuli, while perception is the interpretation of that sensory information."
  },
  {
    id: 192,
    question: "What is selective attention?",
    options: {
      A: "Focusing on all stimuli at once",
      B: "Focusing on a specific aspect of the environment while ignoring others",
      C: "Remembering every detail of an event",
      D: "Dividing attention equally among several tasks"
    },
    correctAnswer: "B",
    explanation: "Selective attention involves focusing on a particular stimulus while excluding others."
  },
  {
    id: 193,
    question: "What is the 'cocktail party effect'?",
    options: {
      A: "Forgetting names at a party",
      B: "Noticing one's own name in a noisy environment",
      C: "Mimicking behavior at social gatherings",
      D: "Being unable to follow multiple conversations"
    },
    correctAnswer: "B",
    explanation: "The cocktail party effect is the ability to focus on one conversation among many."
  },
  {
    id: 194,
    question: "Which psychologist is known for his hierarchy of needs theory?",
    options: {
      A: "Abraham Maslow",
      B: "Carl Rogers",
      C: "Sigmund Freud",
      D: "B.F. Skinner"
    },
    correctAnswer: "A",
    explanation: "Maslow’s hierarchy of needs describes a progression of human needs from basic to self-fulfillment."
  },
  {
    id: 195,
    question: "What is self-actualization?",
    options: {
      A: "The process of forgetting past events",
      B: "The realization of one's full potential",
      C: "A stage of cognitive development",
      D: "A method of conditioning"
    },
    correctAnswer: "B",
    explanation: "Self-actualization is the realization or fulfillment of one's talents and potential."
  },
  {
    id: 196,
    question: "Which perspective in psychology emphasizes free will and personal growth?",
    options: {
      A: "Psychoanalytic",
      B: "Behaviorist",
      C: "Humanistic",
      D: "Cognitive"
    },
    correctAnswer: "C",
    explanation: "The humanistic perspective emphasizes free will, self-actualization, and personal growth."
  },
  {
    id: 197,
    question: "What does the term 'personality' refer to?",
    options: {
      A: "A temporary emotional state",
      B: "A consistent pattern of thoughts, feelings, and behaviors",
      C: "The structure of the brain",
      D: "A type of memory"
    },
    correctAnswer: "B",
    explanation: "Personality refers to the stable set of characteristics that influence an individual's behavior."
  },
  {
    id: 198,
    question: "Which theory of personality emphasizes unconscious motives?",
    options: {
      A: "Cognitive theory",
      B: "Psychoanalytic theory",
      C: "Behavioral theory",
      D: "Humanistic theory"
    },
    correctAnswer: "B",
    explanation: "Psychoanalytic theory, introduced by Freud, focuses on unconscious motivations."
  },
  {
    id: 199,
    question: "Which theory of personality emphasizes observable behavior and environmental influences?",
    options: {
      A: "Behaviorist theory",
      B: "Humanistic theory",
      C: "Psychoanalytic theory",
      D: "Trait theory"
    },
    correctAnswer: "A",
    explanation: "Behaviorist theory explains personality in terms of learned behaviors and environmental reinforcement."
  },
  {
    id: 200,
    question: "Which personality theory focuses on self-fulfillment and personal growth?",
    options: {
      A: "Trait theory",
      B: "Humanistic theory",
      C: "Cognitive theory",
      D: "Behaviorist theory"
    },
    correctAnswer: "B",
    explanation: "Humanistic theory centers on the individual's drive for self-actualization and personal growth."
  },
  {
    id: 201,
    question: "What are the Big Five personality traits?",
    options: {
      A: "Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism",
      B: "Introversion, Extroversion, Agreeableness, Neuroticism, Creativity",
      C: "Optimism, Pessimism, Realism, Idealism, Pragmatism",
      D: "Happiness, Sadness, Anger, Fear, Surprise"
    },
    correctAnswer: "A",
    explanation: "The Big Five traits are openness, conscientiousness, extraversion, agreeableness, and neuroticism."
  },
  {
    id: 202,
    question: "What is extraversion characterized by?",
    options: {
      A: "Reserved behavior",
      B: "High energy and sociability",
      C: "Shyness",
      D: "Introspection"
    },
    correctAnswer: "B",
    explanation: "Extraversion is marked by sociability, assertiveness, and high energy."
  },
  {
    id: 203,
    question: "What does introversion refer to?",
    options: {
      A: "Sociability and high energy",
      B: "Reserved behavior and a focus on internal thoughts",
      C: "Aggressiveness",
      D: "Impulsivity"
    },
    correctAnswer: "B",
    explanation: "Introversion is characterized by a focus on internal thoughts and reserved behavior."
  },
  {
    id: 204,
    question: "What is meant by 'locus of control'?",
    options: {
      A: "The degree to which individuals believe they can control events affecting them",
      B: "The geographic location of a person",
      C: "A measure of intelligence",
      D: "A type of memory"
    },
    correctAnswer: "A",
    explanation: "Locus of control refers to the degree to which people believe they have control over the events in their lives."
  },
  {
    id: 205,
    question: "What is cognitive dissonance?",
    options: {
      A: "A state of mental relaxation",
      B: "The discomfort from holding conflicting beliefs",
      C: "A type of memory loss",
      D: "A state of heightened alertness"
    },
    correctAnswer: "B",
    explanation: "Cognitive dissonance is the mental discomfort experienced when holding contradictory beliefs or attitudes."
  },
  {
    id: 206,
    question: "Which psychologist proposed the theory of cognitive dissonance?",
    options: {
      A: "Leon Festinger",
      B: "B.F. Skinner",
      C: "Carl Rogers",
      D: "Sigmund Freud"
    },
    correctAnswer: "A",
    explanation: "Leon Festinger is known for developing the theory of cognitive dissonance."
  },
  {
    id: 207,
    question: "What is the fundamental attribution error?",
    options: {
      A: "Attributing one’s own behavior to external causes",
      B: "Attributing others' behavior to their internal characteristics",
      C: "Attributing behavior to random chance",
      D: "Attributing one’s success solely to hard work"
    },
    correctAnswer: "B",
    explanation: "The fundamental attribution error is the tendency to overemphasize personality traits when explaining others' behavior."
  },
  {
    id: 208,
    question: "What does social psychology study?",
    options: {
      A: "The biological basis of behavior",
      B: "How people's thoughts, feelings, and behaviors are influenced by others",
      C: "The development of cognitive processes",
      D: "The structure of the brain"
    },
    correctAnswer: "B",
    explanation: "Social psychology examines how individuals are influenced by the presence of others."
  },
  {
    id: 209,
    question: "What is conformity?",
    options: {
      A: "The tendency to act independently",
      B: "The process of forming impressions of others",
      C: "Adjusting behavior to match group norms",
      D: "The refusal to follow social rules"
    },
    correctAnswer: "C",
    explanation: "Conformity is the adjustment of one's behavior or thinking to match those of the group."
  },
  {
    id: 210,
    question: "What is obedience in a social context?",
    options: {
      A: "Defying authority",
      B: "Following orders or commands from an authority figure",
      C: "Ignoring group norms",
      D: "Engaging in group discussions"
    },
    correctAnswer: "B",
    explanation: "Obedience involves following direct commands or orders from an authority figure."
  },
  {
    id: 211,
    question: "Which famous experiment demonstrated conformity in groups?",
    options: {
      A: "Milgram's obedience study",
      B: "Asch conformity experiments",
      C: "Stanford prison experiment",
      D: "Little Albert study"
    },
    correctAnswer: "B",
    explanation: "The Asch conformity experiments showed how individuals yield to group pressure."
  },
  {
    id: 212,
    question: "What is groupthink?",
    options: {
      A: "An effective decision-making process in groups",
      B: "The critical evaluation of ideas in a group",
      C: "The tendency for group members to avoid conflict and suppress dissenting opinions",
      D: "A method of brainstorming"
    },
    correctAnswer: "C",
    explanation: "Groupthink is the phenomenon where a group prioritizes consensus over critical analysis."
  },
  {
    id: 213,
    question: "What is prejudice?",
    options: {
      A: "A rational judgment about a group",
      B: "A preconceived opinion not based on reason or experience",
      C: "An unbiased evaluation",
      D: "A scientific observation"
    },
    correctAnswer: "B",
    explanation: "Prejudice is a preconceived and usually unfavorable opinion formed without factual basis."
  },
  {
    id: 214,
    question: "What is discrimination?",
    options: {
      A: "Treating individuals fairly",
      B: "Unjustified negative behavior toward a group or its members",
      C: "Making objective judgments",
      D: "Encouraging diversity"
    },
    correctAnswer: "B",
    explanation: "Discrimination is the unjust treatment of different categories of people, often based on prejudice."
  },
  {
    id: 215,
    question: "What is a stereotype?",
    options: {
      A: "A generalized belief about a group of people",
      B: "An individual characteristic",
      C: "A unique personality trait",
      D: "A form of statistical data"
    },
    correctAnswer: "A",
    explanation: "A stereotype is a generalized and oversimplified belief about a particular group."
  },
  {
    id: 216,
    question: "What is the bystander effect?",
    options: {
      A: "The tendency for people to help more when alone",
      B: "The phenomenon where individuals are less likely to help a victim when others are present",
      C: "The increased attention given to a person in a crowd",
      D: "The tendency to conform to group decisions"
    },
    correctAnswer: "B",
    explanation: "The bystander effect describes how the presence of others inhibits helping behavior."
  },
  {
    id: 217,
    question: "What is attribution in social psychology?",
    options: {
      A: "The process of assigning causes to behavior",
      B: "A method of data collection",
      C: "A form of reinforcement",
      D: "A statistical analysis technique"
    },
    correctAnswer: "A",
    explanation: "Attribution is the process by which people explain the causes of behavior and events."
  },
  {
    id: 218,
    question: "Which perspective emphasizes the role of unconscious processes and early childhood experiences?",
    options: {
      A: "Cognitive",
      B: "Behavioral",
      C: "Psychoanalytic",
      D: "Humanistic"
    },
    correctAnswer: "C",
    explanation: "The psychoanalytic perspective focuses on unconscious processes and early developmental experiences."
  },
  {
    id: 219,
    question: "Who is the founder of psychoanalysis?",
    options: {
      A: "Carl Rogers",
      B: "Wilhelm Wundt",
      C: "Sigmund Freud",
      D: "B.F. Skinner"
    },
    correctAnswer: "C",
    explanation: "Sigmund Freud is widely recognized as the founder of psychoanalysis."
  },
  {
    id: 220,
    question: "In Freudian theory, what does the 'id' represent?",
    options: {
      A: "The rational part of the mind",
      B: "The moral component",
      C: "Instinctual drives and desires",
      D: "The conscious self"
    },
    correctAnswer: "C",
    explanation: "The id contains the basic instinctual drives and operates on the pleasure principle."
  },
  {
    id: 221,
    question: "In Freudian theory, what is the function of the 'ego'?",
    options: {
      A: "To enforce social rules",
      B: "To mediate between the id and reality",
      C: "To store repressed memories",
      D: "To control instinctual drives"
    },
    correctAnswer: "B",
    explanation: "The ego mediates between the impulsive demands of the id and the constraints of reality."
  },
  {
    id: 222,
    question: "What does the 'superego' represent in Freudian theory?",
    options: {
      A: "The impulsive desires of the mind",
      B: "The rational thinking process",
      C: "The internalized moral standards",
      D: "The memory system"
    },
    correctAnswer: "C",
    explanation: "The superego is the part of personality that internalizes societal and parental standards of conduct."
  },
  {
    id: 223,
    question: "What are defense mechanisms in psychoanalytic theory?",
    options: {
      A: "Conscious strategies for decision making",
      B: "Unconscious processes that reduce anxiety by distorting reality",
      C: "Methods of cognitive enhancement",
      D: "Techniques used in behavioral therapy"
    },
    correctAnswer: "B",
    explanation: "Defense mechanisms are unconscious strategies used to protect the ego from anxiety."
  },
  {
    id: 224,
    question: "Which defense mechanism involves attributing one’s own unacceptable feelings to someone else?",
    options: {
      A: "Denial",
      B: "Projection",
      C: "Rationalization",
      D: "Sublimation"
    },
    correctAnswer: "B",
    explanation: "Projection is the defense mechanism of attributing one’s own undesirable feelings to others."
  },
  {
    id: 225,
    question: "According to Freud, what is the term for the energy that drives behavior?",
    options: {
      A: "Ego energy",
      B: "Libido",
      C: "Cognitive energy",
      D: "Emotional energy"
    },
    correctAnswer: "B",
    explanation: "Libido refers to the sexual energy that Freud believed drives behavior."
  },
  {
    id: 226,
    question: "What is the primary goal of psychodynamic therapy?",
    options: {
      A: "To change behavior through reinforcement",
      B: "To uncover and resolve unconscious conflicts",
      C: "To teach new cognitive strategies",
      D: "To measure brain activity"
    },
    correctAnswer: "B",
    explanation: "Psychodynamic therapy aims to reveal and resolve unconscious conflicts that influence behavior."
  },
  {
    id: 227,
    question: "Which therapy focuses on modifying maladaptive behaviors using conditioning techniques?",
    options: {
      A: "Cognitive therapy",
      B: "Behavior therapy",
      C: "Psychoanalysis",
      D: "Humanistic therapy"
    },
    correctAnswer: "B",
    explanation: "Behavior therapy uses learning principles such as conditioning to change behavior."
  },
  {
    id: 228,
    question: "What is systematic desensitization?",
    options: {
      A: "A method of cognitive restructuring",
      B: "A technique for reducing phobic responses through gradual exposure",
      C: "A form of group therapy",
      D: "A type of medication"
    },
    correctAnswer: "B",
    explanation: "Systematic desensitization is a behavioral technique used to reduce anxiety through gradual exposure."
  },
  {
    id: 229,
    question: "What is cognitive-behavioral therapy (CBT)?",
    options: {
      A: "A therapy that focuses solely on behavior modification",
      B: "A therapy that combines cognitive and behavioral techniques",
      C: "A therapy based on free association",
      D: "A type of pharmacotherapy"
    },
    correctAnswer: "B",
    explanation: "CBT combines cognitive and behavioral strategies to address maladaptive thoughts and behaviors."
  },
  {
    id: 230,
    question: "What is meant by mindfulness in therapy?",
    options: {
      A: "Focusing on future goals",
      B: "Paying attention to the present moment without judgment",
      C: "Analyzing past experiences",
      D: "Engaging in group discussions"
    },
    correctAnswer: "B",
    explanation: "Mindfulness is the practice of being fully present and aware of one's current experience without judgment."
  },
  {
    id: 231,
    question: "Which perspective emphasizes the study of internal mental processes?",
    options: {
      A: "Behavioral",
      B: "Cognitive",
      C: "Psychoanalytic",
      D: "Humanistic"
    },
    correctAnswer: "B",
    explanation: "Cognitive psychology focuses on internal processes such as perception, memory, and problem solving."
  },
  {
    id: 232,
    question: "What is an 'aha' moment in problem solving commonly referred to as?",
    options: {
      A: "Incubation",
      B: "Insight",
      C: "Consolidation",
      D: "Heuristic"
    },
    correctAnswer: "B",
    explanation: "An insight is a sudden realization or understanding that leads to a solution."
  },
  {
    id: 233,
    question: "What does the serial position effect describe?",
    options: {
      A: "The tendency to remember items in the middle of a list best",
      B: "The tendency to forget the first and last items in a list",
      C: "The tendency to recall the first and last items in a list better than the middle ones",
      D: "The inability to recall any items from a list"
    },
    correctAnswer: "C",
    explanation: "The serial position effect is the phenomenon of better recalling items at the beginning and end of a list."
  },
  {
    id: 234,
    question: "What are schemas?",
    options: {
      A: "Detailed recollections of past events",
      B: "Mental frameworks that help organize and interpret information",
      C: "Unconscious desires",
      D: "Cognitive biases"
    },
    correctAnswer: "B",
    explanation: "Schemas are mental structures that help individuals organize and interpret information."
  },
  {
    id: 235,
    question: "What is the difference between assimilation and accommodation?",
    options: {
      A: "Assimilation is changing schemas; accommodation is fitting new information into existing schemas",
      B: "Assimilation is fitting new information into existing schemas; accommodation is changing schemas to incorporate new information",
      C: "They are two terms for the same process",
      D: "Assimilation is a form of memory, while accommodation is a form of perception"
    },
    correctAnswer: "B",
    explanation: "Assimilation involves incorporating new information into existing schemas, while accommodation involves modifying schemas to incorporate new information."
  },
  {
    id: 236,
    question: "What is a concept in psychology?",
    options: {
      A: "A detailed description of a theory",
      B: "A mental representation of a category of objects or events",
      C: "An emotional reaction",
      D: "A measurement technique"
    },
    correctAnswer: "B",
    explanation: "A concept is a mental grouping of similar objects, events, or people."
  },
  {
    id: 237,
    question: "What is selective exposure?",
    options: {
      A: "The tendency to seek out information that challenges your beliefs",
      B: "The tendency to avoid information that conflicts with your preconceptions",
      C: "The process of analyzing new data",
      D: "A type of cognitive bias involving memory"
    },
    correctAnswer: "B",
    explanation: "Selective exposure is the tendency to favor information that reinforces existing beliefs."
  },
  {
    id: 238,
    question: "What is the placebo effect?",
    options: {
      A: "An improvement resulting from the belief in the effectiveness of a treatment",
      B: "A direct result of a treatment’s active ingredients",
      C: "A statistical anomaly in research",
      D: "A negative side effect of medication"
    },
    correctAnswer: "A",
    explanation: "The placebo effect occurs when a person experiences real changes after receiving a treatment with no active therapeutic effect."
  },
  {
    id: 239,
    question: "What is random assignment in an experiment?",
    options: {
      A: "Assigning participants to groups based on age",
      B: "Placing participants into groups by chance",
      C: "Selecting participants with similar characteristics",
      D: "Matching participants by gender"
    },
    correctAnswer: "B",
    explanation: "Random assignment is a method used to ensure each participant has an equal chance of being assigned to any group."
  },
  {
    id: 240,
    question: "What is a control group in an experiment?",
    options: {
      A: "A group that receives the experimental treatment",
      B: "A group that does not receive the experimental treatment",
      C: "A group selected based on specific traits",
      D: "A group that is observed in a natural setting"
    },
    correctAnswer: "B",
    explanation: "A control group is used as a baseline to compare with the experimental group that receives the treatment."
  },
  {
    id: 241,
    question: "What is the independent variable in an experiment?",
    options: {
      A: "The variable that is measured",
      B: "The variable that is manipulated",
      C: "A variable that remains constant",
      D: "The variable that is random"
    },
    correctAnswer: "B",
    explanation: "The independent variable is the one that is manipulated to observe its effect on the dependent variable."
  },
  {
    id: 242,
    question: "What is the dependent variable in an experiment?",
    options: {
      A: "The variable that is controlled by the researcher",
      B: "The variable that is manipulated",
      C: "The variable that is measured",
      D: "The variable that is constant"
    },
    correctAnswer: "C",
    explanation: "The dependent variable is what is measured to determine the effect of the independent variable."
  },
  {
    id: 243,
    question: "What is an operational definition in research?",
    options: {
      A: "A vague explanation of a concept",
      B: "A definition based on theoretical ideas",
      C: "A clear, measurable definition of a variable",
      D: "A definition used only in psychology"
    },
    correctAnswer: "C",
    explanation: "An operational definition specifies how a concept is measured or manipulated in a study."
  },
  {
    id: 244,
    question: "What is the purpose of a literature review in research?",
    options: {
      A: "To present new experimental data",
      B: "To summarize and analyze previous research",
      C: "To advertise the researcher’s findings",
      D: "To develop a new theory without reference to existing work"
    },
    correctAnswer: "B",
    explanation: "A literature review surveys previous research to provide context and support for a new study."
  },
  {
    id: 245,
    question: "What does the correlation coefficient measure?",
    options: {
      A: "The difference between groups",
      B: "The strength and direction of a relationship between two variables",
      C: "The frequency of a behavior",
      D: "The variance within a dataset"
    },
    correctAnswer: "B",
    explanation: "The correlation coefficient quantifies the strength and direction of the relationship between two variables."
  },
  {
    id: 246,
    question: "What is the difference between a positive and a negative correlation?",
    options: {
      A: "Positive correlation means variables move in opposite directions; negative means they move together",
      B: "Positive correlation means variables move together; negative means they move in opposite directions",
      C: "There is no difference",
      D: "Positive correlation is stronger than negative correlation"
    },
    correctAnswer: "B",
    explanation: "In a positive correlation, variables increase or decrease together; in a negative correlation, one variable increases as the other decreases."
  },
  {
    id: 247,
    question: "What does statistical significance indicate in research?",
    options: {
      A: "That a result is likely due to chance",
      B: "That a result is unlikely to be due to chance",
      C: "That the study has no errors",
      D: "That the results are identical across all groups"
    },
    correctAnswer: "B",
    explanation: "Statistical significance indicates that the observed result is unlikely to have occurred by chance."
  },
  {
    id: 248,
    question: "What is a meta-analysis?",
    options: {
      A: "A study that collects qualitative data",
      B: "A study that analyzes a single experiment in depth",
      C: "A statistical technique that combines the results of multiple studies",
      D: "An analysis of case studies"
    },
    correctAnswer: "C",
    explanation: "A meta-analysis aggregates and analyzes data from multiple studies to draw overall conclusions."
  },
  {
    id: 249,
    question: "What is a longitudinal study?",
    options: {
      A: "A study that compares different groups at one point in time",
      B: "A study that follows the same participants over an extended period",
      C: "A study conducted entirely in a laboratory",
      D: "A study that uses only qualitative data"
    },
    correctAnswer: "B",
    explanation: "A longitudinal study tracks the same participants over time to observe changes."
  },
  {
    id: 250,
    question: "What is a cross-sectional study?",
    options: {
      A: "A study that collects data from different age groups at a single point in time",
      B: "A study that follows one group over several years",
      C: "A study that involves experimental manipulation",
      D: "A study that is exclusively observational"
    },
    correctAnswer: "A",
    explanation: "A cross-sectional study examines data from various groups at a single point in time."
  },
  {
    id: 251,
    question: "What is the main focus of social psychology?",
    options: {
      A: "Biological processes",
      B: "Individual cognition",
      C: "How people are influenced by others",
      D: "Animal behavior"
    },
    correctAnswer: "C",
    explanation: "Social psychology explores how individuals’ thoughts, feelings, and behaviors are influenced by the presence of others."
  },
  {
    id: 252,
    question: "What does self-esteem refer to?",
    options: {
      A: "One’s academic achievements",
      B: "An individual’s overall sense of self-worth",
      C: "The amount of attention one receives",
      D: "A type of cognitive bias"
    },
    correctAnswer: "B",
    explanation: "Self-esteem is a person's overall evaluation of their own worth."
  },
  {
    id: 253,
    question: "What is social identity?",
    options: {
      A: "A group of friends",
      B: "A collection of personal hobbies",
      C: "A part of the self defined by membership in social groups",
      D: "A measurement of intelligence"
    },
    correctAnswer: "C",
    explanation: "Social identity is the part of an individual’s self-concept derived from their group memberships."
  },
  {
    id: 254,
    question: "What phenomenon describes the reduction in helping behavior when others are present?",
    options: {
      A: "Group polarization",
      B: "Bystander effect",
      C: "Social facilitation",
      D: "Cognitive dissonance"
    },
    correctAnswer: "B",
    explanation: "The bystander effect occurs when individuals are less likely to help in the presence of others."
  },
  {
    id: 255,
    question: "What does cognitive psychology primarily study?",
    options: {
      A: "Observable behavior",
      B: "Unconscious drives",
      C: "Internal mental processes",
      D: "Social interactions"
    },
    correctAnswer: "C",
    explanation: "Cognitive psychology examines mental processes such as thinking, memory, and language."
  },
  {
    id: 256,
    question: "What is a heuristic in problem solving?",
    options: {
      A: "A detailed algorithm",
      B: "A mental shortcut that simplifies decision making",
      C: "A method of statistical analysis",
      D: "A type of memory loss"
    },
    correctAnswer: "B",
    explanation: "Heuristics are simple strategies that help in problem solving and decision making."
  },
  {
    id: 257,
    question: "What is the difference between intrinsic and extrinsic motivation?",
    options: {
      A: "Intrinsic motivation comes from external rewards; extrinsic from personal interest",
      B: "Intrinsic motivation comes from internal factors; extrinsic from external rewards",
      C: "They are the same",
      D: "Intrinsic is always stronger than extrinsic"
    },
    correctAnswer: "B",
    explanation: "Intrinsic motivation is driven by internal rewards, while extrinsic motivation is driven by external rewards."
  },
  {
    id: 258,
    question: "What is self-regulation?",
    options: {
      A: "The ability to control one's emotions and behavior",
      B: "The process of forgetting irrelevant information",
      C: "A method of reinforcement",
      D: "A type of cognitive bias"
    },
    correctAnswer: "A",
    explanation: "Self-regulation is the ability to manage one’s thoughts, emotions, and behaviors effectively."
  },
  {
    id: 259,
    question: "What is an emotion?",
    options: {
      A: "A long-lasting mood",
      B: "A temporary psychological state involving a subjective experience and physiological response",
      C: "A cognitive process",
      D: "A type of memory"
    },
    correctAnswer: "B",
    explanation: "An emotion is a short-term, intense feeling accompanied by physical changes."
  },
  {
    id: 260,
    question: "What does the James-Lange theory of emotion propose?",
    options: {
      A: "Emotions occur simultaneously with physiological reactions",
      B: "Physiological arousal precedes the experience of emotion",
      C: "Cognitive interpretation is the sole cause of emotion",
      D: "Emotions are learned behaviors"
    },
    correctAnswer: "B",
    explanation: "The James-Lange theory suggests that physiological reactions occur first, and the emotion is experienced afterward."
  },
  {
    id: 261,
    question: "What does the Cannon-Bard theory of emotion suggest?",
    options: {
      A: "Emotions occur before physiological responses",
      B: "Physiological responses and emotions occur simultaneously",
      C: "Cognition is irrelevant to emotion",
      D: "Emotions are purely genetic"
    },
    correctAnswer: "B",
    explanation: "According to the Cannon-Bard theory, both physiological responses and emotional experiences occur simultaneously."
  },
  {
    id: 262,
    question: "What is the two-factor theory of emotion?",
    options: {
      A: "Emotion is based solely on physiological arousal",
      B: "Emotion is based solely on cognitive interpretation",
      C: "Emotion arises from physiological arousal and cognitive interpretation",
      D: "Emotion is a learned response"
    },
    correctAnswer: "C",
    explanation: "The two-factor theory posits that emotion results from a combination of physiological arousal and a cognitive label."
  },
  {
    id: 263,
    question: "What is mood?",
    options: {
      A: "A brief emotional state",
      B: "A long-lasting emotional state not tied to a specific event",
      C: "An immediate reaction",
      D: "A type of memory"
    },
    correctAnswer: "B",
    explanation: "Mood refers to a general, long-lasting emotional state."
  },
  {
    id: 264,
    question: "What is the primary focus of abnormal psychology?",
    options: {
      A: "Studying normal behavior patterns",
      B: "Examining unusual patterns of behavior, emotion, and thought",
      C: "Improving memory",
      D: "Understanding group dynamics"
    },
    correctAnswer: "B",
    explanation: "Abnormal psychology focuses on studying atypical patterns of behavior and mental disorders."
  },
  {
    id: 265,
    question: "What is the DSM used for?",
    options: {
      A: "Developing new therapies",
      B: "Diagnosing mental disorders",
      C: "Measuring intelligence",
      D: "Evaluating cognitive performance"
    },
    correctAnswer: "B",
    explanation: "The DSM (Diagnostic and Statistical Manual of Mental Disorders) is used for diagnosing mental disorders."
  },
  {
    id: 266,
    question: "What is a phobia?",
    options: {
      A: "A rational fear of common objects",
      B: "A persistent, irrational fear of a specific object or situation",
      C: "A mild dislike",
      D: "A type of mood disorder"
    },
    correctAnswer: "B",
    explanation: "A phobia is an irrational and persistent fear of a specific object or situation."
  },
  {
    id: 267,
    question: "What is clinical psychology primarily concerned with?",
    options: {
      A: "Enhancing cognitive skills",
      B: "Assessing and treating mental disorders",
      C: "Studying animal behavior",
      D: "Researching developmental milestones"
    },
    correctAnswer: "B",
    explanation: "Clinical psychology involves the assessment and treatment of mental disorders."
  },
  {
    id: 268,
    question: "What is psychotherapy?",
    options: {
      A: "A method of medical surgery",
      B: "A treatment that uses psychological methods to help a person change behavior and overcome problems",
      C: "A form of physical exercise",
      D: "A statistical technique"
    },
    correctAnswer: "B",
    explanation: "Psychotherapy involves using psychological methods to help individuals overcome problems and improve mental health."
  },
  {
    id: 269,
    question: "What is cognitive-behavioral therapy (CBT)?",
    options: {
      A: "A therapy based solely on medication",
      B: "A therapy that combines cognitive and behavioral techniques",
      C: "A form of psychoanalysis",
      D: "A therapy that emphasizes dream analysis"
    },
    correctAnswer: "B",
    explanation: "CBT combines cognitive and behavioral approaches to treat a variety of mental disorders."
  },
  {
    id: 270,
    question: "What is the primary goal of humanistic therapy?",
    options: {
      A: "To identify repressed memories",
      B: "To modify observable behavior",
      C: "To promote personal growth and self-actualization",
      D: "To increase statistical accuracy"
    },
    correctAnswer: "C",
    explanation: "Humanistic therapy focuses on fostering personal growth and self-actualization."
  },
  {
    id: 271,
    question: "What is short-term therapy?",
    options: {
      A: "A therapy that lasts several years",
      B: "A brief, time-limited therapy focusing on current issues",
      C: "A therapy without any goals",
      D: "A therapy that uses only medication"
    },
    correctAnswer: "B",
    explanation: "Short-term therapy is a focused and time-limited approach to addressing current problems."
  },
  {
    id: 272,
    question: "In Freudian theory, what is repression?",
    options: {
      A: "The conscious suppression of information",
      B: "The unconscious blocking of unacceptable thoughts or impulses",
      C: "A type of reinforcement",
      D: "A memory enhancement technique"
    },
    correctAnswer: "B",
    explanation: "Repression is an unconscious defense mechanism that keeps distressing thoughts out of awareness."
  },
  {
    id: 273,
    question: "What is projection in psychoanalytic theory?",
    options: {
      A: "Attributing one's own unacceptable thoughts or feelings to others",
      B: "Consciously expressing emotions",
      C: "Suppressing memories",
      D: "Enhancing self-esteem"
    },
    correctAnswer: "A",
    explanation: "Projection involves attributing one's own undesirable feelings to someone else."
  },
  {
    id: 274,
    question: "What is sublimation according to Freudian theory?",
    options: {
      A: "Channeling unacceptable impulses into socially acceptable behaviors",
      B: "Forgetting traumatic events",
      C: "Projecting negative feelings onto others",
      D: "A method of cognitive restructuring"
    },
    correctAnswer: "A",
    explanation: "Sublimation is a defense mechanism that transforms unacceptable impulses into constructive activities."
  },
  {
    id: 275,
    question: "Which research method involves studying behavior under controlled conditions?",
    options: {
      A: "Naturalistic observation",
      B: "Experiment",
      C: "Case study",
      D: "Survey"
    },
    correctAnswer: "B",
    explanation: "Experiments involve controlled conditions to determine cause-and-effect relationships."
  },
  {
    id: 276,
    question: "What is a control variable?",
    options: {
      A: "A variable that is intentionally manipulated",
      B: "A variable that is measured",
      C: "A variable that is held constant",
      D: "A variable that is ignored"
    },
    correctAnswer: "C",
    explanation: "A control variable is kept constant to accurately assess the effect of the independent variable."
  },
  {
    id: 277,
    question: "What does operationalization mean in research?",
    options: {
      A: "Defining variables in measurable terms",
      B: "Ignoring irrelevant data",
      C: "Generalizing study results",
      D: "Collecting qualitative data"
    },
    correctAnswer: "A",
    explanation: "Operationalization involves defining variables in specific, measurable terms."
  },
  {
    id: 278,
    question: "What is the purpose of debriefing after an experiment?",
    options: {
      A: "To conceal the true purpose of the study",
      B: "To explain the study's purpose and procedures to participants",
      C: "To alter the study results",
      D: "To assign participants to new groups"
    },
    correctAnswer: "B",
    explanation: "Debriefing ensures that participants understand the study and can address any concerns."
  },
  {
    id: 279,
    question: "What is a longitudinal design in research?",
    options: {
      A: "Studying different groups at one time",
      B: "Studying the same participants over a period of time",
      C: "Using only qualitative methods",
      D: "A design with no control group"
    },
    correctAnswer: "B",
    explanation: "A longitudinal design follows the same participants over an extended period."
  },
  {
    id: 280,
    question: "Which research design studies different participants at one point in time?",
    options: {
      A: "Longitudinal design",
      B: "Cross-sectional design",
      C: "Experimental design",
      D: "Case study"
    },
    correctAnswer: "B",
    explanation: "A cross-sectional design compares different groups at a single point in time."
  },
  {
    id: 281,
    question: "Which perspective emphasizes the role of unconscious forces in behavior?",
    options: {
      A: "Cognitive",
      B: "Behavioral",
      C: "Psychoanalytic",
      D: "Humanistic"
    },
    correctAnswer: "C",
    explanation: "The psychoanalytic perspective focuses on unconscious forces that shape behavior."
  },
  {
    id: 282,
    question: "Which perspective emphasizes observable behavior?",
    options: {
      A: "Behavioral",
      B: "Cognitive",
      C: "Psychoanalytic",
      D: "Humanistic"
    },
    correctAnswer: "A",
    explanation: "The behavioral perspective focuses on observable actions and their environmental determinants."
  },
  {
    id: 283,
    question: "Which perspective focuses on mental processes such as thinking and memory?",
    options: {
      A: "Humanistic",
      B: "Cognitive",
      C: "Behavioral",
      D: "Psychoanalytic"
    },
    correctAnswer: "B",
    explanation: "Cognitive psychology examines internal mental processes like perception, memory, and problem solving."
  },
  {
    id: 284,
    question: "Which perspective emphasizes the influence of social and cultural factors on behavior?",
    options: {
      A: "Biopsychology",
      B: "Sociocultural",
      C: "Cognitive",
      D: "Behavioral"
    },
    correctAnswer: "B",
    explanation: "The sociocultural perspective examines how social and cultural contexts influence behavior."
  },
  {
    id: 285,
    question: "What is meant by 'individual differences' in psychology?",
    options: {
      A: "Similarities among people",
      B: "The differences in behavior and personality among individuals",
      C: "The effects of group dynamics",
      D: "Differences in cultural values only"
    },
    correctAnswer: "B",
    explanation: "Individual differences refer to the unique variations in behavior, personality, and cognitive processes among people."
  },
  {
    id: 286,
    question: "What does 'personality' refer to?",
    options: {
      A: "A set of temporary moods",
      B: "Stable patterns of thoughts, feelings, and behaviors",
      C: "An intellectual ability",
      D: "A type of memory"
    },
    correctAnswer: "B",
    explanation: "Personality is the consistent pattern of behaviors, thoughts, and emotions that characterize an individual."
  },
  {
    id: 287,
    question: "Which branch of psychology focuses on the relationship between the brain and behavior?",
    options: {
      A: "Cognitive psychology",
      B: "Social psychology",
      C: "Biopsychology",
      D: "Developmental psychology"
    },
    correctAnswer: "C",
    explanation: "Biopsychology studies how biological processes, especially brain function, influence behavior."
  },
  {
    id: 288,
    question: "What is neuroplasticity?",
    options: {
      A: "The brain's ability to remain unchanged",
      B: "The brain's ability to change and reorganize itself",
      C: "A type of neurotransmitter",
      D: "The rigidity of neural connections"
    },
    correctAnswer: "B",
    explanation: "Neuroplasticity refers to the brain's capacity to change and form new neural connections."
  },
  {
    id: 289,
    question: "Which area of psychology studies how people learn and behave in social settings?",
    options: {
      A: "Social psychology",
      B: "Cognitive psychology",
      C: "Developmental psychology",
      D: "Biopsychology"
    },
    correctAnswer: "A",
    explanation: "Social psychology examines how social influences affect behavior and thought."
  },
  {
    id: 290,
    question: "What is social anxiety?",
    options: {
      A: "A fear of social situations",
      B: "A desire to be alone",
      C: "A personality trait characterized by extroversion",
      D: "A cognitive bias"
    },
    correctAnswer: "A",
    explanation: "Social anxiety is the intense fear or discomfort in social situations."
  },
  {
    id: 291,
    question: "What is the self-concept?",
    options: {
      A: "An individual's perception of their own identity and attributes",
      B: "A measure of intelligence",
      C: "A set of social roles",
      D: "A temporary mood state"
    },
    correctAnswer: "A",
    explanation: "Self-concept is the overall idea of who a person is, including their beliefs and feelings about themselves."
  },
  {
    id: 292,
    question: "What does 'adjustment' refer to in psychology?",
    options: {
      A: "The process of changing behavior to adapt to new conditions",
      B: "A measurement of cognitive ability",
      C: "The diagnosis of a mental disorder",
      D: "The development of personality traits"
    },
    correctAnswer: "A",
    explanation: "Adjustment is the process of adapting to new or challenging circumstances."
  },
  {
    id: 293,
    question: "Which theory emphasizes the role of environmental stimuli and responses in behavior?",
    options: {
      A: "Cognitive theory",
      B: "Psychoanalytic theory",
      C: "Behaviorism",
      D: "Humanistic theory"
    },
    correctAnswer: "C",
    explanation: "Behaviorism focuses on how environmental stimuli influence responses and behavior."
  },
  {
    id: 294,
    question: "What is intrinsic motivation?",
    options: {
      A: "Motivation driven by external rewards",
      B: "Motivation that comes from within, such as personal interest",
      C: "A form of punishment",
      D: "A type of cognitive bias"
    },
    correctAnswer: "B",
    explanation: "Intrinsic motivation comes from internal satisfaction and interest rather than external rewards."
  },
  {
    id: 295,
    question: "What is extrinsic motivation?",
    options: {
      A: "Motivation driven by internal satisfaction",
      B: "Motivation driven by external rewards or pressures",
      C: "A type of memory",
      D: "A process of self-reflection"
    },
    correctAnswer: "B",
    explanation: "Extrinsic motivation is based on external rewards such as money, praise, or recognition."
  },
  {
    id: 296,
    question: "What is a logical fallacy?",
    options: {
      A: "An error in reasoning that undermines the logic of an argument",
      B: "A type of memory loss",
      C: "A statistical error",
      D: "A cognitive bias"
    },
    correctAnswer: "A",
    explanation: "A logical fallacy is an error in reasoning that results in an invalid argument."
  },
  {
    id: 297,
    question: "What is a self-fulfilling prophecy?",
    options: {
      A: "A prediction that has no effect on behavior",
      B: "A prediction that indirectly causes itself to become true",
      C: "An outcome that contradicts expectations",
      D: "A type of psychological disorder"
    },
    correctAnswer: "B",
    explanation: "A self-fulfilling prophecy occurs when a belief or expectation leads to behavior that causes the belief to come true."
  },
  {
    id: 298,
    question: "What is the study of human behavior and mental processes called?",
    options: {
      A: "Psychology",
      B: "Sociology",
      C: "Anthropology",
      D: "Philosophy"
    },
    correctAnswer: "A",
    explanation: "Psychology is the scientific study of behavior and mental processes."
  },
  {
    id: 299,
    question: "What does an introduction to psychology course primarily cover?",
    options: {
      A: "Advanced statistical methods",
      B: "The history, theories, and research methods of psychology",
      C: "Exclusive training in clinical therapy",
      D: "Detailed analysis of brain anatomy"
    },
    correctAnswer: "B",
    explanation: "An introductory course in psychology covers the history, major theories, research methods, and fundamental concepts of the discipline."
  },
  {
    id: 300,
    question: "What is the primary goal of an introduction to psychology course?",
    options: {
      A: "To explore the scientific study of behavior and mental processes",
      B: "To learn about ancient civilizations",
      C: "To study chemical reactions in the brain exclusively",
      D: "To master advanced statistical techniques"
    },
    correctAnswer: "A",
    explanation: "An introductory psychology course aims to provide an overview of the scientific study of behavior and mental processes."
  }

];

module.exports = questions;
