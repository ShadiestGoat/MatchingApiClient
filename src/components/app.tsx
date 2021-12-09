import { FunctionalComponent } from 'preact';
import { useCallback, useState } from 'preact/hooks';
import Question from './QuestionsHandlerMain';
import { defaultProfile, profile } from './profile';
import { allQuestions, question, questions } from './questionair';
import { questionsHere } from './additionalQs';

const App: FunctionalComponent = () => {
    const [curProfile, SetCurProfile] = useState<profile>(JSON.parse(localStorage.getItem("profile") ?? JSON.stringify(defaultProfile)))
    const [i, SetI] = useState<number>(0)

    const path = location.pathname.slice(1)

    if (!Object.keys(questionsHere).includes(path)) {
       throw "Not Acceptable!"
    }

    const qs:allQuestions[] = [...questions, ...(questionsHere[path]), {
        type: "Title",
        content: "Great! I'll be sending this data now...",
        subtitle: "Dw I won't judge you in secret :)"
    }]

    const changeQ = useCallback((inpI:number, goUp:boolean) => {
        if (inpI == qs.length-1) {
            // await axios //TODO: Send data hahhaah
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
    }, [ i, SetI, curProfile, qs ])

    const changeProfile = useCallback((prof:profile) => {
        SetCurProfile(prof)
        localStorage.setItem("profile", JSON.stringify(prof))
    }, [])

    return (
        <Question key={i} first={i == 0} last={i==(qs.length-1)} question={qs[i]} profile={curProfile} setProfile={changeProfile} changeQ={(up) => {changeQ(i + 1*(up ? 1 : -1), up)}} />
    );
};

export default App;
