export default function Figure({ figure, classname }) {
    return <img
        src={`/pieces/classic/${figure.figureColor}-${figure.figureType}.png`}
        alt={figure.figureType + figure.figureColor}
        className="figure"
        data-figure-color={figure.figureColor}
        data-figure-type={figure.figureType}
    />
}