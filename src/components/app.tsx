import { FunctionalComponent } from 'preact';
// import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from "preact-transitioning"
// import { Helmet } from 'react-helmet';
// import BoutMe from './AboutMe';
// import ContactMe from './contact';
// import HomeP from './Home';
// import Portfolio from './portfolio';
// import Notfound from '../routes/notfound';
// import React from 'react';
import { useCallback, useState } from 'preact/hooks';
import Question from './Home';

export type Pages = "" |
             "portfolio" |
             "contact" |
             "boutme"
// TODO: Hash router for the icons
// TODO:  as unknown as React.ReactElement, just alias it though idk how

export type personality = "IO" | "SI" | "FT" | "JP"
export type traits = "Funny" |
                "Cute" |
                "Kind" |
                "BookSmart" |
                "StreetSmart" |
                "Rich" |
                "OpenMinded" |
                "Maturity" |
                "Ego" |
                "Edge" |
                "Annoyingness" |
                "Selfishness" |
                "Temper" |
                "Creepiness"

export type looks = "Face" |
             "Fashion" |
             "Muscular" |
             "HairCoolness" |
             "Figure" |
             "Height" |
             "Eyes"

export type Num<K extends string> = Record<K, number>

export type profile = {
    data: {
        /**
         * url
         */
        personalityTest: string,
        /**
         * url
         */
        political: string,
    },
    pref: {
        personality: Num<personality>
        traits: Num<traits>
        looks: Num<Extract<looks, "Figure" | "Height">>
        pol: [number, number]
    },
    weights: {
        major: Record<"bdsm" | "looks" | "personality" | "toptype" | "politics" | "traits", number>
        traits: Record<traits, number>,
        looks: Record<looks, number>,
        personality: Record<personality, number>
    },
    metas: {
        gender: number,
        monogamy: number,
        top: number,
        orientation: {
            Male: boolean,
            Female: boolean,
            Fluid: boolean,
            Other: boolean
        }
    }

}

const curPr = {
    data: {},
    metas: {
        gender: 0,
        monogamy: 0,
    },
    pref: {
        looks: {
            Figure: 0,
            Height: 0
        },
        personality: {
            FT: 50,
            IO: 50,
            JP: 50,
            SI: 50
        },
        pol: [50, 50],
        traits: {
            Annoyingness: 0,
            Creepiness: 0,
            Cute: 70,
            Edge: 20,
            Ego: 20,
            Funny: 60,
            Kind: 0,
            Maturity: 60,
            OpenMinded: 100,
            Rich: 70,
            Selfishness: 10,
            Temper: 30,
            BookSmart: 50,
            StreetSmart: 70,
        }
    },
    weights: {}
} as profile

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type quest<O extends string = any> = {
    question: string,
    ignoreIf: (profile: profile) => boolean,
} & ({
    answerType: "input",
    filter: (str: string) => boolean,
    a: string,
    parse: (inp: string, prof: profile) => profile
} | {
    answerType: "pie",
    options: Record<O, string> | ((profile:profile) => Record<O, string>),
    parse: (inp: Num<O>, prof: profile) => profile
} | {
    answerType: "rate",
    options: Record<O, string | [string, string]> | ((profile:profile) => Record<O, string | [string, string]>),
    parse: (inp: Num<O>, prof: profile) => profile
} | {
    answerType: "rateGraph",
    x: string,
    y: string,
    parse: (inp: [number, number], prof: profile) => profile
} | {
    answerType: "checkboxes",
    options: Record<O, string> | ((profile:profile) => string[]),
    parse: (inp: Record<O, boolean>, prof: profile) => profile
} | {
    answerType: "radial",
    options: Record<O, string> | ((profile:profile) => Record<O, string>),
    parse: (inp: O, prof: profile) => profile
})

