import { FunctionComponent } from "preact"
import { useCallback, useState } from "preact/hooks"
import style from './style.css'

const RadialQuestion:FunctionComponent<{
    dataInit: string,
    labels: Record<string, string>,
    inp: (inp:string) => void,
}> = ({ inp, dataInit, labels }) => {
    const [data, setDat] = useState(dataInit)

    const setData = useCallback((v:string) => {
        setDat(v)
        inp(v)
    }, [inp])

    const rawLabels = Object.keys(labels)
    const rows = [] as string[][]

    let curRow = [] as string[]
    for (let i = 0; i < rawLabels.length; i++) {
        curRow.push(rawLabels[i])
        if (curRow.length == 5) {
            rows.push(curRow)
            curRow = []
        }
    }
    if (curRow.length != 0) rows.push(curRow)

    console.log(rows)

    return <div style={{height: "55vh", alignItems: "center", justifyContent: "space-around", width: "75vw"}} class="row">
        <div class="col" style={{width: "100%", height: "100%"}}>
            {
                rows.map((row) => (
                    <div key={row.join(',')} style={{height: "55vh", alignItems: "center", justifyContent: "space-around", width: "75vw"}} class="row">
                        {row.map((ico) => (
                            <div key={ico} style={{
                                boxShadow: data === ico ? "0 0 25px 3px #6f42c2" : ""
                            }} class={style.icon} onClick={() => setData(ico)}>
                                <h4 style={{fontSize: "3.6vh"}}>{labels[ico]}</h4>
                            </div>
                        ))}
                    </div>
                ))
            }
        </div>
    </div>
}

export default RadialQuestion
