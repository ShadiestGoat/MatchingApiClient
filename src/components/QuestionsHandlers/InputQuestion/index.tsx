import { Fragment, FunctionComponent } from "preact"
import { useCallback, useState } from "preact/hooks"
import style from "../style.css"
import transStyle from "./style.css"

const InputQuestion:FunctionComponent<{
    dataInit: string,
    inp: (inp:string) => void,
    filt: (inp:string) => boolean
}> = ({ inp, dataInit, filt }) => {
    const [data, setDat] = useState(dataInit)
    const [error, setErr] = useState(false)

    const setData = useCallback((inpu:string) => {
        if (!filt(inpu)) {
            setErr(true)
            return
        }
        setDat(inpu)
        inp(inpu)
    }, [filt, inp])

    return <Fragment>
        <div class={`row`} style={{height: "55vh", width: "100vw", alignItems: "center"}}>
            <input value={data} onInput={(e) => {
                setData((e.target as HTMLInputElement).value)
            }} class={`${style.input} ${error ? transStyle.wrong : ''}`} style={{
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
