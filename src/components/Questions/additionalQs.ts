import { coordsToProfileC, profileCoordsToCoords } from "../profile";
import { question } from "./questionair";

export const questionsHere:Record<string, question[]> = {
    // ZENGYI
    jnxks: [
        {
            question: "Rate Matao on these qualities :)",
            type: "slider",
            optionsAndAliases: () => ({
                Mature: {
                    inside: [],
                    outside: ["Immature", "Mature"]
                },
                Creepy: {
                    inside: [],
                    outside: ["Not Creepy", "Creepy"]
                },
                OpenMinded: {
                    inside: [],
                    outside: ["Closed Minded", "Open Minded"]
                },
                StreetSmart: {
                    inside: [],
                    outside: ["Oblivious", "Street Smart"]
                },
                Thirst: {
                    inside: [],
                    outside: ["Not Thirsty", "Thirsty"]
                }
            }),
            skipQuestion: () => false,
            parse: (inp, prof) => {
                prof.data.ratings.matao = Object.assign(prof.data.ratings.matao ?? {}, inp)
                return prof
            },
            values: (prof) => ({
                Mature: (prof.data.ratings.matao ?? {}).Mature ?? 0.5,
                Creepy: (prof.data.ratings.matao ?? {}).Creepy ?? 0.5,
                OpenMinded: (prof.data.ratings.matao ?? {}).OpenMinded ?? 0.5,
                StreetSmart: (prof.data.ratings.matao ?? {}).StreetSmart ?? 0.5,
                Thirst: (prof.data.ratings.matao ?? {}).Thirst ?? 0.5,
            }),
            major: "data",
            sub: "ratings"
        } as question<"Mature" | "Creepy" | "OpenMinded" | "StreetSmart" | "Thirst">,
        {
            question: "Rate Dan on these qualities :)",
            type: "slider",
            optionsAndAliases: () => ({
                Cute: {
                    inside: [],
                    outside: ["Not Cute", "Cute"]
                },
                Funny: {
                    inside: [],
                    outside: ["Unfunny", "Funny"]
                },
                Mature: {
                    inside: [],
                    outside: ["Immature", "Mature"]
                },
                Hygenic: {
                    inside: [],
                    outside: ["Filthy", "Hygenic"]
                },
            }),
            skipQuestion: () => false,
            parse: (inp, prof) => {
                prof.data.ratings.dan = Object.assign(prof.data.ratings.dan ?? {}, inp)
                return prof
            },
            values: (prof) => ({
                Cute: (prof.data.ratings.dan ?? {}).Cute ?? 0.5,
                Funny: (prof.data.ratings.dan ?? {}).Funny ?? 0.5,
                Hygenic: (prof.data.ratings.dan ?? {}).Hygenic ?? 0.5,
                Mature: (prof.data.ratings.dan ?? {}).Mature ?? 0.5,
            }),
            major: "data",
            sub: "ratings"
        } as question<"Cute" | "Funny" | "Mature" | "Hygenic">,
        {
            question: "Rate Zekuan on these qualities :)",
            type: "slider",
            optionsAndAliases: () => ({
                Thirst: {
                    inside: [],
                    outside: ["Not Thirsty", "Thirsty"]
                },
                Muscularity: {
                    inside: [],
                    outside: ["Twig", "Muscular"]
                },
                Funny: {
                    inside: [],
                    outside: ["Unfunny", "Funny"]
                },
                Cute: {
                    inside: [],
                    outside: ["Not Cute", "Cute"]
                },
            }),
            skipQuestion: () => false,
            parse: (inp, prof) => {
                prof.data.ratings.zekuan = Object.assign(prof.data.ratings.zekuan ?? {}, inp)
                return prof
            },
            values: (prof) => ({
                Cute: (prof.data.ratings.zekuan ?? {}).Cute ?? 0.5,
                Muscularity: (prof.data.ratings.zekuan ?? {}).Muscularity ?? 0.5,
                Funny: (prof.data.ratings.zekuan ?? {}).Funny ?? 0.5,
                Thirst: (prof.data.ratings.zekuan ?? {}).Thirst ?? 0.5,
            }),
            major: "data",
            sub: "ratings"
        } as question<"Cute" | "Muscularity" | "Funny" | "Thirst">,
        {
            question: "What is the character alignment of Dan?",
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
                if (!prof.data.ratings.dan) prof.data.ratings.dan = {char: [0.5, 0.5]}
                prof.data.ratings.dan.char = coordsToProfileC(inp)
                return prof
            },
            skipQuestion: () => false,
            values: (prof) => profileCoordsToCoords(prof.data.ratings.dan?.char ?? [
                0.5,
                0.5
            ]),
            major: "data",
            sub: "ratings"
        },
    ],
    // MATAO
    matuijnks: [
        {
            question: "Rate Bruna on these qualities :)",
            type: "slider",
            optionsAndAliases: () => ({
                HotHair: {
                    inside: [],
                    outside: ["Ugly Hair", "Hot Hair"]
                },
                Creepy: {
                    inside: [],
                    outside: ["Not Creepy", "Creepy"]
                },
                GoodFashion: {
                    inside: [],
                    outside: ["Wears Ugly Clothes", "Good Fashion Sense"]
                },
                HotEyes: {
                    inside: [],
                    outside: ["Ugly Eyes", "Hot Eyes"]
                },
                Thirst: {
                    inside: [],
                    outside: ["Not Thirsty", "Thirsty"]
                }
            }),
            skipQuestion: () => false,
            parse: (inp, prof) => {
                prof.data.ratings.bruna = Object.assign(prof.data.ratings.bruna ?? {}, inp)
                return prof
            },
            values: (prof) => ({
                HotEyes: (prof.data.ratings.bruna ?? {}).HotEyes ?? 0.5,
                Creepy: (prof.data.ratings.bruna ?? {}).Creepy ?? 0.5,
                HotHair: (prof.data.ratings.bruna ?? {}).HotHiar ?? 0.5,
                GoodFashion: (prof.data.ratings.bruna ?? {}).GoodFashion ?? 0.5,
                Thirst: (prof.data.ratings.bruna ?? {}).Thirst ?? 0.5,
            }),
            major: "data",
            sub: "ratings"
        } as question<"HotHair" | "Creepy" | "GoodFashion" | "Thirst" | "HotEyes">,
        {
            question: "Rate Dan on these qualities :)",
            type: "slider",
            optionsAndAliases: () => ({
                Cute: {
                    inside: [],
                    outside: ["Not Cute", "Cute"]
                },
                Funny: {
                    inside: [],
                    outside: ["Unfunny", "Funny"]
                },
                Mature: {
                    inside: [],
                    outside: ["Immature", "Mature"]
                },
                Egoistic: {
                    inside: [],
                    outside: ["No Ego", "Egoist"]
                },
            }),
            skipQuestion: () => false,
            parse: (inp, prof) => {
                prof.data.ratings.dan = Object.assign(prof.data.ratings.dan ?? {}, inp)
                return prof
            },
            values: (prof) => ({
                Cute: (prof.data.ratings.dan ?? {}).Cute ?? 0.5,
                Funny: (prof.data.ratings.dan ?? {}).Funny ?? 0.5,
                Egoistic: (prof.data.ratings.dan ?? {}).Egoistic ?? 0.5,
                Mature: (prof.data.ratings.dan ?? {}).Mature ?? 0.5,
            }),
            major: "data",
            sub: "ratings"
        } as question<"Cute" | "Funny" | "Mature" | "Egoistic">,
        {
            question: "Rate Rayaan on these qualities :)",
            type: "slider",
            optionsAndAliases: () => ({
                Thirst: {
                    inside: [],
                    outside: ["Not Thirsty", "Thirsty"]
                },
                HotEyes: {
                    inside: [],
                    outside: ["Ugly Eyes", "Hot Eyes"]
                },
                Funny: {
                    inside: [],
                    outside: ["Unfunny", "Funny"]
                },
                Cute: {
                    inside: [],
                    outside: ["Not Cute", "Cute"]
                },
            }),
            skipQuestion: () => false,
            parse: (inp, prof) => {
                prof.data.ratings.rayaan = Object.assign(prof.data.ratings.rayaan ?? {}, inp)
                return prof
            },
            values: (prof) => ({
                Cute: (prof.data.ratings.rayaan ?? {}).Cute ?? 0.5,
                HotEyes: (prof.data.ratings.rayaan ?? {}).HotEyes ?? 0.5,
                Funny: (prof.data.ratings.rayaan ?? {}).Funny ?? 0.5,
                Thirst: (prof.data.ratings.rayaan ?? {}).Thirst ?? 0.5,
            }),
            major: "data",
            sub: "ratings"
        } as question<"Cute" | "HotEyes" | "Funny" | "Thirst">,
        {
            question: "What is the character alignment of Zekuan?",
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
                if (!prof.data.ratings.zekuan) prof.data.ratings.zekuan = {char: [0, 0]}
                prof.data.ratings.zekuan.char = coordsToProfileC(inp)
                return prof
            },
            skipQuestion: () => false,
            values: (prof) => profileCoordsToCoords(prof.data.ratings.zekuan?.char ?? [
                0.5,
                0.5
            ]),
            major: "data",
            sub: "ratings"
        },
    ],
    // SHADY
    iadjsksaiudjas: [
        {
            question: "What is the character alignment of Zengyi?",
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
                if (!prof.data.ratings.zengyi) prof.data.ratings.zengyi = {char: [0.5, 0.5]}
                prof.data.ratings.zengyi.char = coordsToProfileC(inp)
                return prof
            },
            skipQuestion: () => false,
            values: (prof) => profileCoordsToCoords((prof.data.ratings.zengyi ?? {}).char ?? [
                0.5,
                0.5
            ]),
            major: "data",
            sub: "ratings"
        },
    ], // I will rate everything else hehehehe
    // Zeki
    kkkkk: [
        {
            question: "Rate Zengyi on these qualities :)",
            type: "slider",
            optionsAndAliases: () => ({
                OpenMinded: {
                    inside: [],
                    outside: ["Ugly Hair", "Hot Hair"]
                },
                Rich: {
                    inside: [],
                    outside: ["Poor", "Top 0.01%"]
                },
                TechSavy: {
                    inside: [],
                    outside: ["Tech Illitarate", "Tech God"]
                },
                Cute: {
                    inside: [],
                    outside: ["Not Cute", "Cutey Patutey"]
                },
                Thirst: {
                    inside: [],
                    outside: ["Not Thirsty", "Thirsty"]
                }
            }),
            skipQuestion: () => false,
            parse: (inp, prof) => {
                prof.data.ratings.zengyi = Object.assign(prof.data.ratings.zengyi ?? {}, inp)
                return prof
            },
            values: (prof) => ({
                OpenMinded: (prof.data.ratings.zengyi ?? {}).OpenMinded ?? 0.5,
                Rich: (prof.data.ratings.zengyi ?? {}).Rich ?? 0.5,
                Thirst: (prof.data.ratings.zengyi ?? {}).Thirst ?? 0.5,
                Cute: (prof.data.ratings.zengyi ?? {}).Cute ?? 0.5,
                TechSavy: (prof.data.ratings.zengyi ?? {}).TechSavy ?? 0.5,
            }),
            major: "data",
            sub: "ratings"
        } as question<"OpenMinded" | "Rich" | "Cute" | "Thirst" | "TechSavy">,
        {
            question: "Rate Bruna on these qualities :)",
            type: "slider",
            optionsAndAliases: () => ({
                Cute: {
                    inside: [],
                    outside: ["Not Cute", "Cute"]
                },
                HotEyes: {
                    inside: [],
                    outside: ["Ugly Eyes", "Hot Eyes"]
                },
                Thirst: {
                    inside: [],
                    outside: ["Not Thirsty", "Thirsty"]
                },
                HotHair: {
                    inside: [],
                    outside: ["Ugly Hair", "Hot Hair"]
                },
            }),
            skipQuestion: () => false,
            parse: (inp, prof) => {
                prof.data.ratings.bruna = Object.assign(prof.data.ratings.bruna ?? {}, inp)
                return prof
            },
            values: (prof) => ({
                Cute: (prof.data.ratings.bruna ?? {}).Cute ?? 0.5,
                HotEyes: (prof.data.ratings.bruna ?? {}).HotEyes ?? 0.5,
                Thirst: (prof.data.ratings.bruna ?? {}).Thirst ?? 0.5,
                HotHair: (prof.data.ratings.bruna ?? {}).HotHair ?? 0.5,
            }),
            major: "data",
            sub: "ratings"
        } as question<"Cute" | "HotEyes" | "Thirst" | "HotHair">,
        {
            question: "Rate Rayaan on these qualities :)",
            type: "slider",
            optionsAndAliases: () => ({
                Thirst: {
                    inside: [],
                    outside: ["Not Thirsty", "Thirsty"]
                },
                HotEyes: {
                    inside: [],
                    outside: ["Ugly Eyes", "Hot Eyes"]
                },
                Funny: {
                    inside: [],
                    outside: ["Unfunny", "Funny"]
                },
                Cute: {
                    inside: [],
                    outside: ["Not Cute", "Cute"]
                },
            }),
            skipQuestion: () => false,
            parse: (inp, prof) => {
                prof.data.ratings.rayaan = Object.assign(prof.data.ratings.rayaan ?? {}, inp)
                return prof
            },
            values: (prof) => ({
                Cute: (prof.data.ratings.rayaan ?? {}).Cute ?? 0.5,
                HotEyes: (prof.data.ratings.rayaan ?? {}).HotEyes ?? 0.5,
                Funny: (prof.data.ratings.rayaan ?? {}).Funny ?? 0.5,
                Thirst: (prof.data.ratings.rayaan ?? {}).Thirst ?? 0.5,
            }),
            major: "data",
            sub: "ratings"
        } as question<"Cute" | "HotEyes" | "Funny" | "Thirst">,
        {
            question: "What is the character alignment of Matao?",
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
                if (!prof.data.ratings.matao) prof.data.ratings.matao = {char: [0.5, 0.5]}
                prof.data.ratings.matao.char = coordsToProfileC(inp)
                return prof
            },
            skipQuestion: () => false,
            values: (prof) => profileCoordsToCoords((prof.data.ratings.matao ?? {}).char ?? [
                0.5,
                0.5
            ]),
            major: "data",
            sub: "ratings"
        },

    ],
    // Bruna
    unaskl: [
        {
            question: "Rate Matao on these qualities :)",
            type: "slider",
            optionsAndAliases: () => ({
                OpenMinded: {
                    inside: [],
                    outside: ["Ugly Hair", "Hot Hair"]
                },
                Funny: {
                    inside: [],
                    outside: ["Unfunny", "Funny"],
                },
                StreetSmart: {
                    inside: [],
                    outside: ["Oblivious", "Street Smart"]
                },
                Cute: {
                    inside: [],
                    outside: ["Not Cute", "Cutey Patutey"]
                },
                Thirst: {
                    inside: [],
                    outside: ["Not Thirsty", "Thirsty"]
                }
            }),
            skipQuestion: () => false,
            parse: (inp, prof) => {
                prof.data.ratings.matao = Object.assign(prof.data.ratings.matao ?? {}, inp)
                return prof
            },
            values: (prof) => ({
                OpenMinded: (prof.data.ratings.matao ?? {}).OpenMinded ?? 0.5,
                Funny: (prof.data.ratings.matao ?? {}).Funny ?? 0.5,
                Thirst: (prof.data.ratings.matao ?? {}).Thirst ?? 0.5,
                Cute: (prof.data.ratings.matao ?? {}).Cute ?? 0.5,
                StreetSmart: (prof.data.ratings.matao ?? {}).StreetSmart ?? 0.5,
            }),
            major: "data",
            sub: "ratings"
        } as question<"OpenMinded" | "Funny" | "Cute" | "Thirst" | "StreetSmart">,
        {
            question: "Rate Zengyi on these qualities :)",
            type: "slider",
            optionsAndAliases: () => ({
                Cute: {
                    inside: [],
                    outside: ["Not Cute", "Cute"]
                },
                StreetSmart: {
                    inside: [],
                    outside: ["Oblivious", "Street Smart"]
                },
                Thirst: {
                    inside: [],
                    outside: ["Not Thirsty", "Thirsty"]
                },
                HotHair: {
                    inside: [],
                    outside: ["Ugly Hair", "Hot Hair"]
                },
            }),
            skipQuestion: () => false,
            parse: (inp, prof) => {
                prof.data.ratings.zengyi = Object.assign(prof.data.ratings.bruna ?? {}, inp)
                return prof
            },
            values: (prof) => ({
                Cute: (prof.data.ratings.zengyi ?? {}).Cute ?? 0.5,
                StreetSmart: (prof.data.ratings.zengyi ?? {}).StreetSmart ?? 0.5,
                Thirst: (prof.data.ratings.zengyi ?? {}).Thirst ?? 0.5,
                HotHair: (prof.data.ratings.zengyi ?? {}).HotHair ?? 0.5,
            }),
            major: "data",
            sub: "ratings"
        } as question<"Cute" | "StreetSmart" | "Thirst" | "HotHair">,
        {
            question: "What is the character alignment of Rayaan?",
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
                if (!prof.data.ratings.rayaan) prof.data.ratings.rayaan = {char: [0.5, 0.5]}
                prof.data.ratings.rayaan.char = coordsToProfileC(inp)
                return prof
            },
            skipQuestion: () => false,
            values: (prof) => profileCoordsToCoords(prof.data.ratings.rayaan?.char ?? [
                0.5,
                0.5
            ]),
            major: "data",
            sub: "ratings"
        },
    ],
    // Rayaan
    hsit: [
        {
            question: "Rate Zekuan on these qualities :)",
            type: "slider",
            optionsAndAliases: () => ({
                OpenMinded: {
                    inside: [],
                    outside: ["Ugly Hair", "Hot Hair"]
                },
                Funny: {
                    inside: [],
                    outside: ["Unfunny", "Funny"],
                },
                StreetSmart: {
                    inside: [],
                    outside: ["Oblivious", "Street Smart"]
                },
                Cute: {
                    inside: [],
                    outside: ["Not Cute", "Cutey Patutey"]
                },
                Thirst: {
                    inside: [],
                    outside: ["Not Thirsty", "Thirsty"]
                }
            }),
            skipQuestion: () => false,
            parse: (inp, prof) => {
                prof.data.ratings.zekuan = Object.assign(prof.data.ratings.zekuan ?? {}, inp)
                return prof
            },
            values: (prof) => ({
                OpenMinded: (prof.data.ratings.zekuan ?? {}).OpenMinded ?? 0.5,
                Funny: (prof.data.ratings.zekuan ?? {}).Funny ?? 0.5,
                Thirst: (prof.data.ratings.zekuan ?? {}).Thirst ?? 0.5,
                Cute: (prof.data.ratings.zekuan ?? {}).Cute ?? 0.5,
                StreetSmart: (prof.data.ratings.zekuan ?? {}).StreetSmart ?? 0.5,
            }),
            major: "data",
            sub: "ratings"
        } as question<"OpenMinded" | "Funny" | "Cute" | "Thirst" | "StreetSmart">,
        {
            question: "Rate Zengyi on these qualities :)",
            type: "slider",
            optionsAndAliases: () => ({
                OpenMinded: {
                    inside: [],
                    outside: ["Ugly Hair", "Hot Hair"]
                },
                Funny: {
                    inside: [],
                    outside: ["Unfunny", "Funny"],
                },
                StreetSmart: {
                    inside: [],
                    outside: ["Oblivious", "Street Smart"]
                },
                Cute: {
                    inside: [],
                    outside: ["Not Cute", "Cutey Patutey"]
                },
                Thirst: {
                    inside: [],
                    outside: ["Not Thirsty", "Thirsty"]
                }
            }),
            skipQuestion: () => false,
            parse: (inp, prof) => {
                prof.data.ratings.zengyi = Object.assign(prof.data.ratings.zengyi ?? {}, inp)
                return prof
            },
            values: (prof) => ({
                OpenMinded: (prof.data.ratings.zengyi ?? {}).OpenMinded ?? 0.5,
                Funny: (prof.data.ratings.zengyi ?? {}).Funny ?? 0.5,
                Thirst: (prof.data.ratings.zengyi ?? {}).Thirst ?? 0.5,
                Cute: (prof.data.ratings.zengyi ?? {}).Cute ?? 0.5,
                StreetSmart: (prof.data.ratings.zengyi ?? {}).StreetSmart ?? 0.5,
            }),
            major: "data",
            sub: "ratings"
        } as question<"OpenMinded" | "Funny" | "Cute" | "Thirst" | "StreetSmart">,

        {
            question: "Rate Bruna on these qualities :)",
            type: "slider",
            optionsAndAliases: () => ({
                Cute: {
                    inside: [],
                    outside: ["Not Cute", "Cute"]
                },
                StreetSmart: {
                    inside: [],
                    outside: ["Oblivious", "Street Smart"]
                },
                Thirst: {
                    inside: [],
                    outside: ["Not Thirsty", "Thirsty"]
                },
                HotHair: {
                    inside: [],
                    outside: ["Ugly Hair", "Hot Hair"]
                },
            }),
            skipQuestion: () => false,
            parse: (inp, prof) => {
                prof.data.ratings.bruna = Object.assign(prof.data.ratings.bruna ?? {}, inp)
                return prof
            },
            values: (prof) => ({
                Cute: (prof.data.ratings.bruna ?? {}).Cute ?? 0.5,
                StreetSmart: (prof.data.ratings.bruna ?? {}).StreetSmart ?? 0.5,
                Thirst: (prof.data.ratings.bruna ?? {}).Thirst ?? 0.5,
                HotHair: (prof.data.ratings.bruna ?? {}).HotHair ?? 0.5,
            }),
            major: "data",
            sub: "ratings"
        } as question<"Cute" | "StreetSmart" | "Thirst" | "HotHair">,
        {
            question: "What is the character alignment of Bruna?",
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
                if (!prof.data.ratings.bruna) prof.data.ratings.bruna = {char: [0.5, 0.5]}
                prof.data.ratings.bruna.char = coordsToProfileC(inp)
                return prof
            },
            skipQuestion: () => false,
            values: (prof) => profileCoordsToCoords(prof.data.ratings.bruna?.char ?? [
                0.5,
                0.5
            ]),
            major: "data",
            sub: "ratings"
        },
    ],
    kivmansixnine: [
        {
            question: "What is the character alignment of Dan?",
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
                if (!prof.data.ratings.dan) prof.data.ratings.dan = {char: [0.5, 0.5]}
                prof.data.ratings.dan.char = coordsToProfileC(inp)
                return prof
            },
            skipQuestion: () => false,
            values: (prof) => profileCoordsToCoords(prof.data.ratings.dan?.char ?? [
                0.5,
                0.5
            ]),
            major: "data",
            sub: "ratings"
        },
    ]
}
