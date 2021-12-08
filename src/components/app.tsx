import { FunctionalComponent } from 'preact';
import { CSSTransition, StyleTransition, Transition, TransitionGroup } from 'preact-transitioning';
import { useCallback, useState } from 'preact/hooks';
import Question, { Direction } from './QuestionsHandlerMain';
import { defaultProfile, profile } from './profile';
import { question, questions } from './questionair';

const App: FunctionalComponent = () => {
    const [curProfile, SetCurProfile] = useState<profile>(JSON.parse(localStorage.getItem("profile") ?? JSON.stringify(defaultProfile)))
    const [i, SetI] = useState<number>(0)

    const changeQ = useCallback((inpI:number, goUp:boolean) => {
        if (questions[inpI].type == "Title") {
            SetI(inpI)
        } else if ((questions[inpI] as question<any>).skipQuestion(curProfile)) {
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

    const changeProfile = useCallback((prof:profile) => {
        SetCurProfile(prof)
        localStorage.setItem("profile", JSON.stringify(prof))
    }, [])

    return (
        <Question key={i} first={i == 0} last={i==(questions.length-1)} question={questions[i]} profile={curProfile} setProfile={changeProfile} changeQ={(up) => {changeQ(i + 1*(up ? 1 : -1), up)}} />
    );
};

export default App;
