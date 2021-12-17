import { FunctionComponent } from "preact";
import { useCallback } from "preact/hooks";
import { JSXInternal } from "preact/src/jsx";
import { ReactElement, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useGlobalListener } from "../../../tools";

const OrderQuestion:FunctionComponent<{
    dataInit: (string | number)[],
    labels: string[],
    aliases: Record<string | number, string>,
    inp: (inp:(string | number)[]) => void,
}> = ({dataInit, inp, labels, aliases}) => {
    const reverseEnum = Object.fromEntries(Object.keys(aliases).map(v => [aliases[v], v]))
    const [height, setHeight] = useState((window.innerHeight*0.53)/dataInit.length)

    useGlobalListener("resize", () => {
        setHeight((window.innerHeight*0.53)/dataInit.length)
    })

    const [data, setDat] = useState<(string | number)[]>(dataInit.map(v => aliases[v]))

    const setData = useCallback((v: (string | number)[]) => {
        const newV = [...v]
        setDat(v)
        inp(newV.map(v => reverseEnum[v]))
    }, [inp, reverseEnum])

    return <div class="row" style={{width: "100%", height: "58vh", marginTop: "1vh"}}>
        <div class="col" style={{justifyContent: "space-between", width: "27%", alignItems: "flex-end"}}>
            {
                labels.map((v) => (
                    <h2 key={`${v}-1`} style={{display: "flex"}}>{v}</h2>
                ))
            }
        </div>

        <DragDropContext onDragEnd={(res) => {
            if (!res.destination) return
            const newData = [...data]
            const [ tmp ] = newData.splice(res.source.index, 1)
            newData.splice(res.destination.index, 0, tmp)
            setData(newData)
            return
        }}>
            <Droppable droppableId="main-list">
                {
                    (provided) => (
                        <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                            width: "35%",
                            height: "53vh",
                            borderRadius: "25px",
                            marginTop: "3vh",
                            border: "solid gray 2px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-evenly",
                        }}>
                            {
                                data.map((v, i) => (
                                    // @ts-ignore
                                    <Draggable key={v} index={i} draggableId={v}>
                                        {
                                            (provided,) => {
                                                // @ts-ignore
                                                return <div
                                                    ref={provided.innerRef}
                                                    {...Object.assign({...provided.draggableProps}, {...provided.dragHandleProps})}
                                                    style={Object.assign(provided.draggableProps.style, {
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        display: "flex",
                                                        height,

                                                    }) as JSXInternal.CSSProperties}
                                                >
                                                    <h2>{v}</h2>
                                                </div>
                                            }
                                        }
                                    </Draggable>
                                ))
                            }
                            {provided.placeholder}
                        </div> as unknown as ReactElement
                    )
                }
            </Droppable>
        </DragDropContext>
        <div class="col" style={{justifyContent: "space-between", width: "27%"}}>
            {
                labels.map((v) => (
                    <h2 key={`${v}-2`} style={{display: "flex"}}>{v}</h2>
                ))
            }
        </div>
    </div>
}

export default OrderQuestion
