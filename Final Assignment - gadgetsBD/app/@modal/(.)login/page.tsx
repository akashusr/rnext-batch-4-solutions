import Modal from "@/components/Modal";
import LoginForm from "@/components/LoginForm";

export default function LoginModal() {
    return (
        <Modal>
            <LoginForm isModal={true} />
        </Modal>
    );
}
