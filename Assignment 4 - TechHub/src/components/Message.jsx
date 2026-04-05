export default function Message({ variant, children }) {
    const styles = {
        error: "text-red-500",
        info: "text-slate-500",
    };
    return <p className={`text-sm ${styles[variant]}`}>{children}</p>;
}
