import { coords } from "./questionair"

export type infpRes = "IO" | "SI" | "FT" | "JP"

export type annoying = "Egoistic" |
                       "Edgy" |
                       "Mature" |
                       "Talkative" |
                       "Selfish" |
                       "GoodTemper"

export type personality = "Annoying" |
                          "MatchINFP" |
                          "Creepy" |
                          "Funny" |
                          "Cute" |
                          "Kind" |
                          "CharacterAlignment" |
                          "OpenMinded"

export type looksFace = "HotHair" |
                        "HotEyes" |
                        "SharpChin" |
                        "LittleAcne"

export type looks = "MatchFace" |
                    "GoodFashion" |
                    "Muscularity" |
                    "Hygenic" |
                    "Height" |
                    "Figure"

export type sexualCompatability = "MatchBDSM" |
                                  "MatchTop" |
                                  "Thirst" |
                                  "IntoForeplay"

export type politicalMatch =  "MatchCompass" |
                              "politicalInvolvement"

export type traits = "BookSmart" |
                     "StreetSmart" |
                     "Rich" |
                     "GoodCook" |
                     "MatchPolitical" |
                     "TechSavy"

export type majorMatch = "Personality" |
                         "Traits" |
                         "Looks" |
                         "SexualCompatability"

export type gender = "Male" |
                     "Female" |
                     "NonBinary" |
                     "Fluid" |
                     "Other" |
                     "None"

export type profileCoords = [number, number]

export function coordsToProfileC(coords:coords):profileCoords {
    return [coords.x, coords.y]
}
export function profileCoordsToCoords(coords:profileCoords):coords {
    return {
        x: coords[0],
        y: coords[1]
    }
}

export type profile = {
    data: {
        metas: {
            gender: number,
            /**
             * 0 - Monogomous
             * 1 - NonMonogomous
             * 2 - Switch
             */
            monogomy: number,
            /**
             * 0 - Top
             * 1 - Bottom
             * 2 - Switch
             */
            top: number,
            orientation: Record<gender, boolean>,
        },
        intoForeplay: number,
        ratings: Record<string, Record<string, number> & {char: profileCoords}>
        politicalCompass: string,
        infp: string,
    },
    pref: {
        annoying: Record<annoying, number>,
        traits: Record<Exclude<traits, "MatchPolitical">, number>,
        looksFace: Record<looksFace, number>,
        infp: Record<infpRes, number>,
        political: {
            politicalInvolvement: number,
            MatchCompass: profileCoords
        },
        sexual: Record<Exclude<sexualCompatability, "MatchTop" | "MatchBDSM" | "IntoForeplay">, number>,
        looks: Record<Exclude<looks, "MatchFace">, number>,
        personality: Record<Exclude<personality, "Annoying" | "MatchINFP" | "CharacterAlignment">, number>,

        characterAlignment: profileCoords
    },
    weights: {
        annoying: Record<annoying, number>,
        traits: Record<traits, number>,
        looksFace: Record<looksFace, number>,
        infp: Record<infpRes, number>
        major: Record<majorMatch, number>,
        political: Record<politicalMatch, number>,
        sexual: Record<sexualCompatability, number>,
        looks: Record<looks, number>,
        personality: Record<personality, number>,
    },
}

export const defaultProfile:profile = {
    data: {
        metas: {
            gender: 4,
            monogomy: 0,
            orientation: {
                Female: false,
                Fluid: false,
                Male: false,
                NonBinary: false,
                None: false,
                Other: false
            },
            top: 2
        },
        intoForeplay: 0.5,
        infp: "",
        politicalCompass: "",
        ratings: {}
    },
    pref: {
        annoying: {
            Edgy: 0.5,
            Egoistic: 0.5,
            GoodTemper: 0.5,
            Mature: 0.5,
            Selfish: 0.5,
            Talkative: 0.5
        },
        infp: {
            FT: 0.5,
            IO: 0.5,
            JP: 0.5,
            SI: 0.5
        },
        looks: {
            Figure: 0.45,
            GoodFashion: 0.7,
            Height: 173,
            Hygenic: 0.8,
            Muscularity: 0.6
        },
        looksFace: {
            HotEyes: 0.9,
            HotHair: 0.8,
            SharpChin: 0.5,
            LittleAcne: 0.7
        },
        personality: {
            Creepy: 0.5,
            Cute: 0.5,
            Funny: 0.5,
            Kind: 0.5,
            OpenMinded: 0.5,
        },
        political: {
            MatchCompass: [0.5, 0.5],
            politicalInvolvement: 0.5
        },
        sexual: {
            Thirst: 0.5
        },
        traits: {
            BookSmart: 0.5,
            StreetSmart: 0.5,
            GoodCook: 0.5,
            Rich: 0.5,
            TechSavy: 0.5,
        },
        characterAlignment: [0.5, 0.5]
    },
    weights: {
        annoying: {
            Edgy: 0.2,
            Egoistic: 0.15,
            GoodTemper: 0.15,
            Mature: 0.2,
            Selfish: 0.15,
            Talkative: 0.15
        },
        infp: {
            FT: 0.25,
            IO: 0.25,
            JP: 0.25,
            SI: 0.25
        },
        looks: {
            Figure: 0.1665,
            GoodFashion: 0.1665,
            Height: 0.1665,
            Hygenic: 0.1665,
            MatchFace: 0.1665,
            Muscularity: 0.1665
        },
        looksFace: {
            HotEyes: 0.25,
            HotHair: 0.25,
            SharpChin: 0.25,
            LittleAcne: 0.25
        },
        major: {
            Looks: 0.25,
            Personality: 0.25,
            SexualCompatability: 0.25,
            Traits: 0.25
        },
        personality: {
            Annoying: 0.125,
            Creepy: 0.125,
            Cute: 0.125,
            Funny: 0.125,
            Kind: 0.125,
            MatchINFP: 0.125,
            OpenMinded: 0.125,
            CharacterAlignment: 0.125
        },
        political: {
            MatchCompass: 0.4,
            politicalInvolvement: 0.6
        },
        sexual: {
            IntoForeplay: 0.2,
            MatchBDSM: 0.2,
            MatchTop: 0.3,
            Thirst: 0.3
        },
        traits: {
            BookSmart: 0.1665,
            StreetSmart: 0.1665,
            GoodCook: 0.1665,
            MatchPolitical: 0.1665,
            Rich: 0.1665,
            TechSavy: 0.1665,
        },
    }
}
