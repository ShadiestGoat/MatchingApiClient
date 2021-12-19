import { Fragment, FunctionComponent } from "preact"
import { useCallback, useState } from "preact/hooks"
import { sliderQuestion } from "../../questionair"
import style from "./style.css"

const SliderQuestion:FunctionComponent<{
    dataInit: Record<string, number>,
    labels: ReturnType<sliderQuestion<string>['optionsAndAliases']>
    inp: (inp:Record<string, number>) => void
}> = ({ inp, dataInit, labels }) => {
    const keys = Object.keys(labels)

    const [data, setDat] = useState(Object.fromEntries(keys.map(k => [k, dataInit[k]])))


    const setData = useCallback((inpu:Record<string, number>) => {
        setDat(inpu)
        inp(inpu)
    }, [inp])
    return <Fragment>
        <div class="row" style={{height: "55vh", width: "100vw"}}>
            <div class="col" style={{width: "60%", justifyContent: "space-evenly", alignItems: "flex-end"}}>
                {
                    keys.map(k => <div class="row" key={k} style={{
                        width: "100%"
                    }}>
                            <div class="col" style={{width: "20%", justifyContent: "center"}}>
                                <h3 style={{margin: "0"}}>{labels[k].outside[0]}</h3>
                            </div>
                            <div class="col" style={{width: "55%", justifyContent: "center"}}>
                                <input class={style.slider} type="range" value={data[k]*100}  onInput={(e) => {
                                    const newData = {...data}
                                    newData[k] = parseInt((e.target as HTMLInputElement).value, 10)/100
                                    setData(newData)
                                }} />
                            </div>
                            <div class="col" style={{width: "20%", justifyContent: "center"}}>
                                <h3 style={{margin: "0"}}>{labels[k].outside[1]}</h3>
                            </div>
                        </div>
                    )
                }
            </div>
            {/* <div style={{
                height: "27vw",
                width: "27vw"
            }}>
                <canvas class="col" height={window.innerWidth * 0.27} width={window.innerWidth * 0.27} ref={cnvsRef}
                    onClick={(e) => {
                        const canvs = cnvsRef.current
                        if (!canvs) return
                        const ctx = canvs.getContext('2d')
                        if (!ctx) return
                        const rect = canvs.getBoundingClientRect()
                        const x = e.clientX - rect.left
                        const y = e.clientY - rect.top

                        const newData = {...data}
                        let newPercent = 0

                        if (x < canvs.width*marginPercnt) newPercent = 0
                        else if (x > canvs.width*(1-marginPercnt)) newPercent = 1
                        else newPercent = (x-canvs.width*marginPercnt)/(canvs.width*(1-marginPercnt*2))

                        const closest = getTarget(y)

                        const hvr = closest.distance < canvs.height*0.2 ? closest.key : target ? target : ""
                        if (!hvr) return

                        newData[hvr] = newPercent

                        setData(newData)
                        setTarget("")
                        setHoverTarget(hvr)
                    }}
                />
            </div>
        <div class="col" style={{width: "36%", justifyContent: "space-evenly", alignItems: "flex-start"}}>
            {
                keys.map(k =>
                    <h3 key={k} class="row">{labels[k].outside[1]}</h3>
                )
            }
        </div> */}
        </div>
    </Fragment>
}

export default SliderQuestion
