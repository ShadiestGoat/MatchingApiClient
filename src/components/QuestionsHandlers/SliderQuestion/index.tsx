import { Fragment, FunctionComponent } from "preact"
import { useCallback, useEffect, useRef, useState } from "preact/hooks"
import { useGlobalListener } from "../../../tools"
import { sliderQuestion } from "../../questionair"

const SliderQuestion:FunctionComponent<{
    dataInit: Record<string, number>,
    labels: ReturnType<sliderQuestion<string>['optionsAndAliases']>
    inp: (inp:Record<string, number>) => void
}> = ({ inp, dataInit, labels }) => {

    const cnvsRef = useRef<HTMLCanvasElement>(null)

    const [target, setTarget] = useState("")
    const [hoverTarget, setHoverTarget] = useState("")

    const keys = Object.keys(labels)
    const marginPercnt = 0.045
    const factor = (1-marginPercnt)/1
    const heightSliderP = 0.025
    const offsetP = (1-keys.length*heightSliderP)/(keys.length + 1)
    const formats = Object.fromEntries(keys.map((k, i) => [k, heightSliderP*(i+0.5)+offsetP*(i+1)]))

    const [data, setDat] = useState(Object.fromEntries(keys.map(k => [k, dataInit[k]])))


    const setData = useCallback((inpu:Record<string, number>) => {
        setDat(inpu)
        inp(inpu)
    }, [inp])

    const getMetaInfo = useCallback((): {
        cX: number,
        cY: number,
    } => {
        const de = {
            cX: 0,
            cY: 0,
        }
        if (!cnvsRef.current) return de
        de.cX = ~~(cnvsRef.current.width /2)
        de.cY = ~~(cnvsRef.current.height/2)
        // de.gR = 0.9 * Math.min(de.cX, de.cY)
        return de
    }, [])

    const draw = useCallback(() => {
        if (!cnvsRef.current) return
        const canvs = cnvsRef.current
        const ctx = canvs.getContext('2d')
        if (!ctx) return

        ctx.clearRect(0, 0, canvs.width, canvs.height)

        ctx.strokeStyle = "#ffffff"
        ctx.fillStyle = '#ffffff'

        ctx.lineWidth = ~~(canvs.height*0.02)

        ctx.lineCap = "round"

        ctx.lineWidth = heightSliderP * canvs.height

        keys.forEach((v, i) => {
            const y = heightSliderP*(canvs.height*i+0.5*canvs.height)+canvs.height*offsetP*(i+1)
            ctx.save()
            ctx.beginPath()
            ctx.lineCap = "round"
            ctx.moveTo(canvs.width*marginPercnt, y)
            ctx.lineTo(canvs.width*(1-marginPercnt), y)
            ctx.stroke()
            ctx.closePath()

            ctx.fillStyle = "#1E1E1E"
            ctx.beginPath()
            ctx.arc(canvs.width*marginPercnt + data[v]*canvs.width*(1-marginPercnt)*factor, y, hoverTarget == v || target == v ? 15 : 13, 0, Math.PI * 2)
            ctx.fill()
            ctx.closePath()

            ctx.fillStyle = "#ffffff"
            ctx.beginPath()
            ctx.arc(canvs.width*marginPercnt + data[v]*canvs.width*(1-marginPercnt)*factor, y, hoverTarget == v || target == v ? 10 : 8, 0, Math.PI * 2)
            ctx.fill()
            ctx.closePath()
        })

    }, [data, factor, keys, offsetP, hoverTarget, target])

    useEffect(() => {
        draw()
    }, [draw])

    const getTarget = useCallback((y:number) => {
        const canvs = cnvsRef.current
        if (!canvs) return {key: "", distance: 99999}

        const closest = {
            key: "",
            distance: 99999
        }

        keys.forEach(k => {
            const dist = Math.abs(formats[k]*canvs.height - y )
            if (closest.distance > dist) {
                closest.key = k
                closest.distance = dist
            }
        })

        return closest
    }, [getMetaInfo, formats, keys])

    useGlobalListener('mousemove', (e) => {
        const canvs = cnvsRef.current
        if (!canvs) return

        const rect = canvs.getBoundingClientRect()

        const y = e.clientY - rect.top
        const x = e.clientX - rect.left

        const ctx = canvs.getContext('2d')
        if (!ctx) return

        const closest = getTarget(y)

        const hvr = closest.distance < canvs.height*0.2 ? closest.key : target ? target : ""

        if (!target) {
            if (e.buttons !== 1) {
                setHoverTarget(hvr)
                return
            }
        }

        if (!hvr) return

        const newData = {...data}

        let newPercent = 0

        if (x < canvs.width*marginPercnt) newPercent = 0
        else if (x > canvs.width*(1-marginPercnt)) newPercent = 1
        else
        newPercent = (x-canvs.width*marginPercnt)/(canvs.width*(1-marginPercnt*2))

        newData[hvr] = newPercent

        setData(newData)
        setTarget(hvr)
        setHoverTarget("")
    })

    useGlobalListener('mouseup', (e) => {
        const oldTarget = target
        setTarget("")
        setHoverTarget(oldTarget)
    })

    return <Fragment>
        {/* <div class="row" style={{height: "3vh"}}>
            <h3 style={{margin: "0"}}>{labels.outside.top[1]}</h3>
        </div> */}
        <div class="row" style={{height: "55vh", width: "100vw"}}>
            <div class="col" style={{width: "36%", justifyContent: "space-evenly", alignItems: "flex-end"}}>
                {
                    keys.map(k =>
                        <h3 key={k} class="row">{labels[k].outside[0]}</h3>
                    )
                }
            </div>
            <canvas class="col" height={window.innerWidth/100 * 27} width={window.innerWidth/100 * 27} ref={cnvsRef}
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
                setHoverTarget("")

            }} />
        <div class="col" style={{width: "36%", justifyContent: "space-evenly", alignItems: "flex-start"}}>
            {
                keys.map(k =>
                    <h3 key={k} class="row">{labels[k].outside[1]}</h3>
                )
            }
        </div>
        </div>
    </Fragment>
}

export default SliderQuestion
