import Button from "./ui/Button";

export default function TaskDeleteModal({ onClose, onDelete }) {
    return (
        <div
            className="modal-overlay fixed inset-0 w-screen h-screen bg-gray-500/50 backdrop-blur-xs z-50 overflow-y-auto flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-white max-w-xl rounded-2xl mx-auto p-8"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl">
                    Are you sure you want to delete this task?
                </h2>
                <div className="flex justify-end gap-2 mt-4">
                    <Button
                        variant="outline"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        onClick={onDelete}
                    >
                        Delete
                    </Button>
                </div>
            </div>
        </div>
    );
}
