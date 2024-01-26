import {ChangeEvent, useState} from 'react';

// 定义Difficulties类型

const difficulties = ['Easy', 'Medium', 'Difficult', 'Experts'];

// Props接口定义
interface SudokuDifficultySelectorProps {
    onDifficultyChange: (difficulty: number) => void;
}

export default function DifficultySeletor({onDifficultyChange, defaultDiffuculty = 1}: {
    defaultDiffuculty?: number,
    onDifficultyChange?: (difficulty: number) => void
}) {
    const [difficulty, setDifficulty] = useState<number>(defaultDiffuculty - 1);

    // 当用户选择一个不同的难度时被调用
    const handleDifficultyChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const newDifficulty = event.target.value;
        setDifficulty(event.target.selectedIndex);
        onDifficultyChange && onDifficultyChange(Number(event.target.value));
    };

    return (
        <div>
            <label className="form-control w-full max-w-xs">
                <div className="label">
                    <label htmlFor="difficulty-selector">Difficulty：</label>
                </div>
                <select className="select-xs select-bordered  select-xs w-full max-w-xs"
                        id="difficulty-selector"
                        value={defaultDiffuculty}
                        onChange={handleDifficultyChange}>
                    {difficulties.map((level, index) => (
                        <option key={index} value={index + 1}>
                            {level}
                        </option>
                    ))}
                </select>
            </label>
        </div>
    );
}