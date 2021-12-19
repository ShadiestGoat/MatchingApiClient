import axios from "axios";
import { FunctionComponent } from "preact";
import { useCallback, useMemo, useState } from "preact/hooks";
import { roundPercent } from "../../tools";
import { defaultProfile, profile } from "../profile";
import { questionsHere } from "./additionalQs";
import { allQuestions, question, questions } from "./questionair";
import Question from "./QuestionsHandlerMain";
import { Version } from "../app";

const Questionair:FunctionComponent<{name?: string}> = ({
    name
}) => {
    if (localStorage.getItem("v")?.split('.').slice(0, 2).join(".") != Version.split('.').slice(0, 2).join(".")) {
        localStorage.removeItem("profile")
        localStorage.setItem("v", Version)
    }
    if (!name) name = ""

    const [curProfile, SetCurProfile] = useState<profile>(JSON.parse(localStorage.getItem("profile") ?? JSON.stringify(defaultProfile)))
    const [i, SetI] = useState<number>(0)

    if (!Object.keys(questionsHere).includes(name)) {
       throw "Not Acceptable!"
    }

    const qs:allQuestions[] = useMemo(() => [...questions, ...(questionsHere[name ?? ""]), {
        type: "Title",
        content: "Great! I'll be sending this data now...",
        subtitle: "Dw I won't judge you in secret :)"
    }], [name])

    const changeQ = useCallback((inpI:number, goUp:boolean) => {
        if (inpI == qs.length-1) {
            axios.post(
                "https://bigboyapi.shadygoat.eu",
                {
                    name,
                    Version,
                    prof: curProfile
                }
            )
        }
        if (qs[inpI].type == "Title") {
            SetI(inpI)
        } else if ((qs[inpI] as question).skipQuestion(curProfile)) {
            if (goUp) {
                if (i == (qs.length-1)) {
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
    }, [ i, SetI, curProfile, qs, name ])

    const changeProfile = useCallback((prof:profile, major:keyof profile, sub?:string) => {
        SetCurProfile(prof)
        function loopOver(cur:Record<string, unknown>):Record<string, unknown> {
            Object.keys(cur).forEach((k) => {
                if (typeof cur[k] == "number") {
                    cur[k] = roundPercent(cur[k] as number)
                } else if (typeof cur[k] == "object") {
                    cur[k] = loopOver(cur[k] as Record<string, unknown>)
                }
            })
            return cur
        }
        if (sub) loopOver((prof[major] as Record<string, Record<string, unknown>>)[sub]) // optimise & no need to loop over all keys :)
        localStorage.setItem("profile", JSON.stringify(prof))
    }, [])

    return <Question key={i} first={i == 0} last={i==(qs.length-1)} question={qs[i]} profile={curProfile} setProfile={changeProfile} changeQ={(up) => {changeQ(i + 1*(up ? 1 : -1), up)}} />

}

export default Questionair
