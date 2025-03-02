import { mergeClasses } from "../../lib/utils";
import { baseUiInputClasses } from "./ecorces-ui";

export type EcorcesDatePickerProps = {
    date: Date | null;
    setDate: (date: Date) => void;
    className?: string;
    minDate?: Date;
}

export const EcorcesDatePicker = (props: EcorcesDatePickerProps) => {

    const {
        date,
        setDate,
        className,
        minDate
    } = props;

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = new Date(e.target.value);
        if (!isNaN(newDate.getTime())) {
            setDate(newDate);
        }
    }

    return <input
        type="date"
        className={mergeClasses(
            baseUiInputClasses,
            "px-[0.35rem] py-[0.12rem]",
            className
        )}
        min={minDate ? minDate.toISOString().split("T")[0] : undefined}
        value={date ? date.toISOString().split("T")[0] : ""}
        onChange={onChange}
    />
}