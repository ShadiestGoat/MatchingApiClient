import { FunctionComponent } from "preact"
import { useCallback, useState } from "preact/hooks"
import style from '../RadialQuestion/style.css'

const CheckboxQuestion:FunctionComponent<{
    dataInit: Record<string, boolean>,
    labels: Record<string, string>,
    inp: (inp:Record<string, boolean>) => void,
}> = ({ inp, dataInit, labels }) => {
    const [data, setDat] = useState(dataInit)

    const setData = useCallback((v:Record<string, boolean>) => {
        setDat(v)
        inp(v)
    }, [inp])

    return <div style={{height: "55vh", alignItems: "center", justifyContent: "space-around", width: "75vw"}} class="row">
        {
            Object.keys(labels).map(v => (
                <div key={v} style={{
                    boxShadow: data[v] ? "0 0 25px 3px #6f42c2" : ""
                }} class={style.icon} onClick={() => {
                    const newData = {...data}
                    newData[v] = !newData[v]
                    setData(newData)
                }}>
                    <h4 style={{fontSize: "3.6vh"}}>{labels[v]}</h4>
                </div>
            ))
        }
    </div>
}

export default CheckboxQuestion
