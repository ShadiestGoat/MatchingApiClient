import { FunctionComponent } from "preact";
import { JSXInternal } from "preact/src/jsx";

const SVGdef:FunctionComponent<{d:string, onAnimationEnd?:() => void, title:string, size:string, style:JSXInternal.CSSProperties, ariaLabel?:string, className: string, onClick?:() => void}> = ({
    d,
    size,
    className,
    onClick,
    style,
    title,
    onAnimationEnd,
    ariaLabel
}) => <svg onClick={(e) => {if (e.button || !onClick) return; onClick()}} onAnimationEnd={onAnimationEnd ?? (() => {return})}
    width={size}
    height={size}
    class={className}
    style={style}
    label={ariaLabel ?? `I can work with ${title}`}
    alt={`The icon for ${title}`}
    title={title}
    about={`The icon for ${title}`}
    summary={`The icon for ${title}`}
    role={onClick ? "button" : "img"} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <title>{title}</title>
    <path d={d} strokeWidth="0.25" />
</svg>

export default SVGdef

