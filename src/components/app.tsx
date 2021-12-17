import { FunctionalComponent } from 'preact';
import { useCallback, useMemo, useState } from 'preact/hooks';
import Question from './QuestionsHandlerMain';
import { defaultProfile, profile } from './profile';
import { allQuestions, question, questions } from './questionair';
import { questionsHere } from './additionalQs';
import axios from 'axios';
import { roundPercent } from '../tools';

// Ik its kinda not standard but major version (1st number) only changed when 'major' (subjective) changes are made to the api (eg. a rewrite of the profile)
// Second number is backwards breaking stuff
// Third is bug fixes
// From now on, it will stay consistent!
export const Version = "1.5.1"

const App: FunctionalComponent = () => {
    if (localStorage.getItem("v")?.split('.').slice(0, 2).join(".") != Version.split('.').slice(0, 2).join(".")) {
        localStorage.removeItem("profile")
        localStorage.setItem("v", Version)
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
    }, [ i, SetI, curProfile, qs, path ])

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

    return (
        <Question key={i} first={i == 0} last={i==(qs.length-1)} question={qs[i]} profile={curProfile} setProfile={changeProfile} changeQ={(up) => {changeQ(i + 1*(up ? 1 : -1), up)}} />
    );
};

export default App;
