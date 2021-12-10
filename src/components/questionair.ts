import { annoying, infpRes, looks, looksFace, majorMatch, personality, profile, traits, gender } from "./profile"

type baseQuestion<T> = {
    question: string,
    /** if present, set the heading to be a link */
    a?: string,
    /** if true, skip the question */
    skipQuestion: (prof: profile) => boolean,
    values: (prof: profile) => T,
    parse: (inp: T, prof: profile) => profile
}

export type inputQuestion = {
    type: "input",
    /** if true, everything is ok! & Allow this as a result */
    filter: (str: string) => boolean
} & baseQuestion<string>

export type pieQuestion<Keys extends string> = {
    type: "pie",
    optionsAndAliases: (prof:profile) => Record<Keys, string>
} & baseQuestion<Record<Keys, number>>

/** note that 0% is the very left */
export type sliderQuestion<Keys extends string> = {
    type: "slider",
    optionsAndAliases: (prof:profile) => Record<Keys, {
        inside: labelOne[],
        outside: [string, string]
    }>
} & baseQuestion<Record<Keys, number>>

/** note that 0, 0 is top left */
export type graphQuestion = {
    type: "graph",
    labels: {
        outside: {
            top: [string, string, string],
            middle: [string, string, string],
            bottom: [string, string, string]
        },
        inside: labelTwo[]
    }
} & baseQuestion<{x: number, y: number}>

export type radialQuestion<Keys extends string> = {
    type: "radial",
    optionsAndAliases: (prof:profile) => Record<Keys, string>
} & baseQuestion<Keys>

export type checkboxQuestion<Keys extends string> = {
    type: "checkbox",
    optionsAndAliases: (prof:profile) => Record<Keys, string>
} & baseQuestion<Record<Keys, boolean>>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type question<Keys extends string = any> = inputQuestion | pieQuestion<Keys> | sliderQuestion<Keys> | graphQuestion | radialQuestion<Keys> | checkboxQuestion<Keys>

export type allQuestions = question | {type: "Title", content: string, subtitle?: string}

