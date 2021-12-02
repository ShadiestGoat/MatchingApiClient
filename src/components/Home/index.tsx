import { FunctionComponent, Fragment } from "preact";
import { useCallback, useMemo, useRef, useEffect, useState } from "preact/hooks";
import { useGlobalListener } from "../../tools";
import { profile, quest } from "../app";

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

const NewGraph:FunctionComponent<{
    dataInit: Record<string, number>
}> = ({ dataInit }) => {
    const cnvsRef = useRef<HTMLCanvasElement>(null)
    const [target, setTarget] = useState<{i: number} | false>(false)
    const [hoverTarget, setHoverTarget] = useState<number>(-1)

    const normalizeAngle = useCallback((angle:number):number => {
        if (angle < 0) return TOT + angle
        if (angle >= TOT) return normalizeAngle(angle - TOT)
        return angle
    }, [])

    const [data, setData] = useState<data2[]>(useMemo(():data2[] => {
        let curAngle = BeginRenderAt
        const total = Object.values(dataInit).reduce((a, b) => a+b)
        return Object.keys(dataInit).sort((a, b) => dataInit[a] - dataInit[b]).map((v, i) => {
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
    }, [dataInit, normalizeAngle]))

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

        data.forEach(({ collapsed, angle, label, i,  }) => {
            if (collapsed) return
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

            const fontSize = ~~(ctx.canvas.height/25)
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

        data.forEach(({i, collapsed, angle}) => {
            if (!collapsed) {
                const trueGrabbedAngle = Math.atan2(
                    y - cY,
                    x - cX
                )
                const curDist = Math.abs(Math.atan2(Math.sin(trueGrabbedAngle - angle), Math.cos(trueGrabbedAngle - angle)))
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
            console.log(newAngle)
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
    }, [data, target, normalizeAngle])

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

    const drawAtAngle = useCallback((angle:number) => {
        const ctx = cnvsRef.current?.getContext('2d')
        if (!ctx) return
        const { cX, cY, gR } = getMetaInfo()

        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#ffffff'
        ctx.beginPath();
        ctx.arc(Math.cos(angle) * gR + cX, Math.sin(angle) * gR + cY, 6, 0, TOT, false);
        ctx.closePath()
        ctx.fill();
        ctx.stroke();

    }, [getMetaInfo])

    /**
     * @param i - Number
     *
     * @param newPercent - 0-1
     */
    const shiftAngleByPercent = useCallback((i:number, newPercent: number) => {
        if (newPercent == data[i].percent) return
        const newAngle = normalizeAngle(data[i].angle - newPercent*TOT)
        const newData = JSON.parse(JSON.stringify(data)) as data2[]

        let normalVisble = data.filter(k => !k.collapsed || k.i == i)
        let visible = [...normalVisble, ...normalVisble, ...normalVisble]
        /** data index : visible index */
        let visibleMp = Object.fromEntries(normalVisble.map((v, i2) => [v.i, i2 + normalVisble.length])) as Record<number, number>

        let nextSegment = visible[visibleMp[i] + 1]
        let previousSegment = visible[visibleMp[i] - 1]

        let nextAngle = normalizeAngle(nextSegment.angle - newAngle)
        let prevAngle = normalizeAngle(newAngle - previousSegment.angle)

        function generateVisible() {
            if (i === null) return
            normalVisble = newData.filter(k => !k.collapsed || k.i == i)
            console.log(newData)
            visible = [...normalVisble, ...normalVisble, ...normalVisble]
            /** data index : visible index */
            visibleMp = Object.fromEntries(normalVisble.map((v, i2) => [v.i, i2 + normalVisble.length])) as Record<number, number>
            console.log(normalVisble)
            console.log(visibleMp, i)
            nextSegment = visible[visibleMp[i] + 1]
            previousSegment = visible[visibleMp[i] - 1]

            if (newData[i].collapsed) {
                nextAngle = 0
                prevAngle = normalizeAngle(nextSegment.angle - previousSegment.angle)
            } else {
                nextAngle = normalizeAngle(nextSegment.angle - newAngle)
                prevAngle = normalizeAngle(newAngle - previousSegment.angle)
            }
        }

        drawAtAngle(newAngle)


        if (normalVisble.length == 1) {
            newData[i].angle = newAngle
            newData[i].percent = 1
        } else {
            newData[i].angle = newAngle
            newData[i].percent = newPercent
            if (newData[i].collapsed) newData[i].collapsed = false

            // this feels wrong to me
            // TODO: if it interacts w/ another one, it fucking consumes it
            let percentLeft = Math.abs(data[i].percent - newPercent)

            const direction = data[i].percent > newPercent ? 1 : -1

            // console.log([  ...newData.filter(({collapsed}, i2) => i2 < i && !collapsed),
            //     ...newData.filter(({collapsed}, i2) => i2 > i && !collapsed)]
            // .reverse())

            ;[  ...newData.filter(({collapsed}, i2) => i2 < i && !collapsed),
                ...newData.filter(({collapsed}, i2) => i2 > i && !collapsed)]
            .reverse().forEach((v) => {
                if (percentLeft == 0) return
                // console.log(v.i, Math.floor(v.percent*10000)/100, Math.floor(percentLeft*10000)/100)
                if (v.percent <= percentLeft) {
                    v.collapsed = true
                    v.collapsedAt = newAngle //TODO: move ever other collapsed at in case of un collapsing! (in case of i)
                    percentLeft -= v.percent
                    v.percent = 0
                } else {
                    // End
                    console.log("Left B:", percentLeft)
                    console.log("%    B:", v.percent)
                    v.percent += percentLeft * direction
                    percentLeft = 0
                    console.log("Left A:", percentLeft)
                    console.log("%    A:", v.percent)
                    console.log('-------------------------')
                    v.angle += percentLeft * direction * TOT
                }

                newData[v.i] = v
            })

            generateVisible()

            // if (newData.filter((k) => !k.collapsed).length == 1) {
            //     newData[i].percent = 1
            // } else {
            //     newData[i].percent = nextAngle/TOT
            //     // newData[previousSegment.i].percent = prevAngle/TOT
            // }
        }
        setData(newData)
        setTarget(false)
    }, [data, normalizeAngle, drawAtAngle])

    return <div class="row" style={{height: "55vh", width: "100vw", marginTop: "3vh"}}>
    <div class="col" style={{width: "21.5%"}}>
        {
            data.map((v, i) => {
                return <div key={v.label} class="row">
                    <h2 class="col" style={{width: "50%"}}>{v.label}</h2>
                    <input class="col" style={{width: "50%"}} value={`${Math.floor(v.percent * 10000)/100}`} onChange={(e) => {
                        const targ = e.target as HTMLInputElement
                        shiftAngleByPercent(i, parseFloat(targ.value) <= 0 ? 0 : parseFloat(targ.value) >= 100 ? 1 : Math.floor(parseFloat(targ.value)*100)/10000)
                    }} />
                </div>
            })
        }
        </div>
        <canvas class="col"
        height={window.innerWidth/100 * 26} width={window.innerWidth/100 * 26} ref={cnvsRef} />
    <div class="col" style={{width: "21.5%"}}>
        .
    </div>
    </div>
}

const Question:FunctionComponent<{
    profile: profile,
    question: quest,
    changeQ: (inp:boolean) => void,
    setProfile: (prof: profile) => void,
    first: boolean,
    last: boolean,
}> = (({ profile, question, setProfile, first, last, changeQ }) => {

    // const [contentS, setContentS] = useState<string>("")
    // const [content, setContent] = useState<Record<string, unknown>>({})

    const chang = useCallback((up:boolean) => {
        if (up && last) return
        if (!up && first) return
        setProfile(question.parse("", profile))
        changeQ(up)
    }, [changeQ, setProfile, last, first, profile, question])

    useGlobalListener('keydown', (e) => {
        if (e.key == 'ArrowLeft') chang(false)
        else if (e.key == 'ArrowRight') chang(true)
    })

    let inp = <Fragment />
    switch(question.answerType) {
        case "pie":
            inp = <NewGraph dataInit={{
                One: 0.25,
                Two: 0.125,
                Threek: 2,
                Four: 0.5
            }} />

            break
    }

    return <Fragment>
        <h1 class="row" style={{marginTop: "10vh"}}>{question.question}</h1>
        {inp}
        <div class="row" style={{marginTop: "5vh", width: "62vw", justifyContent: "space-between"}}>
            <button disabled={first} onClick={() => chang(false)} className="col btn btn-p"> Back </button>
            <button disabled={last} onClick={() => chang(true)} className="col btn btn-p"> Next </button>
        </div>
    </Fragment>
})

export default Question
