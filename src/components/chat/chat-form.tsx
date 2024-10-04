import { Input } from "antd";

interface ChatFormProps {
    onSubmit: () => void,
    value: string,
    onChange: (value: string) => void,
    isHidden: boolean,
};

export const ChatForm = ({
    onSubmit,
    value,
    onChange,
    isHidden,
}: ChatFormProps) => {
    const isDisabled = isHidden;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (!value || isDisabled) return;

        onSubmit();
    }

    if (isHidden) {
        return null;
    }

    return (
        <form className="d-flex justify-content-between gap-2 p-2" onSubmit={handleSubmit}>
            <div className="w-100">
                <Input 
                    onChange={(e) => onChange(e.target.value)}
                    value={value}
                    disabled={isDisabled}
                    style={{ color: "white", border: "1px solid white", background: "none" }}
                />
            </div>
            <div>
                <button 
                    type="submit"
                    style={{ color: "white", border: "1px solid white", background: "none", padding: "4px", borderRadius: "5px" }}
                    disabled={isDisabled}
                >
                    Chat
                </button>
            </div>
        </form>
    );
};