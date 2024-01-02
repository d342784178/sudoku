import {classnames} from "@/app/lib/util/commonUtil";
import {useState} from "react";
import {useDebounce} from "react-use";

export function Cell({colIndex, rowIndex, value, handleInput, highLight, userStepIndex}: {
    colIndex: number,
    rowIndex: number,
    value: number,
    handleInput?: Function,
    highLight?: boolean | null,
    userStepIndex: number,
}) {
    const [inputNumber, setInputNumber] = useState<number>()
    const isLight = Math.floor(rowIndex / 3) % 2 === Math.floor(colIndex / 3) % 2;
    //防抖
    const [, cancel] = useDebounce(
        () => {
            console.log(inputNumber)
            handleInput && handleInput(inputNumber, rowIndex, colIndex)
        },
        100,
        [inputNumber]
    );
    const renderUserStepIndex = userStepIndex > 0 ? (
        <div
            className="absolute top-0 right-0 bg-yellow-500 text-white text-xs px-1 py-0.5 rounded-full flex items-center justify-center h-5 w-5">
            {userStepIndex}
        </div>) : (<div/>);

    return (
        <div className="relative">
            <input
                className={classnames(
                    "rounded-lg border-4 shadow-sm text-center text-lg font-bold text-gray-700 focus:outline-none focus:border-transparent m-0.5",
                    highLight ? "border-yellow-300" : value !== -1 ? " border-gray-300" : "border-yellow-300",
                    isLight ? "bg-white" : "bg-blue-100",
                    value !== -1 ? "cursor-not-allowed" : "",
                    {"focus:ring-blue-600": !highLight},
                )}
                style={{height: 'calc(min(10vw, 40px))', WebkitAppearance: 'none'}}
                key={colIndex}
                type="number"
                disabled={value !== -1}
                min={1}
                max={9}
                value={value === -1 ? '' : value}
                onChange={(event) => setInputNumber(Number(event.target.value))}
            />
            {renderUserStepIndex}
        </div>
    )
}