import { FunctionComponent, Fragment } from "preact";
import { useCallback } from "preact/hooks";
import { useGlobalListener } from "../../tools";
import { profile } from "../profile";
import { allQuestions } from "../questionair";
import GraphQuestion from "../QuestionsHandlers/GraphQuestion";
import PieQuestion from "../QuestionsHandlers/PieQuestion";
import SliderQuestion from "../QuestionsHandlers/SliderQuestion";

// const SliderQuestion:FunctionComponent<{
//     dataInit: Record<string, number>,
//     labels: Record<string, {
//         /** % of the location */
//         location: number,
//         label: string
//     }[]>,
//     inp: (inp:Record<string, number>) => void
// }> = ({ inp, dataInit, labels }) => {
// }

const Question:FunctionComponent<{
    profile: profile,
    question: allQuestions,
    changeQ: (inp:boolean) => void,
    setProfile: (prof: profile) => void,
    first: boolean,
    last: boolean,
    // index: number
}> = (({ profile, question, setProfile, first, last, changeQ }) => {
    const chang = useCallback((up:boolean) => {
        if (up && last) return
        if (!up && first) return
        changeQ(up)
    }, [changeQ, last, first])

    useGlobalListener('keydown', (e) => {
        if (e.key == 'ArrowLeft') chang(false)
        else if (e.key == 'ArrowRight') chang(true)
    })

    return <Fragment>
        {
        question.type == "Title" ?
            <Fragment>
                {
                    question.subtitle ?
                        <div class="col" style={{}}>
                            <h1 class="row" style={{marginTop: "26vh"}}>{question.content}</h1>
                            <h2 class="row" style={{marginTop: "3vh"}}>{question.subtitle}</h2>
                        </div>
                    :
                        <h1 class="row" style={{marginTop: "35vh"}}>{question.content}</h1>
                }
            </Fragment>
        : <Fragment>
            <h1 class="row" style={{marginTop: "7vh"}}>{question.question}</h1>
            {
                question.type == "input" ? <Fragment />
                : question.type == "pie" ?
                    <PieQuestion inp={
                    (inp:Record<string, unknown>) => {
                        const aliases = question.optionsAndAliases(profile)
                        const reverseAliases = Object.fromEntries(Object.keys(aliases).map((v) => [aliases[v], v]))
                        setProfile(
                            question.parse(
                            Object.fromEntries(Object.keys(inp).map(v => {
                                return [reverseAliases[v], Math.round((inp[v] as number)*10000)/10000]
                            })), profile)
                    )}}
                    dataInit={(() => {
                        const aliases = question.optionsAndAliases(profile)
                        const values = question.values(profile)
                        return Object.fromEntries(Object.keys(aliases).map((v) => {
                            return [aliases[v], values[v]]
                        }))
                    })()} />
                : question.type == "graph" ?
                    <GraphQuestion labels={question.labels} inp={(ii) => setProfile(question.parse(ii, profile))} dataInit={question.values(profile)} />
                    : question.type == "slider" ?
                    <SliderQuestion labels={question.optionsAndAliases(profile)} dataInit={question.values(profile)} inp={(inp) => setProfile(question.parse(inp, profile))} />
                    : <Fragment />
            }
        </Fragment>
        }

        <div class="row" style={{width: "62vw", justifyContent: "space-between", zIndex: "99", position: "absolute", top: "78vh"}}>
            <button disabled={first} onClick={() => chang(false)} className="col btn btn-p"> Back </button>
            <button disabled={last} onClick={() => chang(true)} className="col btn btn-p"> Next </button>
        </div>
    </Fragment>
})

export default Question
