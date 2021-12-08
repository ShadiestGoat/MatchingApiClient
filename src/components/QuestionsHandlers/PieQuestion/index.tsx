import { FunctionComponent } from "preact"
import { useCallback, useEffect, useRef, useState } from "preact/hooks"
import { useGlobalListener } from "../../../tools"
import style from "../style.css"

type data2 = {
    /** 0-1 */
    percent: number,
    /** that actual angle that is used (ie. + previous angles) */
    angle: number,
    label: string,
    /** index (used for angleToUse) */
    i: number,

    collapsed: boolean,
    // angle
    collapsedAt: number
}

const TOT = Math.PI * 2
const BeginRenderAt = 7*Math.PI/4

const PieQuestion:FunctionComponent<{
    dataInit: Record<string, number>,
    inp: (data:Record<string, number>) => void
}> = ({ dataInit, inp }) => {
    const cnvsRef = useRef<HTMLCanvasElement>(null)
    const [target, setTarget] = useState<{i: number} | false>(false)
    const [hoverTarget, setHoverTarget] = useState<number>(-1)

    const normalizeAngle = useCallback((angle:number):number => {
        if (angle < 0) return TOT + angle
        if (angle >= TOT) return normalizeAngle(angle - TOT)
        return Math.round(angle*1000)/1000
    }, [])


    let curAngle = BeginRenderAt
    const total = Object.values(dataInit).reduce((a, b) => a+b)

    const [data, setDat] = useState<data2[]>(
        // .sort((a, b) => dataInit[a] - dataInit[b])
        Object.keys(dataInit).map((v, i) => {
            const trueAngle = TOT*(dataInit[v]/total)
            const ret:data2 = {
                angle: normalizeAngle(curAngle),
                i,
                label: v[0].toUpperCase() + v.slice(1),
                percent: dataInit[v]/total,
                collapsed: false,
                collapsedAt: -1
            }
            curAngle += trueAngle
            return ret
        })
    )


    const setData = useCallback((input: data2[]) => {
        inp(Object.fromEntries(input.map((v) => ([v.label, v.percent]))))
        setDat(input)
    }, [inp])

    const getMetaInfo = useCallback((): {
        cX: number,
        cY: number,
        gR: number
    } => {
        const de = {
            cX: 0,
            cY: 0,
            gR: 0
        }
        if (!cnvsRef.current) return de
        de.cX = ~~(cnvsRef.current.width /2)
        de.cY = ~~(cnvsRef.current.height/2)
        de.gR = 0.9 * Math.min(de.cX, de.cY)
        return de
    }, [])

    const draw = useCallback(() => {
        if (!cnvsRef.current) return
        const canvs = cnvsRef.current
        const ctx = canvs.getContext('2d')
        if (!ctx) throw "WHAT???"

        const {cX, cY, gR} = getMetaInfo()

        ctx.clearRect(0, 0, canvs.width, canvs.height)
        ctx.beginPath()
        ctx.arc(cX, cY, gR, 0, Math.PI * 2)
        ctx.strokeStyle = "#ffffff"
        ctx.fillStyle = '#ffffff'
        ctx.stroke()
        ctx.closePath()

        // let curAngle = BeginRenderAt

        data.forEach(({ collapsed, angle, label, i, percent }) => {
            if (collapsed || percent === 0) return
            // const angleStart =z
            const x = gR * Math.cos(angle)
            const y = gR * Math.sin(angle)
            ctx.save()
            ctx.translate(cX, cY);
            ctx.fillStyle = '#ffffff';
            ctx.strokeStyle = '#ffffff'
            ctx.beginPath();
            ctx.arc(x, y, hoverTarget == i ? 7 : 5, 0, TOT, false);
            ctx.closePath()
            ctx.fill();
            ctx.stroke();

            ctx.beginPath()
            ctx.moveTo(0, 0)
            ctx.lineTo(x, y)
            ctx.closePath()
            ctx.stroke()

            const fontSize = ~~(ctx.canvas.height/32)
            const dx = gR - fontSize;
            const dy = cY / 10;
            ctx.rotate(angle);

            ctx.textAlign = "right";
            ctx.font = `${fontSize  }pt Helvetica`;
            ctx.fillText(label, dx, dy);

            ctx.restore();
            // curAngle += percent * Math.PI * 2
        })

    }, [data, hoverTarget, getMetaInfo])

    const getTarget = useCallback((x:number, y:number):number | false => {
        if (data.length == 0) return false

        const { cY, cX } = getMetaInfo()

        let distance = 999
        let index = -1
        // const starters = [] as number[]

        const trueGrabbedAngle = Math.atan2(
            y - cY,
            x - cX
        )

        data.forEach(({i, collapsed, angle}) => {
            const curDist = Math.abs(Math.atan2(Math.sin(trueGrabbedAngle - angle), Math.cos(trueGrabbedAngle - angle)))
            if (!collapsed) {
                if (curDist < distance) {
                    distance = curDist
                    index = i
                }
            }
        })
        if (distance < 0.1) return index


        return false
    }, [data, getMetaInfo])

    const touchStart = useCallback((x:number, y:number) => {
        const trgt = getTarget(x, y)
        if (trgt === false) setTarget(false)
        else setTarget({i: trgt})
        if (target) setHoverTarget(target.i)
    }, [setTarget, getTarget, setHoverTarget, target])

    const touchEnd = useCallback(() => {
        if (target) {
            setTarget(false)
            setHoverTarget(-1)
        }
    }, [target, setTarget, setHoverTarget])

    /**
     * Shift the target angle to a new location.
     */
    const shiftSelectedAngle = useCallback((newAngle:number) => {
        if (target === false) return
        const trgt = target.i
        newAngle = normalizeAngle(newAngle)
        const newData = [...data]

        let normalVisble = data.filter(k => !k.collapsed || k.i == trgt)
        let visible = [...normalVisble, ...normalVisble, ...normalVisble]
        /** data index : visible index */
        let visibleMp = Object.fromEntries(normalVisble.map((v, i) => [v.i, i + normalVisble.length])) as Record<number, number>


        let nextSegment = visible[visibleMp[trgt] + 1]
        let previousSegment = visible[visibleMp[trgt] - 1]

        let nextAngle = normalizeAngle(nextSegment.angle - newAngle)
        let prevAngle = normalizeAngle(newAngle - previousSegment.angle)

        function generateVisible() {
            if (trgt === null) return
            normalVisble = newData.filter(k => !k.collapsed || (k.i == trgt && true))
            visible = [...normalVisble, ...normalVisble, ...normalVisble]
            /** data index : visible index */
            visibleMp = Object.fromEntries(normalVisble.map((v, i) => [v.i, i + normalVisble.length])) as Record<number, number>

            nextSegment = visible[visibleMp[trgt] + 1]
            previousSegment = visible[visibleMp[trgt] - 1]

            if (newData[trgt].collapsed) {
                nextAngle = 0
                prevAngle = normalizeAngle(nextSegment.angle - previousSegment.angle)
            } else {
                nextAngle = normalizeAngle(nextSegment.angle - newAngle)
                prevAngle = normalizeAngle(newAngle - previousSegment.angle)
            }
        }


        if (normalVisble.length == 1) {
            newData[trgt].angle = newAngle
            data[trgt].percent = 1
        } else {
            const tooClose = 0.1
            newData[trgt].angle = newAngle
            // this feels wrong to me
            const betweem = previousSegment.angle > nextSegment.angle ?
                !(previousSegment.angle < newAngle || newAngle < nextSegment.angle)
                : previousSegment.angle > newAngle || newAngle > nextSegment.angle

            if (nextAngle < tooClose || (betweem && normalVisble.length > 2)) {
                newData[trgt].collapsed = true
                newData[trgt].percent = 0
                newData[trgt].collapsedAt = nextAngle
            } else if (prevAngle < tooClose || false) {
                newData[trgt].collapsed = true
                newData[trgt].percent = 0
                newData[trgt].collapsedAt = prevAngle
            } else if (data[trgt].collapsed && (normalizeAngle(data[trgt].collapsedAt - newAngle) > tooClose)) {
                newData[trgt].collapsed = false
                newData[trgt].collapsedAt = -1
            }

            generateVisible()
            if (newData.filter((k) => !k.collapsed).length == 1) {
                newData[previousSegment.i].percent = 1
            } else {
                newData[trgt].percent = nextAngle/TOT
                newData[previousSegment.i].percent = prevAngle/TOT
            }
        }
        setData(newData)
    }, [data, target, normalizeAngle, setData])

    const touchMove = useCallback((x:number, y:number) => {
        if (!target) {
            const curHover = getTarget(x, y)
            if (curHover !== false)
                setHoverTarget(curHover)
            else if (hoverTarget != -1)
                setHoverTarget(-1)
            return
        }
        const { cX, cY } = getMetaInfo()
        const ctx = cnvsRef.current?.getContext('2d')
        if (!ctx) return

        const angle = Math.atan2(y - cY, x - cX)
        shiftSelectedAngle(angle)
    }, [shiftSelectedAngle, getMetaInfo, target, getTarget, hoverTarget])

    useEffect(() => {
        draw()
    }, [ draw ])

    useGlobalListener('mousemove', (e) => {
        if (!cnvsRef.current) return
        const rect = cnvsRef.current.getBoundingClientRect()
        touchMove(e.clientX - rect.left, e.clientY - rect.top)
    })
    useGlobalListener('mousedown', (e) => {
        if (!cnvsRef.current) return
        const rect = cnvsRef.current.getBoundingClientRect()
        touchStart(e.clientX - rect.left, e.clientY - rect.top)
    })
    useGlobalListener('mouseup', touchEnd)

    /**
     * @param i - Number
     *
     * @param newPercent - 0-1
     */
    const shiftAngleByPercent = useCallback((i:number, newPercent: number) => {
        if (newPercent == data[i].percent) return


        const normalVisble = data.filter(k => !k.collapsed || k.i == i)
        const mapVisible = Object.fromEntries(normalVisble.map((v, i2) => [v.i, i2]))

        const newAngle = normalizeAngle((data[i].collapsed ? -[...normalVisble, ...normalVisble, ...normalVisble][mapVisible[i] - 1].angle : data[i].angle) - (newPercent-data[i].percent)*TOT)
        const newData = JSON.parse(JSON.stringify(data)) as data2[]
        /** data index : visible index */

        // function generateVisible() {
        //     if (i === null) return
        //     normalVisble = newData.filter(k => !k.collapsed || k.i == i)
        //     mapVisible = Object.fromEntries(normalVisble.map((v, i2) => [v.i, i2]))
        // }

        if (newData[i].collapsed) {
            [...normalVisble, ...normalVisble, ...normalVisble][mapVisible[i] + 1]
        }

        if (normalVisble.length == 1) {
                newData[i].angle = newAngle
                newData[i].percent = 1
        } else {
            newData[i].angle = newAngle
            newData[i].percent = newPercent
            if (newData[i].collapsed) newData[i].collapsed = false

            let percentLeft = Math.abs(data[i].percent - newPercent)

            const direction = data[i].percent > newPercent ? 1 : -1

            ;[  ...newData.filter(({collapsed}, i2) => i2 > i && !collapsed),
                ...newData.filter(({collapsed}, i2) => i2 < i && !collapsed)]
            .reverse().forEach((v) => {
                if (percentLeft == 0) return
                if (v.percent <= percentLeft && direction == -1) {
                    v.collapsed = true
                    v.collapsedAt = newAngle
                    percentLeft -= v.percent
                    v.percent = 0
                } else {
                    v.percent += percentLeft * direction
                    percentLeft = 0
                }

                newData[v.i] = v
            })
            // generateVisible()
        }

        setData(newData)
        setTarget(false)
    }, [data, normalizeAngle, setData])

    return <div class="row" style={{height: "55vh", width: "100vw", marginTop: "3vh"}}>
        <div class="col" style={{width: "21.5%", justifyContent: "space-around"}}>
            {
                data.map((v, i) => {
                    if ((i%2) == 0) return
                    return <label key={v.label} class="row">
                        <div class="col" style={{alignItems: "center", marginTop: "5%"}}>
                            <h2 class="row" style={{width: "100%"}}>{v.label}</h2>
                            <input class={`row ${style.input}`} style={{width: "70%"}} value={`${Math.round(v.percent * 10000)/100}`} onChange={(e) => {
                                e.stopPropagation()
                                const targ = e.target as HTMLInputElement
                                shiftAngleByPercent(v.i, parseFloat(targ.value) <= 0 ? 0 : parseFloat(targ.value) >= 100 ? 1 : Math.round(parseFloat(targ.value)*100)/10000)
                            }} />
                        </div>
                    </label>
                })
            }
        </div>
        <canvas class="col"
        height={window.innerWidth/100 * 27} width={window.innerWidth/100 * 27} ref={cnvsRef} />
    <div class="col" style={{width: "21.5%", justifyContent: "space-around"}}>
            {
                data.map((v, i) => {
                    if ((i%2) != 0) return
                    return <label key={v.label} class="row">
                        <div class="col" style={{alignItems: "center", marginTop: "5%"}}>
                            <h2 class="row" style={{width: "100%"}}>{v.label}</h2>
                            <input class={`row ${style.input}`} style={{width: "70%"}} value={`${Math.round(v.percent * 10000)/100}`} onChange={(e) => {
                                const targ = e.target as HTMLInputElement
                                shiftAngleByPercent(v.i, parseFloat(targ.value) <= 0 ? 0 : parseFloat(targ.value) >= 100 ? 1 : Math.round(parseFloat(targ.value)*100)/10000)
                            }} />
                        </div>
                    </label>
                })
            }
    </div>
    </div>
}

export default PieQuestion