const questions:quest[] = [{
        question: "How much do you care about these categories?",
        answerType: "pie",
        ignoreIf: () => false,
        options: {
            Face: "Face Hotness",
            Fashion: "Fashion Sense",
            Muscular: "Muscularity",
            HairCoolness: "Hair Coolness",
            Figure: "Figure",
            Height: "Height",
            Eyes: "Pretty Eyes"
        },
        parse: (inp, prof) => {
            prof.weights.looks = inp
            return prof
        }
    } as quest<looks>,
    {
        question: "How much do you care about these categories?",
        answerType: "pie",
        options: {
            Funny: "Funniness",
            Cute: "Cuteness",
            Annoyingness: "Annoyingness",
            Creepiness: "Creepiness",
            Edge: "Edgyness",
            Ego: "Ego",
            Intelligence: "Intelligence",
            Kind: "Kindness",
            Maturity: "Maturity",
            OpenMinded: "Open Mindness",
            Rich: "Richness (Money)",
            Selfishness: "Selfishness",
            Temper: "Temper",
            BookSmart: "Book smart",
            StreetSmart: "Street smart"
        },
        ignoreIf: () => false,
        parse: (inp, prof) => {
            prof.weights.traits = inp
            return prof
        }
    } as quest<traits>,
    {
        question: "How much do you care about these categories?",
        answerType: "pie",
        options: {
            SI: "Sensing/Intuition",
            FT: "Feeling/Thinking",
            IO: "Introversion/Extroversion",
            JP: "Judging/Perceiving",
        },
        ignoreIf: () => false,
        parse: (inp, prof) => {
            prof.weights.personality = inp
            return prof
        }
    } as quest<personality>,
    {
        question: "How much do you care about these categories?",
        answerType: "pie",
        options: {
            bdsm: "Sexual Compatability (BDSM)",
            looks: "Looks",
            personality: "Personality",
            politics: "Politics",
            toptype: "Top",
            traits: "Traits",
        },
        ignoreIf: () => false,
        parse: (inp, prof) => {
            prof.weights.major = inp
            return prof
        }
    } as quest<keyof profile['weights']['major']>,
    {
        question: "Do this personality test, and put the link you get to below",
        answerType: "input",
        ignoreIf: () => false,
        filter: (str) => str.trim().startsWith('https://openpsychometrics.org/tests/OEJTS/results.php?r='),
        a: "https://openpsychometrics.org/tests/OEJTS",
        parse: (inp, prof) => {
            prof.data.personalityTest = inp
            return prof
        }
    },
    {
        question: "Do the political compass test, and post the final link below",
        answerType: "input",
        ignoreIf: () => false,
        filter: (str) => str.trim().startsWith("https://politicalcompass.org/analysis2?ec="),
        a: "https://politicalcompass.org",
        parse: (inp, prof) => {
            prof.data.political = inp
            return prof
        }
    },
    {
        question: "What do you prefer in your partner?",
        answerType: "rate",
        options: (profile) => {
            const profs: [personality, string, string][] = [
                ["FT", "Feeling", "Thinking"],
                ["IO", "Introversion", "Extroversion"],
                ["JP", "Judging", "Perceiving"],
                ["SI", "Sensing", "Intuition"]
            ]
            const obj = {} as Record<personality, [string, string]>
            profs.forEach(v => {
                if (profile.weights.personality[v[0]] != 0) {
                    obj[v[0]] = v.slice(1) as [string, string]
                }
            })
            return obj
        },
        ignoreIf: (profile) => profile.weights.major.personality == 0,
        parse: (inp, profile) => {
            profile.pref.personality = Object.assign(profile.pref.personality, inp)
            return profile
        }
    } as quest<personality>,
    {
        question: "What do you prefer in your partner?",
        answerType: "rate",
        options: (profile) => {
            const options:[traits, string, string][] = [
                ["Funny", "Not Funny", "Funny"],
                ["Cute", "Not Cute", "Cute"],
                ["Kind", "Mean", "Kind"],
                ["StreetSmart", "Clueless", "Wise"],
                ["BookSmart", "Clueless", "Wise"],
                ["Rich", "Poor", "Rich"],
                ["OpenMinded", "Close Minded", "Open Minded"],
                ["Maturity", "Immature", "Mature"],
                ["Ego", "Humble", "Mr. Egoist"],
                ["Edge", "Not edgy", "Edge Lord"],
                ["Annoyingness", "Not Annoying", "Annoying"],
                ["Selfishness", "Selfless", "Selfish"],
                ["Temper", "Hard to anger", "Easy to anger"],
                ["Creepiness", "Not a creep", "Creep"],
            ]
            const newOpts:Record<traits, [string, string]> = {} as Record<traits, [string, string]>
            options.forEach((v) => {
                if (profile.weights.traits[v[0]] != 0) newOpts[v[0]] = v.slice(1) as [string, string]
            })
            return newOpts
        },
        ignoreIf: (profile) => profile.weights.major.traits == 0,
        parse: (inp, prof) => {
            prof.pref.traits = Object.assign(prof.pref.traits, inp)
        }
    } as quest<traits>,
    {
        question: "How tall do you want your partner to be (cm)",
        answerType: "input",
        filter: (str) => !isNaN(parseInt(str, 0)),
        a: "",
        ignoreIf: (profile) => profile.weights.looks.Height == 0,
        parse: (inp, prof) => {
            prof.pref.looks.Height = parseInt(inp, 0)
            return prof
        }
    },
    {
        question: "What figure do you want in your partner?",
        answerType: "rate",
        options: {
            Figure: "Figure",
        },
        ignoreIf: (profile) => profile.weights.looks.Figure == 0,
        parse: (inp, prof) => {
            prof.pref.looks.Figure = inp.Figure
        }
    } as quest<"Figure">,
    {
        question: "Where on the political compass is your dream partner?",
        answerType: "rateGraph",
        x: "Economical Scale",
        y: "Social Scale",
        ignoreIf: (profile) => profile.weights.major.politics == 0,
        parse: (inp, prof) => {
            prof.pref.pol = inp
            return prof
        }
    },
    {
        question: "Which genders are you into?",
        answerType: "checkboxes",
        options: {
            Female: "Female",
            Fluid: "Fluid",
            Male: "Male",
            Other: "Other"
        },
        ignoreIf: () => false,
        parse: (inp, prof) => {
            prof.metas.orientation = inp
            return prof
        }
    } as quest<"Male" | "Female" | "Fluid" | "Other">,
    {
        question: "Are you a Top, Bottom or Versatile (switch, essentially)?",
        answerType: "radial",
        options: {
            Bottom: "Bottom",
            Top: "Top",
            Versatile: "Versatile"
        },
        ignoreIf: () => false,
        parse: (inp, prof) => {
            prof.metas.top = inp == "Top" ? 0 : inp == 'Bottom' ? 1 : 2
            return prof
        }
    } as quest<"Top" | "Bottom" | "Versatile">
]

const App: FunctionalComponent = () => {
    const [curProfile, SetCurProfile] = useState<profile>(JSON.parse(localStorage.getItem("profile") ?? JSON.stringify(curPr)))
    const [i, SetI] = useState<number>(0)

    const changeQ = useCallback((inpI:number, goUp:boolean) => {
        if (questions[i].ignoreIf(curProfile)) {
            if (goUp) {
                if (i == (questions.length-1)) {
                    changeQ(inpI - 1, false)
                } else {
                    changeQ(inpI + 1, true)
                }
            } else if (i == 0) {
                    changeQ(inpI + 1, true)
                } else {
                    changeQ(inpI - 1, false)
                }
        } else {
            SetI(inpI)
        }
    }, [ i, SetI, curProfile ])

    return (
        <div class="container">
            {/* <TransitionGroup>
                <CSSTransition exit={true} in={true} enter={true} appear={false} duration={1300} classNames="pageFromTop"> */}
                    <Question first={i == 0} last={i==(questions.length-1)} question={questions[i]} profile={curProfile} setProfile={SetCurProfile} changeQ={(up) => {changeQ(i + 1*(up ? 1 : -1), up)}} />
                {/* </CSSTransition>
            </TransitionGroup> */}
        </div>
    );
};

export default App;
