import { FunctionalComponent } from 'preact';
import { useCallback, useMemo, useState } from 'preact/hooks';
import Question from './QuestionsHandlerMain';
import { defaultProfile, profile } from './profile';
import { allQuestions, question, questions } from './questionair';
import { questionsHere } from './additionalQs';
import axios from 'axios';

const V = "1.1.0"

const App: FunctionalComponent = () => {
    if (localStorage.getItem("v") != V) {
        localStorage.removeItem("profile")
        localStorage.setItem("v", V)
    }
    const [curProfile, SetCurProfile] = useState<profile>(JSON.parse(localStorage.getItem("profile") ?? JSON.stringify(defaultProfile)))
    const [i, SetI] = useState<number>(0)

    const path = location.pathname.slice(1)

    if (!Object.keys(questionsHere).includes(path)) {
       throw "Not Acceptable!"
    }

    const qs:allQuestions[] = useMemo(() => [...questions, ...(questionsHere[path]), {
        type: "Title",
        content: "Great! I'll be sending this data now...",
        subtitle: "Dw I won't judge you in secret :)"
    }], [path])

    const changeQ = useCallback((inpI:number, goUp:boolean) => {
        if (inpI == qs.length-1) {
            axios.post(
                "https://bigboyapi.shadygoat.eu",
                {
                    path,
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
    }, [ i, SetI, curProfile, qs, path ])

    const changeProfile = useCallback((prof:profile, major:keyof profile, sub?:string) => {
        SetCurProfile(prof)
        function loopOver(cur:Record<string, unknown>):Record<string, unknown> {
            Object.keys(cur).forEach((k) => {
                if (typeof cur[k] == "number") {
                    cur[k] = Math.round((cur[k] as number)*10000)/10000
                } else if (typeof cur[k] == "object") {
                    cur[k] = loopOver(cur[k] as Record<string, unknown>)
                }
            })
            return cur
        }
        if (sub) loopOver((prof[major] as Record<string, Record<string, unknown>>)[sub]) // optimise & no need to loop over all keys :)
        localStorage.setItem("profile", JSON.stringify(prof))
    }, [])

    return (
        <Question key={i} first={i == 0} last={i==(qs.length-1)} question={qs[i]} profile={curProfile} setProfile={changeProfile} changeQ={(up) => {changeQ(i + 1*(up ? 1 : -1), up)}} />
    );
};

export default App;
