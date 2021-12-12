import { Fragment, FunctionComponent } from "preact"
import { useCallback, useState } from "preact/hooks"
import style from "../style.css"
import transStyle from "./style.css"

const InputQuestion:FunctionComponent<{
    dataInit: string,
    err: boolean,
    inp: (inp:string) => void,
    setErr: (newBol: boolean) => void,
}> = ({ inp, dataInit, err, setErr }) => {
    const [data, setDat] = useState(dataInit)

    console.log(err)

    const setData = useCallback((inpu:string) => {
        setDat(inpu)
        inp(inpu)
    }, [inp])

    return <Fragment>
        <div class={`row`} style={{height: "55vh", width: "100vw", alignItems: "center"}}>
            <input value={data} onInput={(e) => {
                e.stopPropagation()
                setData((e.target as HTMLInputElement).value)
            }} class={`${style.input} ${err ? transStyle.wrong : ''}`} style={{
                height: "15vh",
                width: "30vw",
                fontSize: "100%"
            }} onAnimationEnd={() => {
                setErr(false)
            }} />
        </div>
    </Fragment>
}

export default InputQuestion
