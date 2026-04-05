import Label from "./ui/Label";

export default function FormElement({ children, label, hasError = false }) {
    return (
        <Label
            label={label}
            hasError={hasError}
        >
            {children}
        </Label>
    );
}
