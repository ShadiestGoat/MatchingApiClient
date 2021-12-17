import { annoying, infpRes, looks, looksFace, majorMatch, personality, profile, traits, gender, profileCoordsToCoords, coordsToProfileC, sexualCompatability, Gender, Subject } from "./profile"

type baseQuestion<T> = {
    question: string,
    /** if present, set the heading to be a link */
    a?: string,
    /** if true, skip the question */
    skipQuestion: (prof: profile) => boolean,
    values: (prof: profile) => T,
    parse: (inp: T, prof: profile) => profile,
    major: keyof profile,
    sub?: string
}

export type inputQuestion = {
    type: "input",
    /** if true, everything is ok! & Allow this as a result */
    filter: (str: string) => boolean
} & baseQuestion<string>

export type orderQuestion<Keys extends string | number> = {
    type: "draggable",
    optionsAndAliases: (prof:profile) => Record<Keys, string>,
    labels: string[]
} & baseQuestion<Keys[]>

export type pieQuestion<Keys extends string | number> = {
    type: "pie",
    optionsAndAliases: (prof:profile) => Record<Keys, string>
} & baseQuestion<Record<Keys, number>>

/** note that 0% is the very left */
export type sliderQuestion<Keys extends string | number> = {
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

export type radialQuestion<Keys extends string | number> = {
    type: "radial",
    optionsAndAliases: (prof:profile) => Record<Keys, string>
} & baseQuestion<Keys>

export type checkboxQuestion<Keys extends string | number> = {
    type: "checkbox",
    optionsAndAliases: (prof:profile) => Record<Keys, string>
} & baseQuestion<Record<Keys, boolean>>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type question<Keys extends string | number = any> =
            inputQuestion |
            pieQuestion<Keys> |
            sliderQuestion<Keys> |
            graphQuestion |
            radialQuestion<Keys> |
            checkboxQuestion<Keys> |
            orderQuestion<Keys>

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
            Career: "Career Compatability"
        }),
        parse: (inp, prof) => {
            prof.weights.major = inp
            return prof
        },
        skipQuestion: () => false,
        values: (prof) => prof.weights.major,
        major: "weights",
        sub: "major"
    } as pieQuestion<majorMatch>,
    {
        question: "By importance, what makes a sexually compatible partner?",
        type: "pie",
        optionsAndAliases: () => ({
            IntoForeplay: "Into Foreplay Match",
            MatchBDSM: "Match for BDSM",
            MatchTop: "'top' type match",
            Thirst: "Thirst Match"
        }),
        parse: (inp, prof) => {
            prof.weights.sexual = inp
            return prof
        },
        skipQuestion: (prof) => prof.weights.major.SexualCompatability === 0,
        values: (prof) => prof.weights.sexual,
        major: "weights",
        sub: "major"
    } as pieQuestion<sexualCompatability>,
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
        values: (prof) => prof.weights.looks,
        major: "weights",
        sub: "looks"
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
        values: (prof) => prof.weights.looksFace,
        major: "weights",
        sub: "looksFace"
    } as pieQuestion<looksFace>,
    {
        question: "How important are these traits?",
        type: "pie",
        optionsAndAliases: () => ({
            BookSmart: "Book Smart",
            GoodCook: "Good Cook",
            MatchPolitical: "Politicaly Compatible",
            Rich: "Wealth Level",
            StreetSmart: "Street Smart",
            TechSavy: "Tech Savy",
        }),
        skipQuestion: (prof) => prof.weights.major.Traits === 0,
        parse: (inp, prof) => {
            prof.weights.traits = inp
            return prof
        },
        values: (prof) => prof.weights.traits,
        major: "weights",
        sub: "traits"
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
        values: (prof) => prof.weights.personality,
        major: "weights",
        sub: "personality"
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
        major: "weights",
        sub: "infp"
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
        values: (prof) => prof.weights.annoying,
        major: "weights",
        sub: "annoying"
    } as pieQuestion<annoying>,
    {
        question: "By importance, what makes you politically compatible?",
        type: "pie",
        optionsAndAliases: () => ({
            MatchCompass: "Political Compass",
            politicalEngagement: "Political Engagement"
        }),
        skipQuestion: (prof) => prof.weights.traits.MatchPolitical === 0 || prof.weights.major.Traits === 0,
        parse: (inp, prof) => {
            prof.weights.political = inp
            return prof
        },
        values: (prof) => prof.weights.political,
        major: "weights",
        sub: "political"
    } as pieQuestion<keyof profile['weights']['political']>,
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
        values: (prof) => prof.data.infp,
        major: "data",
    },
    {
        question: "Do the FULL BDSM Test & paste the resulting link:",
        type: "input",
        skipQuestion: () => false,
        filter: (str) => str.trim().startsWith('https://bdsmtest.org/r/'),
        a: "https://bdsmtest.org",
        parse: (inp, prof) => {
            prof.data.bdsm = inp
            return prof
        },
        values: (prof) => prof.data.bdsm,
        major: "data",
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
        values: (prof) => prof.data.politicalCompass,
        major: "data",
    },
    {
        question: "What gender are you?",
        type: "radial",
        optionsAndAliases: () => ({
            0: "Male",
            1: "Female",
            2: "Non Binary",
            3: "Gender Fluid",
            4: "None (the gender)",
            5: "Other"
        }),
        parse: (inp, prof) => {
            prof.data.gender.gender = inp
            return prof
        },
        skipQuestion: () => false,
        values: (prof) => prof.data.gender.gender,
        major: "data",
    } as radialQuestion<Gender>,
    {
        question: "Ok, but are you a femboy?",
        type: "radial",
        optionsAndAliases: () => ({
            f: "No!",
            t: "Yes!"
        }),
        major: "data",
        parse: (inp, prof) => {
            prof.data.gender.isOpposite = inp == "t"
            return prof
        },
        skipQuestion: (prof) => prof.data.gender.gender != Gender.Male,
        values: (prof) => prof.data.gender.isOpposite ? "t" : "f"
    } as radialQuestion<"t" | "f">,
    {
        question: "Ok, but are you a tomboy?",
        type: "radial",
        optionsAndAliases: () => ({
            f: "No!",
            t: "Yes!"
        }),
        major: "data",
        parse: (inp, prof) => {
            prof.data.orientation.okWithOpposite = inp == "t"
            return prof
        },
        skipQuestion: (prof) => prof.data.gender.gender != Gender.Female,
        values: (prof) => prof.data.gender.isOpposite ? "t" : "f"
    } as radialQuestion<"t" | "f">,
    {
        question: "Are you a monogamist?",
        type: "radial",
        optionsAndAliases: () => ({
            0: "Monogomus",
            1: "Not Monogomus",
            2: "Depends"
        }),
        parse: (inp, prof) => {
            prof.data.monogomy = parseInt(inp, 10) as number
            return prof
        },
        skipQuestion: () => false,
        values: (prof) => prof.data.monogomy.toString() as "0" | "1" | "2",
        major: "data"
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
            prof.data.top = parseInt(inp, 10) as number
            return prof
        },
        skipQuestion: () => false,
        values: (prof) => prof.data.top.toString() as "0" | "1" | "2",
        major: "data"
    } as question<"0" | "1" | "2">,
    {
        question: "Which gender(s) are you into?",
        type: "checkbox",
        optionsAndAliases: () => ({
            Male: "Male",
            Female: "Female",
            Fluid: "Gender Fluid",
            NonBinary: "Non Binary",
            None: "No Gender",
            Other: "Other"
        }),
        parse: (inp, prof) => {
            prof.data.orientation.genders = inp
            return prof
        },
        skipQuestion: () => false,
        values: (prof) => prof.data.orientation.genders,
        major: "data"
    } as question<gender>,
    {
        question: "Ok, I see you're not into men, but are you into femboys?",
        type: "radial",
        optionsAndAliases: () => ({
            f: "No!",
            t: "Yes!"
        }),
        major: "data",
        parse: (inp, prof) => {
            prof.data.orientation.okWithOpposite = inp == "t"
            return prof
        },
        skipQuestion: (prof) => !(prof.data.orientation.genders.Female && !prof.data.orientation.genders.Male),
        values: (prof) => prof.data.orientation.okWithOpposite ? "t" : "f"
    } as radialQuestion<"t" | "f">,
    {
        question: "Ok, I see you're not into women, but are you into tomboys?",
        type: "radial",
        optionsAndAliases: () => ({
            f: "No!",
            t: "Yes!"
        }),
        major: "data",
        parse: (inp, prof) => {
            prof.data.orientation.okWithOpposite = inp == "t"
            return prof
        },
        skipQuestion: (prof) => !(prof.data.orientation.genders.Male && !prof.data.orientation.genders.Female),
        values: (prof) => prof.data.orientation.okWithOpposite ? "t" : "f"
    } as radialQuestion<"t" | "f">,
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
        major: "data",
        sub: "intoForeplay"
    } as question<"IntoForeplay">,
    {
        question: "Which subject is your future career going to involve the most?",
        type: "radial",
        major: "data",
        optionsAndAliases: () => ({
            0: "Languages",
            1: "Business",
            2: "Computer Sciences",
            3: "Philosophy",
            4: "Natural Sciences",
            5: "Human Sciences",
            6: "Arts",
            7: "Maths",
            8: "Police/Military"
        }),
        parse: (inp, prof) => {
            prof.data.subject = inp
            return prof
        },
        skipQuestion: () => false,
        values: (prof) => prof.data.subject,
    } as radialQuestion<Subject>,
    {
        type: "Title",
        content: "Dream Partner",
        subtitle: "Now we will finding out about your dream partner"
    },
    {
        question: "In order, what is your dream partner's job involved with?",
        type: "draggable",
        labels: ["Most want it", "Least want it"],
        major: "pref",
        optionsAndAliases: () => ({
            0: "Languages",
            1: "Business",
            2: "Computer Sciences",
            3: "Philosophy",
            4: "Natural Sciences",
            5: "Human Sciences",
            6: "Arts",
            7: "Maths",
            8: "Police/Military"
        }),
        parse: (inp, prof) => {
            prof.pref.career = inp
            return prof
        },
        skipQuestion: (prof) => prof.weights.major.Career === 0,
        values: (prof) => prof.pref.career
    } as question<Subject>,
    {
        question: "What is your dream partner's height (cm)?",
        type: "input",
        skipQuestion: (prof) => prof.weights.major.Looks === 0 || prof.weights.looks.Height === 0,
        filter: (str) => !Number.isNaN(parseInt(str, 10)),
        parse: (inp, prof) => {
            prof.pref.looks.Height = parseInt(inp, 10)
            return prof
        },
        values: (prof) => `${prof.pref.looks.Height.toString()}cm`,
        major: "pref",
        sub: "looks"
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
                ["Selfish", "Selfless", "Selfish"],
                ["Talkative", "Mute", "Extremely Talkative"],
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
        major: "pref",
        sub: "annoying"
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
        values: (prof) => prof.pref.infp,
        major: "pref",
        sub: "infp"
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
            profile.pref.personality = Object.assign(profile.pref.personality, inp)
            return profile
        },
        values: (prof) => prof.pref.personality,
        major: "pref",
        sub: "personality"
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
            prof.pref.characterAlignment = coordsToProfileC(inp)
            return prof
        },
        skipQuestion: (prof) => prof.weights.major.Personality === 0 || prof.weights.personality.CharacterAlignment === 0,
        values: (prof) => profileCoordsToCoords(prof.pref.characterAlignment),
        major: "pref",
        sub: "characterAlignment"
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
            prof.pref.political.MatchCompass = coordsToProfileC(inp)
            return prof
        },
        skipQuestion: (prof) => prof.weights.major.Traits == 0 || prof.weights.traits.MatchPolitical === 0 || prof.weights.political.MatchCompass === 0,
        values: (prof) => profileCoordsToCoords(prof.pref.political.MatchCompass),
        major: "pref",
        sub: "political"
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
        values: (prof) => prof.pref.looks,
        major: "pref",
        sub: "looks"
    } as question<keyof profile['pref']['looks']>,
    {
        question: "What makes someone's face hot?",
        type: "slider",
        optionsAndAliases: (prof) => Object.fromEntries(
            ([
                ["HotEyes", "Ugly & Basic Eyes", "Extremely Pretty Eeyes"],
                ["HotHair", "Disgusting Hair", "Hot Hair"],
                ["SharpChin", "Round & Blunt Chin", "Chin Could Cut"],
                ["LittleAcne", "Loads of acne", "No Acne"],
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
        values: (prof) => prof.pref.looksFace,
        major: "pref",
        sub: "looksFace"
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
        major: "pref",
        sub: "sexual"
    } as question<"Thirst">,
    {
        question: "How politically engaged do you want your partner?",
        type: "slider",
        optionsAndAliases: () => ({
            PolInvolv: {
                inside: [],
                outside: ["Does not care", "Extremly engaged"]
            }
        }),
        parse: (inp, prof) => {
            prof.pref.political.politicalEngagement = inp.PolInvolv
            return prof
        },
        skipQuestion: (prof) => prof.weights.major.Traits === 0 || prof.weights.traits.MatchPolitical === 0 || prof.weights.political.politicalEngagement === 0,
        values: (prof) => ({PolInvolv: prof.pref.political.politicalEngagement}),
        major: "pref",
        sub: "political"
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
                outside: ["Oblivious", "Wise"]
            }}
        )),
        parse: (inp, prof) => {
            prof.pref.traits = Object.assign(prof.pref.traits, inp)
            return prof
        },
        skipQuestion: (prof) => prof.weights.major.Traits === 0 || (prof.weights.traits.StreetSmart + prof.weights.traits.BookSmart) === 0,
        values: (prof) => ({BookSmart: prof.pref.traits.BookSmart, StreetSmart: prof.pref.traits.StreetSmart}),
        major: "pref",
        sub: "traits"
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
        values: (prof) => prof.pref.traits,
        major: "pref",
        sub: "traits"
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
