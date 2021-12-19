import { FunctionComponent, Fragment } from "preact";
import { useCallback } from "preact/hooks";
import { useState } from "react";
import { useGlobalListener } from "../../../tools";
import { Version } from "../../app";
import { profile } from "../../profile";
import { allQuestions } from "../../questionair";
import CheckboxQuestion from "../QuestionsHandlers/CheckboxQuestion";
import GraphQuestion from "../QuestionsHandlers/GraphQuestion";
import InputQuestion from "../QuestionsHandlers/InputQuestion";
import OrderQuestion from "../QuestionsHandlers/OrderQuestion";
import PieQuestion from "../QuestionsHandlers/PieQuestion";
import RadialQuestion from "../QuestionsHandlers/RadialQuestion";
import SliderQuestion from "../QuestionsHandlers/SliderQuestion";

export enum Direction {
    StandStill,
    GoLeft,
    GoRight,
    FromLeft,
    FromRight,
}


const Question:FunctionComponent<{
    profile: profile,
    question: allQuestions,
    changeQ: (inp:boolean) => void,
    setProfile: (prof: profile, major:keyof profile, sub?:string) => void,
    first: boolean,
    last: boolean,
}> = (({ profile, question, setProfile, first, last, changeQ }) => {
    const [err, setErr] = useState(false)

    const chang = useCallback((up:boolean) => {
        if (up && last) return
        if (!up && first) return
        if (question.type == "input" && up) {
            if (!question.filter(question.values(profile))) {
                setErr(true)
                return
            }
        }
        changeQ(up)
    }, [last, first, changeQ, question, profile])

    useGlobalListener('keydown', (e) => {
        if (e.key == 'ArrowLeft') chang(false)
        else if (e.key == 'ArrowRight') chang(true)
    })

    return <div class={`container`}>
        {
        question.type == "Title" ?
            <Fragment>
                {
                    question.subtitle ?
                        <div class="col" style={{}}>
                            <h1 class="row" style={{marginTop: "26vh"}}>{question.content}</h1>
                            <h2 class="row" style={{marginTop: "3vh", width: "85vw"}}>{question.subtitle}</h2>
                        </div>
                    :
                        <h1 class="row" style={{marginTop: "35vh"}}>{question.content}</h1>
                }
            </Fragment>
        : <Fragment>
            <a class="row" style={{marginTop: "7vh", textDecoration: question.a ? "underline #6F42C2" : "", textUnderlineOffset: "0.3vh"}} href={question.a} target={"_blank"} rel="noreferrer"><h1>{question.question}</h1></a>
            {
                question.type == "input" ? <InputQuestion
                    err={err}
                    setErr={setErr}
                    dataInit={question.values(profile)}
                    inp={(inp) => setProfile(question.parse(inp, profile), question.major, question.sub)}
                />
                : question.type == "pie" ?
                    <PieQuestion inp={
                    (inp:Record<string, unknown>) => {
                        const aliases = question.optionsAndAliases(profile)
                        const reverseAliases = Object.fromEntries(Object.keys(aliases).map((v) => [aliases[v], v]))
                        setProfile(
                            question.parse(
                            Object.fromEntries(Object.keys(inp).map(v => {
                                return [reverseAliases[v], inp[v] as number]
                            })), profile),
                            question.major,
                            question.sub
                    )}}
                    dataInit={(() => {
                        const aliases = question.optionsAndAliases(profile)
                        const values = question.values(profile)
                        return Object.fromEntries(Object.keys(aliases).map((v) => {
                            return [aliases[v], values[v]]
                        }))
                    })()} />
                : question.type == "graph" ?
                    <GraphQuestion labels={question.labels} inp={(ii) => setProfile(question.parse(ii, profile), question.major, question.sub)} dataInit={question.values(profile)} />
                : question.type == "slider" ?
                    <SliderQuestion labels={question.optionsAndAliases(profile)} dataInit={question.values(profile)} inp={(inp) => setProfile(question.parse(inp, profile), question.major, question.sub)} />
                : question.type == "radial" ?
                    <RadialQuestion labels={question.optionsAndAliases(profile)} dataInit={question.values(profile)} inp={(inp) => setProfile(question.parse(inp, profile), question.major, question.sub)} />
                : question.type == "checkbox" ?
                    <CheckboxQuestion labels={question.optionsAndAliases(profile)} dataInit={question.values(profile)} inp={(inp) => setProfile(question.parse(inp, profile), question.major, question.sub)} />
                : question.type == "draggable" ?
                    <OrderQuestion aliases={question.optionsAndAliases(profile)} labels={question.labels} dataInit={question.values(profile)} inp={(inp) => setProfile(question.parse(inp, profile), question.major, question.sub)} />
                : <Fragment />
            }
        </Fragment>
        }
        <div class="row" style={{width: "62vw", justifyContent: "space-between", zIndex: "99", position: "absolute", top: "78vh"}}>
            <button disabled={first} onClick={() => chang(false)} className="col btn btn-p"> Back </button>
            <button disabled={last} onClick={() => chang(true)} className="col btn btn-p"> Next </button>
        </div>
        <h4 style={{
            position: "absolute",
            right: "1vw",
            bottom: "1vh"
        }}>{`V${Version}`}</h4>
    </div>
})

export default Question
