import { Fragment, FunctionComponent } from "preact"
import { useCallback, useEffect, useRef, useState } from "preact/hooks"
import { coords, graphQuestion } from "../../questionair"

const GraphQuestion:FunctionComponent<{
    dataInit: coords,
    labels: graphQuestion['labels']
    inp: (inp:coords) => void
}> = ({ inp, dataInit, labels }) => {
    const cnvsRef = useRef<HTMLCanvasElement>(null)
    const [data, setDat] = useState<coords>(dataInit)

    const setData = useCallback((inpu:coords) => {
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
        return de
    }, [])

    const draw = useCallback(() => {
        if (!cnvsRef.current) return
        const canvs = cnvsRef.current
        const ctx = canvs.getContext('2d')
        if (!ctx) return

        const {cX, cY} = getMetaInfo()

        ctx.clearRect(0, 0, canvs.width, canvs.height)

        ctx.strokeStyle = "#ffffff"
        ctx.fillStyle = '#ffffff'

        //
        // Inside lables
        //

        labels.inside.forEach((v) => {
            ctx.save()
            ctx.beginPath()
            ctx.arc(v.location.x*canvs.width, v.location.y*canvs.height, 3, 0, Math.PI * 2)
            let x = v.location.x*canvs.width
            let y = v.location.y*canvs.height - window.innerHeight*0.01
            ctx.textAlign = "center"
            ctx.font = "13pt Mono"
            const measurement = ctx.measureText(v.label)
            if (x - measurement.width/2 <= 0) {
                x = measurement.width*0.6
                y += canvs.height*0.025
            }
            if (x + measurement.width/2 >= canvs.width) {
                x -= measurement.width*0.65
                y += canvs.height*0.025
            }
            if (y - 7 <= 0) {
                y += window.innerHeight*0.03
            }
            ctx.fillText(v.label, x, y)
            ctx.closePath()
            ctx.fill()
            ctx.restore()
        })

        //
        // Dotted lines for 'cursor'
        //
        ctx.strokeStyle = "#959899"
        ctx.setLineDash([5, 10])
        ctx.beginPath()
        ctx.moveTo(data.x + cX, 0)
        ctx.lineTo(data.x + cX, canvs.height)
        ctx.stroke()
        ctx.closePath()

        ctx.beginPath()
        ctx.moveTo(0, data.y + cY)
        ctx.lineTo(canvs.width, data.y + cY)
        ctx.stroke()
        ctx.closePath()
        ctx.setLineDash([])

        ctx.strokeStyle = "#ffffff"

        //
        // AXIS
        //
        ctx.beginPath()
        ctx.moveTo(cX, 0)
        ctx.lineTo(cX, canvs.height)
        ctx.closePath()
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(0, cY)
        ctx.lineTo(canvs.width, cY)
        ctx.closePath()
        ctx.stroke()

        //
        // Lines at the end of Axis
        //
        
        ctx.lineWidth = 3

        ctx.beginPath()
        ctx.moveTo(cX-canvs.width*0.015, 1.5)
        ctx.lineTo(cX+canvs.width*0.015, 1.5)
        ctx.closePath()
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(cX-canvs.width*0.015, canvs.height-1.5)
        ctx.lineTo(cX+canvs.width*0.015, canvs.height-1.5)
        ctx.closePath()
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(1.5, cY-canvs.height*0.015)
        ctx.lineTo(1.5, cY+canvs.height*0.015)
        ctx.closePath()
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(canvs.width-1.5, cY-canvs.height*0.015)
        ctx.lineTo(canvs.width-1.5, cY+canvs.height*0.015)
        ctx.closePath()
        ctx.stroke()

        ctx.lineWidth = 2

        //
        // 'Cursor' position
        //

        ctx.fillStyle = "#1E1E1E"

        ctx.beginPath()
        ctx.arc(data.x * canvs.width, data.y * canvs.width, 10, 0, Math.PI * 2)
        ctx.fill()
        ctx.closePath()

        ctx.fillStyle = "#ffffff"

        ctx.beginPath()
        ctx.arc(data.x * canvs.width, data.y * canvs.width, 6, 0, Math.PI * 2)
        ctx.fill()
        ctx.closePath()

    }, [data, getMetaInfo, labels])

    useEffect(() => {
        draw()
    }, [draw])

    return <Fragment>
        <div class="row" style={{height: "3vh"}}>
            <h3 style={{margin: "0"}}>{labels.outside.top[1]}</h3>
        </div>
        <div class="row" style={{height: "55vh", width: "100vw"}}>
            <div class="col" style={{width: "36%", justifyContent: "space-between", alignItems: "flex-end"}}>
                <h3 class="row">{labels.outside.top[0]}</h3>
                <h3 class="row">{labels.outside.middle[0]}</h3>
                <h3 class="row">{labels.outside.bottom[0]}</h3>
            </div>

        <div style={{
            height: "27vw",
            width: "27vw"
        }}>
            <canvas class="col"
            height={window.innerWidth * 0.27} width={window.innerWidth * 0.27} ref={cnvsRef}
            onClick={(e) => {
                if (e.button) return
                if (!cnvsRef.current) return

                const rect = cnvsRef.current.getBoundingClientRect()
                setData({
                    x: (e.clientX - rect.left)/cnvsRef.current.width,
                    y: (e.clientY - rect.top)/cnvsRef.current.width
                })
            }} onMouseMove={(e) => {
                if (e.buttons !== 1) return
                if (!cnvsRef.current) return

                const rect = cnvsRef.current.getBoundingClientRect()

                setData({
                    x: (e.clientX - rect.left)/cnvsRef.current.width,
                    y: (e.clientY - rect.top)/cnvsRef.current.width
                })
            }}
            />
        </div>
        <div class="col" style={{width: "36%", justifyContent: "space-between", alignItems: "flex-start"}}>
            <h3 class="row">{labels.outside.top[2]}</h3>
            <h3 class="row">{labels.outside.middle[2]}</h3>
            <h3 class="row">{labels.outside.bottom[2]}</h3>
        </div>
        </div>
        <div class="row" style={{height: "3vh"}}>
            <h3 class="row" style={{margin: "0"}}>{labels.outside.bottom[1]}</h3>
        </div>
    </Fragment>
}

export default GraphQuestion