export const questions:allQuestions[] = [
    {
        type: "Title",
        content: "Lets start with how importantance!",
        subtitle: "Note: When it says smt like 'creepiness', and you really don't want them to be creepy, set the creepyness to be high importance as preferance will be set later!",
    },
    {
        question: "How important are these qualities to you in a partner?",
        type: "pie",
        optionsAndAliases: () => ({
            Looks: "Hotness",
            Personality: "Personality",
            SexualCompatability: "Sexual Compatability",
            Traits: "Traits",
        }),
        parse: (inp, prof) => {
            prof.weights.major = inp
            return prof
        },
        skipQuestion: () => false,
        values: (prof) => prof.weights.major,
    } as pieQuestion<majorMatch>,
    {
        question: "How important are these qualities for hotness?",
        type: "pie",
        optionsAndAliases: () => ({
            Figure: "Figure",
            GoodFashion: "Fashion Sense",
            Height: "Height",
            Hygenic: "Hygenic",
            MatchFace: "Hot Face",
            Muscularity: "Muscular"
        }),
        skipQuestion: (prof) => prof.weights.major.Looks === 0,
        parse: (inp, prof) => {
            prof.weights.looks = inp
            return prof
        },
        values: (prof) => prof.weights.looks
    } as pieQuestion<looks>,
    {
        question: "How important are these factors for face hotness?",
        type: "pie",
        optionsAndAliases: () => ({
            HotEyes: "Pretty Eyes",
            HotHair: "Nice Hair",
            SharpChin: "Sharp Chin",
            LittleAcne: "Amount of Acne"
        }),
        parse: (inp, prof) => {
            prof.weights.looksFace = inp
            return prof
        },
        skipQuestion: (prof) => prof.weights.major.Looks === 0 || prof.weights.looks.MatchFace === 0,
        values: (prof) => prof.weights.looksFace
    } as pieQuestion<looksFace>,
    {
        question: "How important are these traits?",
        type: "pie",
        optionsAndAliases: () => ({
            BookSmart: "Book Smart",
            GoodCook: "Good Cook",
            MatchPolitical: "Politicaly Compatible",
            Rich: "Rich (Money)",
            StreetSmart: "Street Smart",
            TechSavy: "Tech Savy",
        }),
        skipQuestion: (prof) => prof.weights.major.Traits === 0,
        parse: (inp, prof) => {
            prof.weights.traits = inp
            return prof
        },
        values: (prof) => prof.weights.traits
    } as pieQuestion<traits>,
    {
        question: "How important are these qualities for personality?",
        type: "pie",
        optionsAndAliases: () => ({
            Annoying: "Annoying",
            Creepy: "Creepy",
            Cute: "Cute",
            Funny: "Funny",
            Kind: "Kind",
            MatchINFP: "INFP Match",
            OpenMinded: "Open Minded",
            CharacterAlignment: "Char. Alignment",
        }),
        parse: (inp, prof) => {
            prof.weights.personality = inp
            return prof
        },
        skipQuestion: (prof) => prof.weights.major.Personality === 0,
        values: (prof) => prof.weights.personality
    } as pieQuestion<personality>,
    {
        question: "How much do you care about these personality traits?",
        type: "pie",
        optionsAndAliases: () => ({
            SI: "Intuition",
            FT: "Thinking",
            IO: "Extroversion",
            JP: "Perceiving",
        }),
        skipQuestion: (prof) => prof.weights.major.Personality === 0 || prof.weights.personality.MatchINFP === 0,
        parse: (inp, prof) => {
            prof.weights.infp = inp
            return prof
        },
        values: (prof) => prof.weights.infp,
    } as pieQuestion<infpRes>,
    {
        question: "By importance, what makes someone annoying?",
        type: "pie",
        optionsAndAliases: () => ({
            Edgy: "Edgy",
            Egoistic: "Egoistic",
            GoodTemper: "Easy to anger",
            Mature: "Mature",
            Selfish: "Selfish",
            Talkative: "Talkative"
        }),
        skipQuestion: (prof) => prof.weights.personality.Annoying === 0 || prof.weights.major.Personality === 0,
        parse: (inp, prof) => {
            prof.weights.annoying = inp
            return prof
        },
        values: (prof) => prof.weights.annoying
    } as pieQuestion<annoying>,

    {
        type: "Title",
        content: "Let's find out a bit more about you",
    },
    {
        question: "Do this personality test & paste the resulting link:",
        type: "input",
        skipQuestion: () => false,
        filter: (str) => str.trim().startsWith('https://openpsychometrics.org/tests/OEJTS/results.php?r='),
        a: "https://openpsychometrics.org/tests/OEJTS",
        parse: (inp, prof) => {
            prof.data.infp = inp
            return prof
        },
        values: (prof) => prof.data.infp
    },
    {
        question: "Do the political compass test & paste the resulting link:",
        type: "input",
        skipQuestion: () => false,
        filter: (str) => str.trim().startsWith("https://politicalcompass.org/analysis2?ec="),
        a: "https://politicalcompass.org",
        parse: (inp, prof) => {
            prof.data.politicalCompass = inp
            return prof
        },
        values: (prof) => prof.data.politicalCompass
    },
    {
        question: "What gender are you?",
        type: "radial",
        optionsAndAliases: () => ({
            Male: "Male",
            Female: "Female",
            Fluid: "Gender Fluid",
            NonBinary: "Non Binary",
            None: "None",
        }),
        parse: (inp, prof) => {
            prof.data.metas.gender = inp
            return prof
        },
        skipQuestion: () => false,
        values: (prof) => prof.data.metas.gender
    } as question<gender>,
    {
        question: "Are you a monogomist?",
        type: "radial",
        optionsAndAliases: () => ({
            0: "Monogomus",
            1: "Not Monogomus",
            2: "Depends"
        }),
        parse: (inp, prof) => {
            prof.data.metas.monogomy = parseInt(inp, 10) as number
            return prof
        },
        skipQuestion: () => false,
        values: (prof) => prof.data.metas.monogomy.toString() as "0" | "1" | "2",
    } as question<"0" | "1" | "2">,
    {
        question: "Are you a top?",
        type: "radial",
        optionsAndAliases: () => ({
            0: "Top",
            1: "Bottom",
            2: "Versatile"
        }),
        parse: (inp, prof) => {
            prof.data.metas.top = parseInt(inp, 10) as number
            return prof
        },
        skipQuestion: () => false,
        values: (prof) => prof.data.metas.top.toString() as "0" | "1" | "2",
    } as question<"0" | "1" | "2">,
    {
        question: "Which gender(s) are you into?",
        type: "checkbox",
        optionsAndAliases: () => ({
            Male: "Male",
            Female: "Female",
            Fluid: "Gender Fluid",
            NonBinary: "Non Binary",
            None: "None",
        }),
        parse: (inp, prof) => {
            prof.data.metas.orientation = inp
            return prof
        },
        skipQuestion: () => false,
        values: (prof) => prof.data.metas.orientation
    } as question<gender>,
    {
        question: "How much are you into foreplay",
        type: "slider",
        optionsAndAliases: () => ({
            IntoForeplay: {
                inside: [],
                outside: [
                    "Not into it",
                    "Very into it"
                ]
            },
        }),
        parse: (inp, prof) => {
            prof.data.intoForeplay = inp.IntoForeplay
            return prof
        },
        skipQuestion: (prof) => prof.weights.sexual.IntoForeplay === 0,
        values: (prof) => ({IntoForeplay: prof.data.intoForeplay}),
    } as question<"IntoForeplay">,

    {
        type: "Title",
        content: "Dream Partner",
        subtitle: "Now we will finding out about your dream partner"
    },
    {
        question: "What do you prefer for these qualities to be?",
        type: "slider",
        optionsAndAliases: (prof) => Object.fromEntries(
            ([
                ["Edgy", "Not Edgy", "Edgelord"],
                ["Egoistic", "No ego", "Extreme egoism"],
                ["GoodTemper", "Easy to Anger", "Hard to anger"],
                ["Mature", "Immature", "Very Mature"],
                ["Selfish", "Selfish", "Selfless"],
                ["Talkative", "Extremely Talkative", "Mute"],
            ] as [annoying, string, string][]).filter(
                v => prof.weights.annoying[v[0]] !== 0
            ).map(v => ([
                v[0],
                {
                    inside: [] as labelOne[],
                    outside: v.slice(1) as [string, string]
                }
            ]))
        ),
        parse: (inp, prof) => {
            prof.pref.annoying = Object.assign(prof.pref.annoying, inp)
            return prof
        },
        skipQuestion: (prof) => prof.weights.personality.Annoying === 0 || prof.weights.major.Personality === 0,
        values: (prof) => prof.pref.annoying,
    } as question<annoying>,
    {
        question: "What do you prefer in your partner?",
        type: "slider",
        optionsAndAliases: (prof) => Object.fromEntries<{inside: labelOne[], outside: [string, string]}>(
            ([
                ["FT", "Feeling", "Thinking"],
                ["IO", "Introversion", "Extroversion"],
                ["JP", "Judging", "Perceiving"],
                ["SI", "Sensing", "Intuition"]
            ] as [infpRes, string, string][]).filter(
                v => prof.weights.infp[v[0]]).map(v => [v[0], {
                    inside: [],
                    outside: v.slice(1) as [string, string]
                }
            ])
        ),
        skipQuestion: (prof) => prof.weights.major.Personality === 0 || prof.weights.personality.MatchINFP === 0,
        parse: (inp, profile) => {
            profile.pref.infp = Object.assign(profile.pref.infp, inp)
            return profile
        },
        values: (prof) => prof.pref.infp
    } as sliderQuestion<infpRes>,
    {
        question: "What do you prefer in your partner?",
        type: "slider",
        optionsAndAliases: (prof) => Object.fromEntries<{inside: labelOne[], outside: [string, string]}>(
            ([
                ["Creepy", "Not Creepy", "Creepy"],
                ["Cute", "Not Cute", "Cute"],
                ["Funny", "Unfunny", "Funny"],
                ["Kind", "Mean", "Kind"],
                ["OpenMinded", "Closed Minded", "Open Minded"],
            ] as [keyof profile['pref']['personality'], string, string][]).filter(
                v => prof.weights.personality[v[0]]).map(v => [v[0], {
                    inside: [],
                    outside: v.slice(1) as [string, string]
                }
            ])
        ),
        skipQuestion: (prof) => prof.weights.major.Personality === 0 || Object.values(prof.weights.personality).reduce((a, b) => a+b) === 0,
        parse: (inp, profile) => {
            profile.pref.personality = Object.assign(profile.pref.infp, inp)
            return profile
        },
        values: (prof) => prof.pref.personality
    } as sliderQuestion<keyof profile['pref']['personality']>,
    {
        question: "What character alignment are you looking for in your partner?",
        type: "graph",
        labels: {
            inside: [],
            outside: {
                top: ["Lawful Good", "Neutral Good", "Chaotic Good"],
                middle: ["Lawful Neutral", "", "Chaotic Neutral"],
                bottom: ["Lawful Evil", "Neutral Evil", "Chaotic Evil"]
            }
        },
        parse: (inp, prof) => {
            prof.pref.characterAlignment = inp
            return prof
        },
        skipQuestion: (prof) => prof.weights.major.Personality === 0 || prof.weights.personality.CharacterAlignment === 0,
        values: (prof) => prof.pref.characterAlignment
    },
    {
        question: "Where on the political compass is your dream partner?",
        type: "graph",
        labels: {
            outside: {
                top: ["", "Authoritarian", ""],
                middle: ["Left", "", "Right"],
                bottom: ["", "Liberal", ""]
            },
            inside: [
                {
                    label: "China",
                    location: {
                        x: 0.4,
                        y: 0.05
                    }
                },
                {
                    label: "North Korea",
                    location: {
                        x: 0,
                        y: 0.025
                    }
                },
                {
                    label: "Switzerland",
                    location: {
                        x: 0.9,
                        y: 0.6
                    }
                },
                {
                    label: "Singapore",
                    location: {
                        x: 1,
                        y: 0.2
                    }
                },
            ]
        },
        parse: (inp, prof) => {
            prof.pref.political.MatchCompass = inp
            return prof
        },
        skipQuestion: (prof) => prof.weights.major.Traits == 0 || prof.weights.traits.MatchPolitical === 0 || prof.weights.political.MatchCompass === 0,
        values: (prof) => prof.pref.political.MatchCompass,
    } as graphQuestion,
    {
        question: "What makes someone hot?",
        type: "slider",
        optionsAndAliases: (prof) => Object.fromEntries(
            ([
                ["Figure", "Malnurished", "Obese"],
                ["GoodFashion", "Bad Fashion Sense", "Great Fashion Sense"],
                ["Hygenic", "Dirty & Smelly", "Clean"],
                ["Muscularity", "Skin & Bones", "On Steroids"],
            ] as [keyof profile['pref']['looks'], string, string][]).filter(
                v => prof.weights.looks[v[0]] !== 0
            ).map(v => [v[0], {
                inside: [] as labelOne[],
                outside: v.slice(1) as [string, string]
            }])
        ),
        parse: (inp, prof) => {
            prof.pref.looks = Object.assign(prof.pref.looks, inp)
            return prof
        },
        skipQuestion: (prof) => prof.weights.major.Looks === 0,
        values: (prof) => prof.pref.looks
    } as question<keyof profile['pref']['looks']>,
    {
        question: "What makes someone's face hot?",
        type: "slider",
        optionsAndAliases: (prof) => Object.fromEntries(
            ([
                ["HotEyes", "Ugly & Basic Eyes", "Extremely Pretty Eeyes"],
                ["HotHair", "Disgusting Hair", "Hot Hair"],
                ["SharpChin", "A circle chin", "Chin Could Cut Wood"],
            ] as [keyof profile['pref']['looksFace'], string, string][]).filter(
                v => prof.weights.looksFace[v[0]] !== 0
            ).map(v => [v[0], {
                inside: [] as labelOne[],
                outside: v.slice(1) as [string, string]
            }])
        ),
        parse: (inp, prof) => {
            prof.pref.looksFace = Object.assign(prof.pref.looksFace, inp)
            return prof
        },
        skipQuestion: (prof) => prof.weights.major.Looks === 0 || prof.weights.looks.MatchFace === 0,
        values: (prof) => prof.pref.looksFace
    } as question<keyof profile['pref']['looksFace']>,
    {
        question: "How thirsty do you want your partner to be?",
        type: "slider",
        optionsAndAliases: () => ({
            Thirst: {
                inside: [],
                outside: ["Not Thirsty", "Extremly Thirsty"]
            }
        }),
        parse: (inp, prof) => {
            prof.pref.sexual.Thirst = inp.Thirst
            return prof
        },
        values: (prof) => ({Thirst: prof.pref.sexual.Thirst}),
        skipQuestion: (prof) => prof.weights.major.SexualCompatability === 0 || prof.weights.sexual.Thirst === 0,
    } as question<"Thirst">,
    {
        question: "How plolitically involved do you want your partner?",
        type: "slider",
        optionsAndAliases: () => ({
            PolInvolv: {
                inside: [],
                outside: ["Does not care", "Extremly involved"]
            }
        }),
        parse: (inp, prof) => {
            prof.pref.political.politicalInvolvement = inp.PolInvolv
            return prof
        },
        skipQuestion: (prof) => prof.weights.major.Traits === 0 || prof.weights.traits.MatchPolitical === 0 || prof.weights.political.politicalInvolvement === 0,
        values: (prof) => ({PolInvolv: prof.pref.political.politicalInvolvement})
    } as question<"PolInvolv">,
    {
        question: "How Smart should your partner be?",
        type: "slider",
        optionsAndAliases: (prof) => (Object.assign(
            {},
            prof.weights.traits.BookSmart === 0 ? {} :
            {BookSmart: {
                inside: [] as labelOne[],
                outside: ["Stupid", "Loads of Knowledge"]
            }},
            prof.weights.traits.StreetSmart === 0 ? {} :
            {StreetSmart: {
                inside: [] as labelOne[],
                outside: ["Oblivious", "Understands"]
            }}
        )),
        parse: (inp, prof) => {
            prof.pref.traits = Object.assign(prof.pref.traits, inp)
            return prof
        },
        skipQuestion: (prof) => prof.weights.major.Traits === 0 || (prof.weights.traits.StreetSmart + prof.weights.traits.BookSmart) === 0,
        values: (prof) => ({BookSmart: prof.pref.traits.BookSmart, StreetSmart: prof.pref.traits.StreetSmart})
    } as question<"BookSmart" | "StreetSmart">,
    {
        question: "What makes someone have good traits?",
        type: "slider",
        optionsAndAliases: (prof) => Object.fromEntries(
            ([
                ["GoodCook", "(Unintentionally) makes poison", "Culinary Genius"],
                ["Rich", "Lower Class", "Top 0.01%"],
                ["TechSavy", "Scared of Tech", "Technological God"],
            ] as [keyof Exclude<profile['pref']['traits'], "BookSmart" | "StreetSmart">, string, string][]).filter(
                v => prof.weights.traits[v[0]] !== 0
            ).map(v => [v[0], {
                inside: [] as labelOne[],
                outside: v.slice(1) as [string, string]
            }])
        ),
        parse: (inp, prof) => {
            prof.pref.traits = Object.assign(prof.pref.traits, inp)
            return prof
        },
        skipQuestion: (prof) => ((1-prof.weights.traits.BookSmart-prof.weights.traits.StreetSmart) === 0 || prof.weights.major.Traits === 0),
        values: (prof) => prof.pref.traits
    } as question<keyof Exclude<profile['pref']['traits'], "BookSmart" | "StreetSmart">>,
    {
        type: "Title",
        content: "You did it! This data will be sent over to me soon...",
        subtitle: "Now it's time to rate some people hehe"
    }
]

export type coords = {
    x: number,
    y: number
}

/**
 * 2D Label
 */
type labelTwo = {
    location: coords,
    label: string
}
/**
 * 1D Label
 */
type labelOne = {
    location: number,
    label: string
}
